import { ethers } from 'hardhat'
import { MyOFTAdapter__factory } from '../typechain/factories/contracts/MyOFTAdapter__factory'
import deploymentData from '../deployments/arbitrum-testnet/MyOFTAdapter.json'

async function main() {
    // Get the signer
    const [signer] = await ethers.getSigners()

    // Get the MyOFTAdapter contract address from deployment
    const adapterAddress = deploymentData.address

    console.log('Adapter address:', adapterAddress)

    // Create contract instance
    const adapter = MyOFTAdapter__factory.connect(adapterAddress, signer)

    /**
     * This is the struct for the sendParam
     * https://sepolia.arbiscan.io/address/0xdd3bffb358ef34c2964cb9ce29013d071d59094c#readContract
     * [40351,"0x000000000000000000000000825d7531f79Be811E6ed5BD94C9c02d0eB493848","10000000000000000000", "10000000000000000000", "0x00030100110100000000000000000000000000030d40", "0x", "0x"]
     */ 
    // Build SendParamStruct
    const sendParam = {
        dstEid: 40351, // Flow testnet EID
        to: '0x000000000000000000000000825d7531f79Be811E6ed5BD94C9c02d0eB493848', // Destination address in bytes
        amountLD: ethers.utils.parseEther('1.0'), // Amount to send
        minAmountLD: ethers.utils.parseEther('1.0'), // Minimum amount to receive
        extraOptions: '0x00030100110100000000000000000000000000030d40', // Extra options in bytes
        composeMsg: '0x', // Compose message in bytes
        oftCmd: '0x', // OFT command in bytes
    }

    try {
        // Call quoteSend with the struct
        const [nativeFee, zroFee] = await adapter.quoteSend(
            sendParam,
            false
        )

        console.log('Quote results:')
        console.log('Native fee:', ethers.utils.formatEther(nativeFee), 'ETH')
        console.log('ZRO fee:', ethers.utils.formatEther(zroFee), 'ZRO')

        // Calculate total fee in ETH
        const totalFee = ethers.utils.formatEther(nativeFee.add(zroFee))
        console.log('Total fee:', totalFee, 'ETH')
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
