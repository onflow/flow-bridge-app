import hre from 'hardhat'
import { Options } from '@layerzerolabs/lz-v2-utilities'
import { ethers } from 'ethers'

/**
 * Quote OFT bridging costs and limits
 * 
 * This script calls quoteOFT() to show:
 * - Protocol-enforced minimum and maximum amounts
 * - Expected amount to be received (after any dust removal or fees)
 * - LayerZero messaging fees
 * - Destination chain liquidity (for Flow → Arbitrum)
 * 
 * Usage:
 *   # Quote Arbitrum → Flow:
 *   AMOUNT=1 npx hardhat run scripts/quoteOFT.ts --network arbitrum-mainnet
 * 
 *   # Quote Flow → Arbitrum:
 *   AMOUNT=1 npx hardhat run scripts/quoteOFT.ts --network flow-mainnet
 * 
 *   # With custom recipient:
 *   AMOUNT=100 RECIPIENT=0xYourAddress npx hardhat run scripts/quoteOFT.ts --network arbitrum-mainnet
 */

// Arbitrum configuration (for liquidity checks)
const ARBITRUM_CONFIG = {
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    oftAdapter: '0x3CD2b89C49D130C08f1d683225b2e5DeB63ff876',
    pyusdToken: '0x46850aD61C2B7d64d08c9C754F45254596696984',
}

// Network configurations
const NETWORK_CONFIG: Record<string, {
    oftAddress: string
    tokenAddress: string
    destinationEid: number
    destinationName: string
    nativeSymbol: string
}> = {
    'arbitrum-mainnet': {
        oftAddress: '0x3CD2b89C49D130C08f1d683225b2e5DeB63ff876',
        tokenAddress: '0x46850aD61C2B7d64d08c9C754F45254596696984',
        destinationEid: 30336,
        destinationName: 'Flow',
        nativeSymbol: 'ETH',
    },
    'flow-mainnet': {
        oftAddress: '0x26d27d5AF2F6f1c14F40013C8619d97aaf015509',
        tokenAddress: '0x99aF3EeA856556646C98c8B9b2548Fe815240750',
        destinationEid: 30110,
        destinationName: 'Arbitrum',
        nativeSymbol: 'FLOW',
    },
}

// Extended OFT ABI with quoteOFT
const OFT_ABI = [
    // quoteOFT - returns limits, fees, and expected receipt
    `function quoteOFT(
        (uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd) _sendParam
    ) external view returns (
        (uint256 minAmountLD, uint256 maxAmountLD) oftLimit,
        (int256 feeAmountLD, string description)[] oftFeeDetails,
        (uint256 amountSentLD, uint256 amountReceivedLD) oftReceipt
    )`,
    // quoteSend - returns LayerZero messaging fees
    `function quoteSend(
        (uint32 dstEid, bytes32 to, uint256 amountLD, uint256 minAmountLD, bytes extraOptions, bytes composeMsg, bytes oftCmd) _sendParam,
        bool _payInLzToken
    ) external view returns (
        (uint256 nativeFee, uint256 lzTokenFee) fee
    )`,
    'function token() external view returns (address)',
]

const ERC20_ABI = [
    'function balanceOf(address) external view returns (uint256)',
    'function symbol() external view returns (string)',
    'function decimals() external view returns (uint8)',
]

