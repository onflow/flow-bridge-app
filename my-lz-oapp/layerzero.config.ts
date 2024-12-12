import { EndpointId } from '@layerzerolabs/lz-definitions'

import { addresses } from './config/addresses'
import layerZero from './config/layerzero.json'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const arbitrumTestnet = layerZero['Arbitrum-Sepolia-Testnet']
const polygonAmoyTestnet = layerZero['Polygon-Amoy-Testnet']

const arbitrumContract: OmniPointHardhat = {
    eid: EndpointId.ARBSEP_V2_TESTNET,
    contractName: 'MyOFT',
    address: addresses.testnet.arbitrum.MyOFT,
}

const polygonAmoyContract: OmniPointHardhat = {
    eid: EndpointId.AMOY_V2_TESTNET,
    contractName: 'MyOFT',
    address: addresses.testnet.polygonAmoy.MyOFT,
}

const config: OAppOmniGraphHardhat = {
    contracts: [{ contract: arbitrumContract }, { contract: polygonAmoyContract }],
    connections: [
        {
            from: arbitrumContract,
            to: polygonAmoyContract,
            config: {
                sendLibrary: arbitrumTestnet.sendUln301,
                receiveLibraryConfig: {
                    receiveLibrary: polygonAmoyTestnet.receiveUln301,
                    gracePeriod: BigInt(0),
                },
                sendConfig: {
                    ulnConfig: {
                        confirmations: BigInt(5),
                        optionalDVNThreshold: 0,
                        requiredDVNs: [addresses.DVN.arbitrum],
                        optionalDVNs: [],
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: BigInt(5),
                        optionalDVNThreshold: 0,
                        requiredDVNs: [],
                    },
                },
            },
        },
        {
            from: polygonAmoyContract,
            to: arbitrumContract,
            config: {
                sendLibrary: polygonAmoyTestnet.sendUln301,
                receiveLibraryConfig: {
                    receiveLibrary: arbitrumTestnet.receiveUln301,
                    gracePeriod: BigInt(0),
                },
                sendConfig: {
                    ulnConfig: {
                        confirmations: BigInt(5),
                        optionalDVNThreshold: 0,
                        requiredDVNs: [addresses.DVN.polygonAmoy],
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: BigInt(5),
                        optionalDVNThreshold: 0,
                        requiredDVNs: [],
                    },
                },
            },
        },
    ],
}

export default config
