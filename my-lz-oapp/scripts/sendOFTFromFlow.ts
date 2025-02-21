import hre from 'hardhat'

import { addressToBytes32 } from '@layerzerolabs/lz-v2-utilities'

import layerzeroConfig from '../config/layerzero.json'
import { networkMapping } from '../config/network-mapping'

async function main() {
    // Get source contract name from command line arguments
    const sourceContract = process.env.SOURCE_CONTRACT || process.argv[2]
    const amount = process.env.AMOUNT || process.argv[3]
    if (!sourceContract) {
        throw new Error('Please provide source contract name as first argument')
    }
    console.log('Source contract:', sourceContract)

    // Get destination network from command line arguments
    const dstNetwork = process.env.DST_NETWORK || process.argv[3]
    if (!dstNetwork) {
        throw new Error('Please provide destination network as second argument')
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

    // Get deployment of the specified contract (PYUSDLocker)
    const deployment = await hre.deployments.get(sourceContract)
    console.log(`${sourceContract} address:`, deployment.address)

    // Create contract instance
    const contract = await hre.ethers.getContractAt(sourceContract, deployment.address, signer)

    // Common send parameters for all contract types
    const sendParam = {
        dstEid,
        to: addressToBytes32('EZpp2VWrSpQ4pnk8J9AkDpWjyafhWypny5ENNPmGMPLx'),
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
