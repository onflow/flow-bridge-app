import hre from 'hardhat'
import { Options } from '@layerzerolabs/lz-v2-utilities'

/**
 * Bridge PYUSD0 from Flow mainnet to Arbitrum via Stargate
 * 
 * This is a DIRECT bridge - simple single hop.
 * 
 * Usage:
 *   # Dry run (quote only):
 *   DRY_RUN=true AMOUNT=1 npx hardhat run scripts/sendFromFlow.ts --network flow-mainnet
 * 
 *   # Actual transfer:
 *   AMOUNT=1 npx hardhat run scripts/sendFromFlow.ts --network flow-mainnet
 * 
 *   # With custom recipient:
 *   AMOUNT=2 RECIPIENT=0xYourArbitrumAddress npx hardhat run scripts/sendFromFlow.ts --network flow-mainnet
 * 
 * Ping-Pong Testing:
 *   1. Arbitrum → Flow: npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet
 *   2. Flow → Arbitrum: npx hardhat run scripts/sendFromFlow.ts --network flow-mainnet
 */

// Arbitrum mainnet EID (Stargate)
const ARBITRUM_EID = 30110

// Flow OFT Adapter contract (receives LayerZero messages, mints/burns PYUSD0)
const FLOW_OFT_ADAPTER = '0x26d27d5AF2F6f1c14F40013C8619d97aaf015509'

// PYUSD0 Token on Flow (the actual ERC20 token)
const PYUSD0_TOKEN = '0x99aF3EeA856556646C98c8B9b2548Fe815240750'

// The OFT ABI for send operations
const OFT_ABI = [
    'function send((uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd) _sendParam, (uint256 nativeFee, uint256 lzTokenFee) _fee, address _refundAddress) external payable returns ((bytes32 guid, uint64 nonce, (uint256 amountSentLD, uint256 amountReceivedLD) oftReceipt) receipt)',
    'function quoteSend((uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd) _sendParam, bool _payInLzToken) external view returns ((uint256 nativeFee, uint256 lzTokenFee) fee)',
    'function token() external view returns (address)',
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

    console.log('===========================================')
    console.log('  Flow → Arbitrum Direct Bridge')
    console.log('===========================================')
    console.log('')
    console.log(`Amount: ${amount} PYUSD0`)
    console.log(`Dry Run: ${dryRun}`)
    console.log('')

    const [signer] = await hre.ethers.getSigners()
    const recipient = recipientAddress || signer.address

    console.log(`Sender: ${signer.address}`)
    console.log(`Recipient on Arbitrum: ${recipient}`)
    console.log('')

    // Connect to contracts
    const oft = new hre.ethers.Contract(FLOW_OFT_ADAPTER, OFT_ABI, signer)
    const token = new hre.ethers.Contract(PYUSD0_TOKEN, ERC20_ABI, signer)

    // Get token info
    const symbol = await token.symbol()
    const decimals = await token.decimals()
    console.log(`Token: ${symbol} (${decimals} decimals)`)
    console.log(`OFT Adapter: ${FLOW_OFT_ADAPTER}`)
    console.log(`Token Contract: ${PYUSD0_TOKEN}`)
    console.log('')

    // Check balance
    const balance = await token.balanceOf(signer.address)
    console.log(`Your Balance: ${hre.ethers.utils.formatUnits(balance, decimals)} ${symbol}`)
    console.log('')

    // Amount in smallest units
    const amountLD = hre.ethers.utils.parseUnits(amount, decimals)

    if (balance.lt(amountLD)) {
        console.error(`ERROR: Insufficient balance. Have ${hre.ethers.utils.formatUnits(balance, decimals)}, need ${amount}`)
        process.exit(1)
    }

    // Allow 0.5% slippage
    const minAmountLD = amountLD.mul(995).div(1000)

    // Recipient as bytes32
    const recipientBytes32 = hre.ethers.utils.hexZeroPad(recipient.toLowerCase(), 32)

    // Build extraOptions for gas on destination
    const options = Options.newOptions()
        .addExecutorLzReceiveOption(200000, 0) // 200k gas for lzReceive on Arbitrum
        .toHex()

    // Build SendParam - simple, no compose message needed!
    const sendParam = {
        dstEid: ARBITRUM_EID,
        to: recipientBytes32,
        amountLD: amountLD,
        minAmountLD: minAmountLD,
        extraOptions: options,
        composeMsg: '0x',  // No compose message for direct send
        oftCmd: '0x',
    }

    console.log('SendParam:')
    console.log(`  dstEid: ${sendParam.dstEid} (Arbitrum)`)
    console.log(`  to: ${sendParam.to}`)
    console.log(`  amountLD: ${sendParam.amountLD.toString()} (${amount} ${symbol})`)
    console.log(`  minAmountLD: ${sendParam.minAmountLD.toString()}`)
    console.log(`  extraOptions: ${sendParam.extraOptions}`)
    console.log(`  composeMsg: ${sendParam.composeMsg} (empty - direct send)`)
    console.log('')

    // Check and set approval if needed
    const currentAllowance = await token.allowance(signer.address, FLOW_OFT_ADAPTER)
    if (currentAllowance.lt(amountLD)) {
        console.log('Approving OFT Adapter to spend tokens...')
        const approveTx = await token.approve(FLOW_OFT_ADAPTER, hre.ethers.constants.MaxUint256)
        await approveTx.wait()
        console.log('Approved!')
        console.log('')
    }

    // Get quote
    console.log('Getting quote...')
    const [nativeFee, lzTokenFee] = await oft.quoteSend(sendParam, false)
    console.log(`Native fee: ${hre.ethers.utils.formatEther(nativeFee)} FLOW`)
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
    console.log('Check your balance on Arbitrum:')
    console.log(`  https://arbiscan.io/address/${recipient}`)
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
