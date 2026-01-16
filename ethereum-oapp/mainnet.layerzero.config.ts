import { MainnetV2EndpointId } from '@layerzerolabs/lz-definitions'

import layerZero from './config/layerzero.json'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'

const flowMainnet = layerZero['EVM-on-Flow-Mainnet']
const ethereumMainnet = layerZero['Ethereum-Mainnet']
const stargateV2 = layerZero['Stargate-V2']

// Stargate V2 EID for routing PYUSD <-> PYUSD0
const STARGATE_V2_EID = 30110 as const

const EthMainnetContract: OmniPointHardhat = {
    eid: MainnetV2EndpointId.ETHEREUM_V2_MAINNET,
    contractName: 'PYUSDLocker',
}

// Note: PYUSD bridge uses Stargate V2 routing (EID 30110) not direct Flow connection
// The peer for PYUSDLocker is set to Stargate (0xFAb5891eD867A1195303251912013B92c4fC3A1D)
// which then routes to Flow (EID 30336)
const StargateContract: OmniPointHardhat = {
    eid: STARGATE_V2_EID,
    address: stargateV2.peerOnEthereum,  // Stargate peer address
}

const FlowMainnetContract: OmniPointHardhat = {
    eid: MainnetV2EndpointId.FLOW_V2_MAINNET,
    contractName: 'USDF',
}

const config: OAppOmniGraphHardhat = {
    contracts: [
        { contract: EthMainnetContract }, 
        { contract: StargateContract },
        { contract: FlowMainnetContract }
    ],
    connections: [
        // Ethereum -> Stargate V2 (actual peer connection)
        {
            from: EthMainnetContract,
            to: StargateContract,
            config: {
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
                        confirmations: BigInt(0),
                        requiredDVNs: ['0x589dedbd617e0cbcb916a9223f4d1300c294236b'],
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: BigInt(0),
                        requiredDVNs: ['0x589dedbd617e0cbcb916a9223f4d1300c294236b'],
                    },
                },
                enforcedOptions: [
                    {
                        msgType: 1,
                        optionType: ExecutorOptionType.LZ_RECEIVE,
                        gas: BigInt(253000),
                    },
                ],
            },
        },
        // Note: Flow -> Ethereum routing may also go through Stargate
        // This config is kept for reference but may need updating based on actual peer setup
        {
            from: FlowMainnetContract,
            to: EthMainnetContract,
            config: {
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
                        confirmations: BigInt(0),
                        requiredDVNs: ['0x6788f52439aca6bff597d3eec2dc9a44b8fee842'],
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: BigInt(0),
                        requiredDVNs: ['0x6788f52439aca6bff597d3eec2dc9a44b8fee842'],
                    },
                },
                enforcedOptions: [
                    {
                        msgType: 1,
                        optionType: ExecutorOptionType.LZ_RECEIVE,
                        gas: BigInt(230000),
                    },
                ],
            },
        },
    ],
}

/*
 * IMPORTANT: PYUSD Bridge Routing
 * 
 * The PYUSD <-> PYUSD0 bridge uses Stargate V2 routing:
 * - Ethereum PYUSDLocker (0xa2c323...) has peer set for EID 30110 (Stargate)
 * - NOT for EID 30336 (Flow) directly
 * 
 * Routing path:
 *   Ethereum (30101) → Stargate V2 (30110) → Flow (30336)
 * 
 * To bridge using hardhat scripts, use:
 *   npx hardhat run scripts/sendViaStargate.ts --network ethereum-mainnet
 */

export default config
