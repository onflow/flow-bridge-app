import { TestnetV2EndpointId } from '@layerzerolabs/lz-definitions'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const sepoliaContract: OmniPointHardhat = {
    eid: TestnetV2EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'MyOFTAdapter'
}

const flowContract: OmniPointHardhat = {
    eid: TestnetV2EndpointId.FLOW_V2_TESTNET,
    contractName: 'MyOFTFungi'
}

console.log(sepoliaContract?.eid)
console.log(flowContract?.eid)

const config: OAppOmniGraphHardhat = {
    contracts: [
        { contract: sepoliaContract },
        { contract: flowContract }
    ],
    connections: [
        {
            from: sepoliaContract,
            to: flowContract,
        },
        {
            from: flowContract,
            to: sepoliaContract,
        }
    ]
}

export default config
