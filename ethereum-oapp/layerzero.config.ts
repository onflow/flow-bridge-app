import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
import layerZero from './config/layerzero.json'

import type {
    OAppEdgeConfig,
    OAppEnforcedOption,
    OAppOmniGraphHardhat,
    OmniEdgeHardhat,
    OmniPointHardhat,
} from '@layerzerolabs/toolbox-hardhat'

const flowMainnet = layerZero['EVM-on-Flow-Mainnet']
const ethereumMainnet = layerZero['Ethereum-Mainnet']

// --- ULN required DVNs (Flow EID 30336 / Ethereum EID 30101) ---
// Canonical four are below. To require more verifiers: append to ADDITIONAL_* only
// after confirming each address exists on that chain (LayerZero DVN registry / metadata).
// Send config on one chain must pair with receive config on the other (same count & operators).
const FLOW_MAINNET_BASE_DVNS = [
    '0x3c61aad6d402d867c653f603558f4b8f91abe952', // Nethermind
    '0x6788f52439aca6bff597d3eec2dc9a44b8fee842', // LayerZero Labs
    '0xdd7b5e1db4aafd5c8ec3b764efb8ed265aa5445b', // Horizen
    '0xe4e65d80deb0e2c8391215bcba4b5f7603420407', // Canary
] as const

/** Extra Flow DVN contracts to require (must be live on Flow mainnet ULN). */
const ADDITIONAL_FLOW_REQUIRED_DVNS: string[] = [
    // e.g. '0x...',
]

const FLOW_MAINNET_REQUIRED_DVNS: string[] = [...FLOW_MAINNET_BASE_DVNS, ...ADDITIONAL_FLOW_REQUIRED_DVNS]

const ETHEREUM_MAINNET_BASE_DVNS = [
    '0xa59ba433ac34d2927232918ef5b2eaafcf130ba5', // Nethermind
    '0x589dedbd617e0cbcb916a9223f4d1300c294236b', // LayerZero Labs
    '0x380275805876ff19055ea900cdb2b46a94ecf20d', // Horizen
    '0xa4fe5a5b9a846458a70cd0748228aed3bf65c2cd', // Canary
] as const

/** Extra Ethereum DVN contracts to require (must be live on Ethereum mainnet ULN). */
const ADDITIONAL_ETHEREUM_REQUIRED_DVNS: string[] = [
    // e.g. '0x...',
]

const ETHEREUM_MAINNET_REQUIRED_DVNS: string[] = [...ETHEREUM_MAINNET_BASE_DVNS, ...ADDITIONAL_ETHEREUM_REQUIRED_DVNS]

// =============================================================================
// USDF <> Ethereum mainnet
// =============================================================================
const usdfFlow: OmniPointHardhat = {
    eid: EndpointId.FLOW_V2_MAINNET,
    contractName: 'USDF',
    address: '0x2aabea2058b5ac2d339b163c6ab6f2b6d53aabed', // Flow OFT — https://evm.flowscan.io/address/0x2aabea2058b5ac2d339b163c6ab6f2b6d53aabed
}

const usdfEthereum: OmniPointHardhat = {
    eid: EndpointId.ETHEREUM_V2_MAINNET,
    contractName: 'USDFMeshPYUSDLocker',
    address: '0xfa0e06b54986ad96de87a8c56fea76fbd8d493f8', // https://etherscan.io/address/0xfa0e06b54986ad96de87a8c56fea76fbd8d493f8
}

const flowToEthEnforcedOptions: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 200000,
        value: 0,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 200000,
        value: 0,
    },
]

const mainnetMeshConnection = (from: OmniPointHardhat, to: OmniPointHardhat): OmniEdgeHardhat<OAppEdgeConfig> => ({
    from,
    to,
    config: {
        enforcedOptions: flowToEthEnforcedOptions,
        sendLibrary: flowMainnet.sendUln302,
        receiveLibraryConfig: {
            receiveLibrary: flowMainnet.receiveUln302,
            gracePeriod: BigInt(0),
        },
        sendConfig: {
            executorConfig: {
                executor: flowMainnet.executor,
                maxMessageSize: 10000,
            },
            ulnConfig: {
                confirmations: BigInt(20),
                requiredDVNs: FLOW_MAINNET_REQUIRED_DVNS,
                optionalDVNs: [],
                optionalDVNThreshold: 0,
            },
        },
        receiveConfig: {
            ulnConfig: {
                confirmations: BigInt(15),
                requiredDVNs: FLOW_MAINNET_REQUIRED_DVNS,
                optionalDVNs: [],
                optionalDVNThreshold: 0,
            },
        },
    },
})

const ethToFlowEnforcedOptions: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 200000,
        value: 0,
    },
    {
        msgType: 2,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 200000,
        value: 0,
    },
]

const mainnetMeshConnectionReverse = (
    from: OmniPointHardhat,
    to: OmniPointHardhat
): OmniEdgeHardhat<OAppEdgeConfig> => ({
    from,
    to,
    config: {
        enforcedOptions: ethToFlowEnforcedOptions,
        sendLibrary: ethereumMainnet.sendUln302,
        receiveLibraryConfig: {
            receiveLibrary: ethereumMainnet.receiveUln302,
            gracePeriod: BigInt(0),
        },
        sendConfig: {
            executorConfig: {
                executor: ethereumMainnet.executor,
                maxMessageSize: 10000,
            },
            ulnConfig: {
                confirmations: BigInt(15),
                requiredDVNs: ETHEREUM_MAINNET_REQUIRED_DVNS,
                optionalDVNs: [],
                optionalDVNThreshold: 0,
            },
        },
        receiveConfig: {
            ulnConfig: {
                confirmations: BigInt(20),
                requiredDVNs: ETHEREUM_MAINNET_REQUIRED_DVNS,
                optionalDVNs: [],
                optionalDVNThreshold: 0,
            },
        },
    },
})

const config: OAppOmniGraphHardhat = {
    contracts: [{ contract: usdfFlow }, { contract: usdfEthereum }],
    connections: [
        mainnetMeshConnection(usdfFlow, usdfEthereum),
        mainnetMeshConnectionReverse(usdfEthereum, usdfFlow),
    ],
}

export default config
