import { EndpointId } from '@layerzerolabs/lz-definitions'
import { OAppOmniGraphConfig } from '@layerzerolabs/devtools'
import { addresses } from './config/addresses'

// Import the full contract ABI
import MyOFTArtifact from './artifacts/contracts/MyOFT.sol/MyOFT.json'

const arbitrumContract = {
    name: 'MyOFT',
    version: '1.0.0',
    eid: EndpointId.ARBSEP_V2_TESTNET,
    address: '0x...',
    abi: MyOFTArtifact.abi,
}

const avalancheContract = {
    name: 'MyOFT',
    version: '1.0.0',
    eid: EndpointId.AVALANCHE_V2_TESTNET,
    address: '0x...',
    abi: MyOFTArtifact.abi,
}

const config: OAppOmniGraphConfig = {
    contracts: [{ contract: arbitrumContract }, { contract: avalancheContract }],
    connections: [
        {
            from: arbitrumContract,
            to: avalancheContract,
            config: {
                sendConfig: {
                    ulnConfig: {
                        confirmations: BigInt(5),
                        requiredDVNs: [addresses.DVN.arbitrum],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: BigInt(5),
                        requiredDVNs: [],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    },
                },
            },
        },
        {
            from: avalancheContract,
            to: arbitrumContract,
            config: {
                sendConfig: {
                    ulnConfig: {
                        confirmations: BigInt(5),
                        requiredDVNs: [addresses.DVN.avalanche],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    },
                },
                receiveConfig: {
                    ulnConfig: {
                        confirmations: BigInt(5),
                        requiredDVNs: [],
                        optionalDVNs: [],
                        optionalDVNThreshold: 0,
                    },
                },
            },
        },
    ],
}

export default config
