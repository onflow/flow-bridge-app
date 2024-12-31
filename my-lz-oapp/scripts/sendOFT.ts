import { ethers } from 'hardhat'
import hre from 'hardhat'
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
    const [signer] = await ethers.getSigners()

    // Get deployment of the specified contract
    const deployment = await hre.deployments.get(sourceContract)
    console.log(`${sourceContract} address:`, deployment.address)

    // Create contract instance
    const contract = await ethers.getContractAt(sourceContract, deployment.address, signer)

    // Common send parameters for all contract types
    const sendParam = {
        dstEid,
        to: '0x000000000000000000000000825d7531f79Be811E6ed5BD94C9c02d0eB493848',
        amountLD: ethers.utils.parseEther(amount),
        minAmountLD: ethers.utils.parseEther(amount),
        extraOptions: '0x00030100110100000000000000000000000000030d40',
        composeMsg: '0x',
        oftCmd: '0x',
    }

    try {
        // Handle approval if it's the adapter
        if (sourceContract === 'MyOFTAdapter') {
            const tokenAddress = await contract.token()
            const token = await ethers.getContractAt('MyFungi', tokenAddress, signer)

            console.log('Approving adapter...')
            const approveTx = await token.approve(deployment.address, sendParam.amountLD)
            await approveTx.wait()
            console.log('Approval confirmed')
        }

        // Common sending logic for both contracts
        const [nativeFee, zroFee] = await contract.quoteSend(sendParam, false)
        console.log('Quote results:')
        console.log('Native fee:', ethers.utils.formatEther(nativeFee), 'ETH')
        console.log('ZRO fee:', ethers.utils.formatEther(zroFee), 'ZRO')

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
