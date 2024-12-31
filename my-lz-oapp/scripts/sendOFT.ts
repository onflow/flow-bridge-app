import { ethers } from 'hardhat'

import { MyOFTAdapter__factory } from '../typechain/factories/contracts/MyOFTAdapter__factory'

import hre from 'hardhat'

async function main() {
    // Get the signer
    const [signer] = await ethers.getSigners()

    // Get deployment from the current network
    const deployments = await hre.deployments.get('MyOFTAdapter')
    const adapterAddress = deployments.address
    console.log('Adapter address:', adapterAddress)

    // Create contract instance
    const adapter = MyOFTAdapter__factory.connect(adapterAddress, signer)

    /**
     * This is the struct for the sendParam
     * https://sepolia.arbiscan.io/address/0xdd3bffb358ef34c2964cb9ce29013d071d59094c#readContract
     */
    const sendParam = {
        dstEid: 40351, // Flow testnet EID
        to: '0x000000000000000000000000825d7531f79Be811E6ed5BD94C9c02d0eB493848', // Destination address in bytes
        amountLD: ethers.utils.parseEther('10.0'), // Amount to send
        minAmountLD: ethers.utils.parseEther('10.0'), // Minimum amount to receive
        extraOptions: '0x00030100110100000000000000000000000000030d40', // Extra options in bytes
        composeMsg: '0x', // Compose message in bytes
        oftCmd: '0x', // OFT command in bytes
    }

    try {
        // Get the token address and create token contract instance
        const tokenAddress = await adapter.token()
        const token = await ethers.getContractAt('MyFungi', tokenAddress, signer)

        // Approve adapter to spend tokens
        console.log('Approving adapter...')
        const approveTx = await token.approve(adapterAddress, sendParam.amountLD)
        await approveTx.wait()
        console.log('Approval confirmed')

        // First get the quote to know how much native token to send
        const [nativeFee, zroFee] = await adapter.quoteSend(
            sendParam,
            false // don't use ZRO token
        )

        console.log('Quote results:')
        console.log('Native fee:', ethers.utils.formatEther(nativeFee), 'ETH')
        console.log('ZRO fee:', ethers.utils.formatEther(zroFee), 'ZRO')

        // Send the transaction
        console.log('Sending transaction...')
        const tx = await adapter.send(
            sendParam,
            {
                nativeFee,
                lzTokenFee: zroFee,
            },
            signer.address,
            {
                value: nativeFee, // Use BigNumber directly instead of formatted string
            }
        )

        console.log('Transaction sent! Waiting for confirmation...')
        console.log('Transaction hash:', tx.hash)

        // Wait for the transaction to be confirmed
        const receipt = await tx.wait()
        console.log('Transaction confirmed! Block number:', receipt.blockNumber)
    } catch (error) {
        console.error('Error sending tokens:', error)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
