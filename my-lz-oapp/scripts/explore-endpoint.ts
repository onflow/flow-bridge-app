import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import layerZero from '../config/layerzero.json'

// EndpointV2 ABI - just the functions we need
const abi = [
    "function isSupportedEid(uint32 _eid) view returns (bool)",
]

async function main() {
    // Get Flow testnet endpoint
    const flowEndpoint = layerZero['Flow-Testnet'].endpointV2

    // Connect to Flow endpoint using basic Contract
    const endpoint = new Contract(flowEndpoint, abi, (await ethers.getSigners())[0])

    try {
        // Get EIDs for Arbitrum and Polygon Amoy
        const arbitrumEid = layerZero['Arbitrum-Sepolia-Testnet'].eid
        const polygonAmoyEid = layerZero['Polygon-Amoy-Testnet'].eid

        // Check support
        const isArbitrumSupported = await endpoint.isSupportedEid(arbitrumEid)
        const isPolygonAmoySupported = await endpoint.isSupportedEid(polygonAmoyEid)

        console.log('\nChecking Flow testnet endpoint:', flowEndpoint)
        console.log(`Is Arbitrum (EID: ${arbitrumEid}) supported:`, isArbitrumSupported)
        console.log(`Is Polygon Amoy (EID: ${polygonAmoyEid}) supported:`, isPolygonAmoySupported)
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
