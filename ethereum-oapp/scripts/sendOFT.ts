import hre from 'hardhat'

import layerzeroConfig from '../config/layerzero.json'
import { networkMapping } from '../config/network-mapping'

/**
 * Send OFT tokens cross-chain
 * 
 * NOTE: For PYUSD mainnet bridging (Ethereum <-> Flow), use sendViaStargate.ts instead!
 * The PYUSD bridge routes through Stargate V2 (EID 30110), not directly to Flow.
 * 
 * This script is for direct OFT sends where peers are configured directly.
 */

async function main() {
    // Get parameters from environment variables or command line arguments
    const sourceContract = process.env.SOURCE_CONTRACT || 'PYUSDLocker'
    // Default to Stargate for mainnet PYUSD bridging
    const dstNetwork = process.env.DST_NETWORK || 'stargate'
    const amount = process.env.AMOUNT || '1' // Amount in token units (e.g., '1' for 1 PYUSD)
    const recipientAddress = process.env.RECIPIENT || '' // Will use signer address if not provided

    console.log('Source contract:', sourceContract)
    console.log('Destination network:', dstNetwork)
    console.log('Amount:', amount)
    
    // Warning for mainnet users
    if (hre.network.name === 'ethereum-mainnet' && dstNetwork === 'flow-mainnet') {
        console.log('')
        console.log('⚠️  WARNING: Direct Flow routing may not work!')
        console.log('   PYUSD bridge uses Stargate V2 routing (EID 30110)')
        console.log('   Consider using: DST_NETWORK=stargate or scripts/sendViaStargate.ts')
        console.log('')
    }

    // Map destination network name to LayerZero network name
    const lzNetwork = networkMapping[dstNetwork.toLowerCase()]
    if (!lzNetwork) {
        console.error('No LayerZero network mapping found for:', dstNetwork)
        console.error('Available networks:', Object.keys(networkMapping).join(', '))
        throw new Error(`Network ${dstNetwork} not mapped to LayerZero network`)
    }

    // Get destination EID from LayerZero config
    const dstConfig = layerzeroConfig[lzNetwork]
    if (!dstConfig) {
        throw new Error(`Network ${lzNetwork} not found in LayerZero config`)
    }

    const dstEid = parseInt(dstConfig.eid)
    console.log(`Sending to ${lzNetwork} (EID: ${dstEid})`)

    // Get the signer
    const [signer] = await hre.ethers.getSigners()
    
    // Use recipient address from env or default to signer address (padded to bytes32)
    const recipient = recipientAddress || signer.address
    const recipientBytes32 = '0x' + '00'.repeat(12) + recipient.slice(2).toLowerCase()
    console.log('Recipient:', recipient)

    // Get deployment of the specified contract (PYUSDLocker)
    const deployment = await hre.deployments.get(sourceContract)
    console.log(`${sourceContract} address:`, deployment.address)

    // Create contract instance
    const contract = await hre.ethers.getContractAt(sourceContract, deployment.address, signer)

    // Common send parameters for all contract types
    const sendParam = {
        dstEid,
        to: recipientBytes32,
        amountLD: hre.ethers.utils.parseUnits(amount, 6),
        minAmountLD: hre.ethers.utils.parseUnits(amount, 6),
        extraOptions: '0x00030100110100000000000000000000000000030d40',
        composeMsg: '0x',
        oftCmd: '0x',
    }

    try {
        // PYUSD mainnet address
        const PYUSD_ADDRESS = '0x6c3ea9036406852006290770bedfcaba0e23a0e8'
        const pyusd = await hre.ethers.getContractAt('IERC20', PYUSD_ADDRESS, signer)

        console.log('Approving PYUSDLocker to spend PYUSD...')
        const approveTx = await pyusd.approve(deployment.address, sendParam.amountLD)
        await approveTx.wait()
        console.log('Approval confirmed')

        // Rest of the sending logic remains the same
        const [nativeFee, zroFee] = await contract.quoteSend(sendParam, false)
        console.log('Quote results:')
        console.log('Native fee:', hre.ethers.utils.formatEther(nativeFee), 'ETH')
        console.log('ZRO fee:', hre.ethers.utils.formatEther(zroFee), 'ZRO')

        console.log('Sending transaction...')
        const tx = await contract.send(
            sendParam,
            {
                nativeFee,
                lzTokenFee: zroFee,
            },
            signer.address,
            {
                value: nativeFee,
            }
        )

        console.log('Transaction sent! Waiting for confirmation...')
        console.log('Transaction hash:', tx.hash)

        const receipt = await tx.wait()
        console.log('Transaction confirmed! Block number:', receipt.blockNumber)
    } catch (error) {
        console.error('Error sending tokens:', error)
        throw error
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
