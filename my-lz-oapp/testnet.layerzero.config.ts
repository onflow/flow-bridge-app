import { EndpointId } from '@layerzerolabs/lz-definitions'

const flowContract = {
    eid: EndpointId.FLOW_V2_TESTNET,
    contractName: 'MyOFT',
}

const arbitrum_testnetContract = {
    eid: EndpointId.ARBSEP_V2_TESTNET,
    contractName: 'MyOFT',
}

export default { contracts: [{ contract: arbitrum_testnetContract }, { contract: flowContract }], connections: [] }
