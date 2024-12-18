import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { addresses } from '../config/addresses'
import layerZero from '../config/layerzero.json'

// OFT ABI - just the functions we need
const abi = [
    'function endpoint() view returns (address)',
    'function owner() view returns (address)',
    'function symbol() view returns (string)',
]

async function main() {
    // Check Arbitrum contract
    const arbitrumOFT = new Contract(addresses.testnet.arbitrum.MyOFT, abi, (await ethers.getSigners())[0])

    // Check Avalanche contract
    const avalancheOFT = new Contract(addresses.testnet.avalanche.MyOFT, abi, (await ethers.getSigners())[0])

    try {
        console.log('\nArbitrum OFT:')
        console.log('Address:', await arbitrumOFT.address)
        console.log('Endpoint:', await arbitrumOFT.endpoint())
        console.log('Owner:', await arbitrumOFT.owner())
        console.log('Symbol:', await arbitrumOFT.symbol())

        console.log('\nAvalanche OFT:')
        console.log('Address:', await avalancheOFT.address)
        console.log('Endpoint:', await avalancheOFT.endpoint())
        console.log('Owner:', await avalancheOFT.owner())
        console.log('Symbol:', await avalancheOFT.symbol())

        // Verify endpoints match config
        console.log('\nEndpoint Verification:')
        console.log(
            'Arbitrum endpoint matches:',
            (await arbitrumOFT.endpoint()).toLowerCase() ===
                layerZero['Arbitrum-Sepolia-Testnet'].endpointV2.toLowerCase()
        )
        console.log(
            'Avalanche endpoint matches:',
            (await avalancheOFT.endpoint()).toLowerCase() ===
                layerZero['Avalanche-Fuji-Testnet'].endpointV2.toLowerCase()
        )
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
