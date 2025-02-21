import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { EndpointId } from '@layerzerolabs/lz-definitions'
import { addresses } from '../config/addresses'
import layerZero from '../config/layerzero.json'

const OFT_ABI = [
    'function endpoint() view returns (address)',
    'function owner() view returns (address)',
    'function symbol() view returns (string)',
    'function getUlnConfig(uint32 _eid) view returns (tuple(uint64 confirmations, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs))',
]

async function main() {
    const arbitrumOFT = new Contract(addresses.testnet.arbitrum.MyOFT, OFT_ABI, (await ethers.getSigners())[0])
    const avalancheOFT = new Contract(addresses.testnet.avalanche.MyOFT, OFT_ABI, (await ethers.getSigners())[0])

    try {
        console.log('\nChecking Arbitrum OFT Configuration:')
        console.log('Contract:', addresses.testnet.arbitrum.MyOFT)
        console.log('Endpoint:', await arbitrumOFT.endpoint())
        console.log('Owner:', await arbitrumOFT.owner())

        console.log('\nChecking Avalanche OFT Configuration:')
        console.log('Contract:', addresses.testnet.avalanche.MyOFT)
        console.log('Endpoint:', await avalancheOFT.endpoint())
        console.log('Owner:', await avalancheOFT.owner())

        // Try to get ULN configs
        try {
            const arbConfig = await arbitrumOFT.getUlnConfig(EndpointId.AVALANCHE_V2_TESTNET)
            console.log('\nArbitrum ULN Config for Avalanche:', arbConfig)
        } catch (error) {
            console.log('\nFailed to get Arbitrum ULN config:', error.message)
        }

        try {
            const avaxConfig = await avalancheOFT.getUlnConfig(EndpointId.ARBSEP_V2_TESTNET)
            console.log('\nAvalanche ULN Config for Arbitrum:', avaxConfig)
        } catch (error) {
            console.log('\nFailed to get Avalanche ULN config:', error.message)
        }

    } catch (error) {
        console.error('Error:', error)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    }) 