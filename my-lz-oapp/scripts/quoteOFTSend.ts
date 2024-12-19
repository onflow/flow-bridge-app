import { ethers } from 'hardhat'

import { MyOFTAdapter__factory } from '../typechain-types'

import * as layerzero from '../config/layerzero.json'

async function main() {
    // Get the signer
    const [signer] = await ethers.getSigners()

    // MyOFTAdapter contract address on Arbitrum Sepolia
    const adapterAddress = '0x...' // Replace with your deployed adapter address

    // Create contract instance
    const adapter = MyOFTAdapter__factory.connect(adapterAddress, signer)

    // Parameters for quoteSend
    const dstEid = 30144 // Flow testnet EID
    const amount = ethers.parseEther('1.0') // Amount to send
    const minAmount = ethers.parseEther('0.95') // Minimum amount to receive (with slippage)
    const extraOptions = '0x' // No extra options

    try {
        // Call quoteSend
        const [nativeFee, zroFee] = await adapter.quoteSend(dstEid, amount, minAmount, extraOptions)

        console.log('Quote results:')
        console.log('Native fee:', ethers.formatEther(nativeFee), 'ETH')
        console.log('ZRO fee:', ethers.formatEther(zroFee), 'ZRO')
    } catch (error) {
        console.error('Error getting quote:', error)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
