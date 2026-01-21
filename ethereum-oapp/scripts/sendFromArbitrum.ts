import hre from 'hardhat'
import { Options } from '@layerzerolabs/lz-v2-utilities'

/**
 * Bridge PYUSD0 from Arbitrum to Flow mainnet via Stargate
 * 
 * This is a DIRECT bridge - much simpler than routing through compose messages.
 * 
 * Usage:
 *   # Dry run (quote only):
 *   DRY_RUN=true AMOUNT=1 npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet
 * 
 *   # Actual transfer:
 *   AMOUNT=1 npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet
 * 
 *   # With custom recipient:
 *   AMOUNT=2 RECIPIENT=0xYourFlowAddress npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet
 */

// Flow mainnet EID
const FLOW_EID = 30336

// Stargate PYUSD OFT Adapter on Arbitrum
// This is the contract you call send() on
const STARGATE_OFT_ARBITRUM = '0x3CD2b89C49D130C08f1d683225b2e5DeB63ff876'

// PYUSD Token on Arbitrum (PayPal USD)
const PYUSD_TOKEN_ARBITRUM = '0x46850aD61C2B7d64d08c9C754F45254596696984'

// The OFT ABI for send operations
const OFT_ABI = [
    'function send((uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd) _sendParam, (uint256 nativeFee, uint256 lzTokenFee) _fee, address _refundAddress) external payable returns ((bytes32 guid, uint64 nonce, (uint256 amountSentLD, uint256 amountReceivedLD) oftReceipt) receipt)',
    'function quoteSend((uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd) _sendParam, bool _payInLzToken) external view returns ((uint256 nativeFee, uint256 lzTokenFee) fee)',
    'function token() external view returns (address)',
    'function balanceOf(address) external view returns (uint256)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) external view returns (uint256)',
]

const ERC20_ABI = [
    'function balanceOf(address) external view returns (uint256)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) external view returns (uint256)',
    'function symbol() external view returns (string)',
    'function decimals() external view returns (uint8)',
]

async function main() {
    const amount = process.env.AMOUNT || '1'
    const recipientAddress = process.env.RECIPIENT || ''
    const dryRun = process.env.DRY_RUN === 'true'
    const slippageBps = parseInt(process.env.SLIPPAGE || '50') // Default 0.5% (50 basis points)

    console.log('===========================================')
    console.log('  Arbitrum → Flow Direct Bridge')
    console.log('===========================================')
    console.log('')
    console.log(`Amount: ${amount} PYUSD`)
    console.log(`Dry Run: ${dryRun}`)
    console.log('')

    const [signer] = await hre.ethers.getSigners()
    const recipient = recipientAddress || signer.address

    console.log(`Sender: ${signer.address}`)
    console.log(`Recipient on Flow: ${recipient}`)
    console.log('')

    // Connect to contracts
    const oft = new hre.ethers.Contract(STARGATE_OFT_ARBITRUM, OFT_ABI, signer)
    const token = new hre.ethers.Contract(PYUSD_TOKEN_ARBITRUM, ERC20_ABI, signer)

    // Get token info
    const symbol = await token.symbol()
    const decimals = await token.decimals()
    console.log(`OFT Adapter: ${STARGATE_OFT_ARBITRUM}`)
    console.log(`Token: ${symbol} at ${PYUSD_TOKEN_ARBITRUM} (${decimals} decimals)`)

    // Check balance
    const balance = await token.balanceOf(signer.address)
    console.log(`Balance: ${hre.ethers.utils.formatUnits(balance, decimals)} ${symbol}`)
    console.log('')

    // Amount in smallest units
    const amountLD = hre.ethers.utils.parseUnits(amount, decimals)
    
    if (balance.lt(amountLD)) {
        console.error(`ERROR: Insufficient balance. Have ${hre.ethers.utils.formatUnits(balance, decimals)}, need ${amount}`)
        process.exit(1)
    }

    // Apply slippage tolerance (default 0.5% = 50 bps)
    const minAmountLD = amountLD.mul(10000 - slippageBps).div(10000)
    console.log(`Slippage tolerance: ${slippageBps / 100}%`)
    console.log('')

    // Recipient as bytes32
    const recipientBytes32 = hre.ethers.utils.hexZeroPad(recipient.toLowerCase(), 32)

    // Build extraOptions for gas on destination
    const options = Options.newOptions()
        .addExecutorLzReceiveOption(200000, 0) // 200k gas for lzReceive on Flow
        .toHex()

    // Build SendParam - simple, no compose message needed!
    const sendParam = {
        dstEid: FLOW_EID,
        to: recipientBytes32,
        amountLD: amountLD,
        minAmountLD: minAmountLD,
        extraOptions: options,
        composeMsg: '0x',  // No compose message for direct send
        oftCmd: '0x',
    }

    console.log('SendParam:')
    console.log(`  dstEid: ${sendParam.dstEid} (Flow)`)
    console.log(`  to: ${sendParam.to}`)
    console.log(`  amountLD: ${sendParam.amountLD.toString()} (${amount} ${symbol})`)
    console.log(`  minAmountLD: ${sendParam.minAmountLD.toString()}`)
    console.log(`  extraOptions: ${sendParam.extraOptions}`)
    console.log(`  composeMsg: ${sendParam.composeMsg} (empty - direct send)`)
    console.log('')

    // Check and set approval if needed
    const currentAllowance = await token.allowance(signer.address, STARGATE_OFT_ARBITRUM)
    if (currentAllowance.lt(amountLD)) {
        console.log('Approving OFT Adapter to spend PYUSD...')
        const approveTx = await token.approve(STARGATE_OFT_ARBITRUM, hre.ethers.constants.MaxUint256)
        await approveTx.wait()
        console.log('Approved!')
        console.log('')
    }

    // Get quote
    console.log('Getting quote...')
    const [nativeFee, lzTokenFee] = await oft.quoteSend(sendParam, false)
    console.log(`Native fee: ${hre.ethers.utils.formatEther(nativeFee)} ETH`)
    console.log(`LZ Token fee: ${hre.ethers.utils.formatEther(lzTokenFee)}`)
    console.log('')

    if (dryRun) {
        console.log('===========================================')
        console.log('  DRY RUN - Transaction not sent')
        console.log('===========================================')
        console.log('')
        console.log('To execute for real, run without DRY_RUN=true')
        return
    }

    // Send the transaction
    console.log('Sending transaction...')
    const tx = await oft.send(
        sendParam,
        { nativeFee, lzTokenFee },
        signer.address,
        { value: nativeFee }
    )

    console.log(`Transaction hash: ${tx.hash}`)
    console.log('Waiting for confirmation...')
    
    const receipt = await tx.wait()
    console.log('')
    console.log('===========================================')
    console.log('  Transaction Confirmed!')
    console.log('===========================================')
    console.log(`Block: ${receipt.blockNumber}`)
    console.log(`Gas used: ${receipt.gasUsed.toString()}`)
    console.log('')
    console.log('Track your transfer:')
    console.log(`  https://layerzeroscan.com/tx/${tx.hash}`)
    console.log('')
    console.log('Check your balance on Flow:')
    console.log(`  https://evm.flowscan.io/address/${recipient}`)
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