async function main() {
    const networkName = hre.network.name
    const config = NETWORK_CONFIG[networkName]

    if (!config) {
        console.error(`Unsupported network: ${networkName}`)
        console.error(`Supported networks: ${Object.keys(NETWORK_CONFIG).join(', ')}`)
        process.exit(1)
    }

    const amount = process.env.AMOUNT || '1'
    const recipientAddress = process.env.RECIPIENT || ''
    const slippageBps = parseInt(process.env.SLIPPAGE || '50') // Default 0.5% (50 basis points)

    console.log('===========================================')
    console.log(`  OFT Quote: ${networkName} → ${config.destinationName}`)
    console.log('===========================================')
    console.log('')

    const [signer] = await hre.ethers.getSigners()
    const recipient = recipientAddress || signer.address

    // Connect to contracts
    const oft = new hre.ethers.Contract(config.oftAddress, OFT_ABI, signer)
    const token = new hre.ethers.Contract(config.tokenAddress, ERC20_ABI, signer)

    // Get token info
    const symbol = await token.symbol()
    const decimals = await token.decimals()
    const balance = await token.balanceOf(signer.address)

    console.log(`Your Address: ${signer.address}`)
    console.log(`Your Balance: ${hre.ethers.utils.formatUnits(balance, decimals)} ${symbol}`)
    console.log('')
    console.log(`OFT Adapter: ${config.oftAddress}`)
    console.log(`Token: ${symbol} (${decimals} decimals)`)
    console.log('')

    // Parse amount
    const amountLD = hre.ethers.utils.parseUnits(amount, decimals)
    
    // Apply slippage tolerance (default 0.5% = 50 bps, user can adjust via SLIPPAGE env var)
    const minAmountLD = amountLD.mul(10000 - slippageBps).div(10000)

    // Recipient as bytes32
    const recipientBytes32 = hre.ethers.utils.hexZeroPad(recipient.toLowerCase(), 32)

    // Build extraOptions
    const options = Options.newOptions()
        .addExecutorLzReceiveOption(200000, 0)
        .toHex()

    // Build SendParam
    const sendParam = {
        dstEid: config.destinationEid,
        to: recipientBytes32,
        amountLD: amountLD,
        minAmountLD: minAmountLD,
        extraOptions: options,
        composeMsg: '0x',
        oftCmd: '0x',
    }

    console.log('─────────────────────────────────────────')
    console.log('  SEND PARAMETERS')
    console.log('─────────────────────────────────────────')
    console.log(`Amount to Send:      ${amount} ${symbol}`)
    console.log(`Slippage Tolerance:  ${slippageBps / 100}% (${slippageBps} bps)`)
    console.log(`Min Amount Received: ${hre.ethers.utils.formatUnits(minAmountLD, decimals)} ${symbol}`)
    console.log(`Recipient:           ${recipient}`)
    console.log(`Destination:         ${config.destinationName} (EID: ${config.destinationEid})`)
    console.log('')

    // Call quoteOFT
    console.log('─────────────────────────────────────────')
    console.log('  PROTOCOL LIMITS (from quoteOFT)')
    console.log('─────────────────────────────────────────')
    
    try {
        const [oftLimit, oftFeeDetails, oftReceipt] = await oft.quoteOFT(sendParam)

        // Display OFT Limits
        const minLimit = oftLimit.minAmountLD
        const maxLimit = oftLimit.maxAmountLD
        
        console.log(`Min Sendable:        ${hre.ethers.utils.formatUnits(minLimit, decimals)} ${symbol}`)
        if (maxLimit.eq(hre.ethers.constants.MaxUint256)) {
            console.log(`Max Sendable:        Unlimited`)
        } else {
            console.log(`Max Sendable:        ${hre.ethers.utils.formatUnits(maxLimit, decimals)} ${symbol}`)
        }
        console.log('')

        // Check if amount is within limits
        if (amountLD.lt(minLimit)) {
            console.log(`⚠️  WARNING: Amount ${amount} is BELOW the minimum limit!`)
            console.log(`   Transaction will FAIL. Increase amount to at least ${hre.ethers.utils.formatUnits(minLimit, decimals)} ${symbol}`)
            console.log('')
        }
        if (!maxLimit.eq(hre.ethers.constants.MaxUint256) && amountLD.gt(maxLimit)) {
            console.log(`⚠️  WARNING: Amount ${amount} is ABOVE the maximum limit!`)
            console.log(`   Transaction will FAIL. Decrease amount to at most ${hre.ethers.utils.formatUnits(maxLimit, decimals)} ${symbol}`)
            console.log('')
        }

        // Display OFT Receipt (expected amounts)
        console.log('─────────────────────────────────────────')
        console.log('  EXPECTED AMOUNTS')
        console.log('─────────────────────────────────────────')
        console.log(`Amount Sent:         ${hre.ethers.utils.formatUnits(oftReceipt.amountSentLD, decimals)} ${symbol}`)
        console.log(`Amount Received:     ${hre.ethers.utils.formatUnits(oftReceipt.amountReceivedLD, decimals)} ${symbol}`)
        
        const difference = oftReceipt.amountSentLD.sub(oftReceipt.amountReceivedLD)
        if (difference.gt(0)) {
            const percentLoss = difference.mul(10000).div(oftReceipt.amountSentLD)
            console.log(`Dust/Conversion Loss: ${hre.ethers.utils.formatUnits(difference, decimals)} ${symbol} (${percentLoss.toNumber() / 100}%)`)
        } else {
            console.log(`Dust/Conversion Loss: None (1:1 transfer)`)
        }
        console.log('')

        // Display fee details if any
        if (oftFeeDetails.length > 0) {
            console.log('─────────────────────────────────────────')
            console.log('  OFT FEES')
            console.log('─────────────────────────────────────────')
            for (const fee of oftFeeDetails) {
                const feeAmount = fee.feeAmountLD
                if (feeAmount.gt(0)) {
                    console.log(`${fee.description}: ${hre.ethers.utils.formatUnits(feeAmount, decimals)} ${symbol}`)
                } else if (feeAmount.lt(0)) {
                    // Negative fee means reward/credit
                    console.log(`${fee.description}: +${hre.ethers.utils.formatUnits(feeAmount.abs(), decimals)} ${symbol} (credit)`)
                }
            }
            console.log('')
        }

        // Will transaction succeed with current minAmountLD?
        if (oftReceipt.amountReceivedLD.lt(minAmountLD)) {
            console.log(`⚠️  WARNING: Expected received amount (${hre.ethers.utils.formatUnits(oftReceipt.amountReceivedLD, decimals)})`)
            console.log(`   is LESS than your minAmountLD (${hre.ethers.utils.formatUnits(minAmountLD, decimals)})`)
            console.log(`   Transaction would FAIL. Increase slippage tolerance or reduce amount.`)
            console.log('')
        }

    } catch (error: any) {
        console.log(`Failed to get quoteOFT: ${error.message}`)
        console.log('This could indicate the destination peer is not configured.')
        console.log('')
    }

    // Call quoteSend for LayerZero fees
    console.log('─────────────────────────────────────────')
    console.log('  LAYERZERO MESSAGING FEES')
    console.log('─────────────────────────────────────────')
    
    try {
        const [nativeFee, lzTokenFee] = await oft.quoteSend(sendParam, false)
        console.log(`Native Fee:          ${hre.ethers.utils.formatEther(nativeFee)} ${config.nativeSymbol}`)
        if (lzTokenFee.gt(0)) {
            console.log(`LZ Token Fee:        ${hre.ethers.utils.formatEther(lzTokenFee)}`)
        }
        console.log('')

        // Check if user has enough native token for gas
        const nativeBalance = await signer.getBalance()
        if (nativeBalance.lt(nativeFee)) {
            console.log(`⚠️  WARNING: Insufficient ${config.nativeSymbol} for fees!`)
            console.log(`   Have: ${hre.ethers.utils.formatEther(nativeBalance)} ${config.nativeSymbol}`)
            console.log(`   Need: ${hre.ethers.utils.formatEther(nativeFee)} ${config.nativeSymbol}`)
            console.log('')
        }
    } catch (error: any) {
        console.log(`Failed to get quoteSend: ${error.message}`)
        console.log('')
    }

    // Summary
    console.log('===========================================')
    console.log('  SUMMARY')
    console.log('===========================================')
    if (balance.lt(amountLD)) {
        console.log(`❌ Insufficient ${symbol} balance`)
    } else {
        console.log(`✓ You have enough ${symbol}`)
    }
    console.log('')
    console.log('To execute this transfer:')
    if (networkName === 'arbitrum-mainnet') {
        console.log(`  AMOUNT=${amount} npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet`)
    } else if (networkName === 'flow-mainnet') {
        console.log(`  AMOUNT=${amount} npx hardhat run scripts/sendFromFlow.ts --network flow-mainnet`)
    }
    console.log('')

    // Check destination liquidity for Flow → Arbitrum
    if (networkName === 'flow-mainnet') {
        console.log('─────────────────────────────────────────')
        console.log('  ARBITRUM LIQUIDITY CHECK')
        console.log('─────────────────────────────────────────')
        console.log('Querying Arbitrum OFT Adapter balance...')
        console.log('')
        
        try {
            // Connect to Arbitrum to check locked PYUSD balance
            const arbProvider = new ethers.providers.JsonRpcProvider(ARBITRUM_CONFIG.rpcUrl)
            const arbPyusd = new ethers.Contract(
                ARBITRUM_CONFIG.pyusdToken,
                ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
                arbProvider
            )
            
            const lockedBalance = await arbPyusd.balanceOf(ARBITRUM_CONFIG.oftAdapter)
            const arbDecimals = await arbPyusd.decimals()
            
            console.log(`Locked PYUSD in Adapter: ${ethers.utils.formatUnits(lockedBalance, arbDecimals)} PYUSD`)
            console.log(`Your requested amount:   ${amount} PYUSD0`)
            console.log('')
            
            if (lockedBalance.lt(amountLD)) {
                const shortfall = amountLD.sub(lockedBalance)
                console.log('❌ INSUFFICIENT LIQUIDITY!')
                console.log(`   The Arbitrum adapter only has ${ethers.utils.formatUnits(lockedBalance, arbDecimals)} PYUSD locked.`)
                console.log(`   You're trying to bridge ${amount} PYUSD0.`)
                console.log(`   Shortfall: ${ethers.utils.formatUnits(shortfall, arbDecimals)} PYUSD`)
                console.log('')
                console.log('   Your transaction will FAIL on the destination chain!')
                console.log('   Options:')
                console.log('   - Bridge a smaller amount (max: ' + ethers.utils.formatUnits(lockedBalance, arbDecimals) + ' PYUSD)')
                console.log('   - Wait for more liquidity to be bridged TO Arbitrum')
                console.log('')
            } else {
                const remaining = lockedBalance.sub(amountLD)
                console.log('✓ Sufficient liquidity available')
                console.log(`   After your transfer: ${ethers.utils.formatUnits(remaining, arbDecimals)} PYUSD will remain locked`)
                console.log('')
            }
        } catch (error: any) {
            console.log(`⚠️  Could not check Arbitrum liquidity: ${error.message}`)
            console.log('   Proceed with caution - liquidity status unknown.')
            console.log('')
        }
    }
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
