import { TestnetV2EndpointId } from '@layerzerolabs/lz-definitions'

import layerZero from './config/layerzero.json'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const arbitrumTestnet = layerZero['Arbitrum-Sepolia-Testnet']
const avalancheTestnet = layerZero['Avalanche-Fuji-Testnet']
const flowTestnet = layerZero['Flow-Testnet']

const arbitrumContract: OmniPointHardhat = {
    eid: TestnetV2EndpointId.ARBSEP_V2_TESTNET,
    contractName: 'MyOFTAdapter',
}

const flowContract: OmniPointHardhat = {
    eid: TestnetV2EndpointId.FLOW_V2_TESTNET,
    contractName: 'MyOFTFungi',
}

const config: OAppOmniGraphHardhat = {
    contracts: [{ contract: arbitrumContract }, { contract: flowContract }],
    connections: [
        {
            from: arbitrumContract,
            to: flowContract,
        },
        {
            from: flowContract,
            to: arbitrumContract,
        },
    ],
}

export default config
