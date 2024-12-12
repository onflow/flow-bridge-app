// Import the deployment files from local services directory
import mainnetData from './layerzero-v2.mainnet.json'
import testnetData from './layerzero-v2.testnet.json'

// Define TypeScript interfaces for the deployment data structure
interface ChainData {
  nativeChainId?: number
  eid: string
  executor: string
  endpointV2: string
  sendUln301?: string
  sendUln302: string
  receiveUln301?: string
  receiveUln302: string
}

interface DeploymentConfig {
  [chainName: string]: ChainData
}

// Type assert the imported JSON
const mainnetDeployments: DeploymentConfig = mainnetData
const testnetDeployments: DeploymentConfig = testnetData

export {
  mainnetDeployments,
  testnetDeployments,
  type DeploymentConfig,
  type ChainData
}
