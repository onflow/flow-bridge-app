import hre from 'hardhat'

// Map networks to their contracts
const NETWORK_CONTRACTS: Record<string, string[]> = {
    'sepolia-testnet': ['PYUSDLocker'], // PYUSDLocker is on Arbitrum Sepolia
    'flow-testnet': ['USDF'], // USDF is on Flow testnet
    // Add more networks and their contracts as needed
}

async function main() {
    // Get the new owner from command line
    const newOwner = process.env.NEW_OWNER || process.argv[2]
    if (!newOwner) {
        throw new Error('Please provide new owner address as argument')
    }

    // Get current network
    const network = hre.network.name
    console.log(`Current network: ${network}`)

    // Get contracts for current network
    const contracts = NETWORK_CONTRACTS[network]
    if (!contracts || contracts.length === 0) {
        console.error('Available networks:', Object.keys(NETWORK_CONTRACTS).join(', '))
        throw new Error(`No contracts configured for network: ${network}`)
    }

    // Get signer
    const [signer] = await hre.ethers.getSigners()

    // Transfer ownership for each contract on this network
    for (const contractName of contracts) {
        try {
            console.log(`\nTransferring ownership of ${contractName} to ${newOwner}...`)

            // Get deployment
            const deployment = await hre.deployments.get(contractName)
            console.log(`${contractName} address:`, deployment.address)

            // Create contract instance
            const contract = await hre.ethers.getContractAt(contractName, deployment.address, signer)

            // Get current owner
            const currentOwner = await contract.owner()
            console.log('Current owner:', currentOwner)

            // Transfer ownership
            const tx = await contract.transferOwnership(newOwner)
            console.log('Transaction sent:', tx.hash)

            await tx.wait()
            console.log(`${contractName} ownership transferred successfully`)

            // Verify new owner
            const newContractOwner = await contract.owner()
            console.log('New owner:', newContractOwner)
        } catch (error) {
            console.error(`Error transferring ownership of ${contractName}:`, error)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
