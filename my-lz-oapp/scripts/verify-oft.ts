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

    // Check Polygon Amoy contract
    const polygonAmoyOFT = new Contract(addresses.testnet.polygonAmoy.MyOFT, abi, (await ethers.getSigners())[0])

    try {
        console.log('\nArbitrum OFT:')
        console.log('Address:', await arbitrumOFT.address)
        console.log('Endpoint:', await arbitrumOFT.endpoint())
        console.log('Owner:', await arbitrumOFT.owner())
        console.log('Symbol:', await arbitrumOFT.symbol())

        console.log('\nPolygon Amoy OFT:')
        console.log('Address:', await polygonAmoyOFT.address)
        console.log('Endpoint:', await polygonAmoyOFT.endpoint())
        console.log('Owner:', await polygonAmoyOFT.owner())
        console.log('Symbol:', await polygonAmoyOFT.symbol())

        // Verify endpoints match config
        console.log('\nEndpoint Verification:')
        console.log(
            'Arbitrum endpoint matches:',
            (await arbitrumOFT.endpoint()).toLowerCase() ===
                layerZero['Arbitrum-Sepolia-Testnet'].endpointV2.toLowerCase()
        )
        console.log(
            'Polygon Amoy endpoint matches:',
            (await polygonAmoyOFT.endpoint()).toLowerCase() ===
                layerZero['Polygon-Amoy-Testnet'].endpointV2.toLowerCase()
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
