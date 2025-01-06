import { TestnetV2EndpointId } from '@layerzerolabs/lz-definitions'

import { addresses } from './config/addresses'
import layerZero from './config/layerzero.json'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const arbitrumTestnet = layerZero['Arbitrum-Sepolia-Testnet']
const avalancheTestnet = layerZero['Avalanche-Fuji-Testnet']
const flowTestnet = layerZero['Flow-Testnet']
const flowMainnet = layerZero['Flow-Mainnet']
const ethereumMainnet = layerZero['Ethereum-Mainnet']

const sepoliaContract: OmniPointHardhat = {
    eid: TestnetV2EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'PYUSDLocker',
}

const flowContract: OmniPointHardhat = {
    eid: TestnetV2EndpointId.FLOW_V2_TESTNET,
    contractName: 'USDF',
}

const config: OAppOmniGraphHardhat = {
    contracts: [{ contract: sepoliaContract }, { contract: flowContract }],
    connections: [
        {
            from: sepoliaContract,
            to: flowContract,
        },
        {
            from: flowContract,
            to: sepoliaContract,
        },
    ],
}

export default config
