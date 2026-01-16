import hre from 'hardhat'

import layerzeroConfig from '../config/layerzero.json'
import { networkMapping } from '../config/network-mapping'

async function main() {
    // Get parameters from environment variables with defaults for mainnet
    const sourceContract = process.env.SOURCE_CONTRACT || 'USDF'
    const dstNetwork = process.env.DST_NETWORK || 'ethereum-mainnet'
    const amount = process.env.AMOUNT || '1' // Amount in token units (e.g., '1' for 1 USDF)
    const recipientAddress = process.env.RECIPIENT || '' // Will use signer address if not provided

    console.log('Source contract:', sourceContract)
    console.log('Destination network:', dstNetwork)
    console.log('Amount:', amount)

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

    // Get deployment of the specified contract (USDF)
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
        // Rest of the sending logic remains the same
        const balance = await contract.balanceOf(signer.address)
        console.log('Balance:', hre.ethers.utils.formatUnits(balance, 6), 'USDF')

        const [nativeFee, zroFee] = await contract.quoteSend(sendParam, false)
        console.log('Quote results:')
        console.log('Native fee:', hre.ethers.utils.formatEther(nativeFee), 'FLOW')
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
