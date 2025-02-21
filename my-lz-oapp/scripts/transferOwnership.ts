import hre from 'hardhat'

// Map networks to their contracts
const NETWORK_CONTRACTS: Record<string, string[]> = {
    'ethereum-mainnet': ['PYUSDLocker'], // PYUSDLocker is on Ethereum Mainnet
    'flow-mainnet': ['USDF'], // USDF is on Flow Mainnet
    'sepolia-testnet': ['PYUSDLocker'], // PYUSDLocker is on Sepolia testnet
    'flow-testnet': ['USDF'], // USDF is on Flow testnet
    // Add more networks and their contracts as needed
}

/**
 * Script to transfer ownership and set delegate of contracts
 *
 * Usage:
 * For PYUSDLocker on Ethereum Mainnet:
 * ```
 * NEW_OWNER=0xNewOwnerAddress npx hardhat run scripts/transferOwnership.ts --network ethereum-mainnet
 * ```
 *
 * For USDF on Flow Mainnet:
 * ```
 * NEW_OWNER=0xNewOwnerAddress npx hardhat run scripts/transferOwnership.ts --network flow-mainnet
 * ```
 *
 * Make sure:
 * 1. You're using the current owner's account (check PRIVATE_KEY in .env)
 * 2. You have enough native tokens for gas
 * 3. The new owner address is correct (transfers can't be undone)
 * 4. The same address will be used for both owner and delegate
 */
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

            // Verify signer is current owner
            if (currentOwner.toLowerCase() !== signer.address.toLowerCase()) {
                throw new Error(
                    `Signer ${signer.address} is not the current owner ${currentOwner}. Make sure you're using the correct PRIVATE_KEY in .env`
                )
            }

            // Check if already owned by target address
            if (currentOwner.toLowerCase() === newOwner.toLowerCase()) {
                console.log('Already owned by target address, skipping ownership transfer')
            } else {
                // Transfer ownership
                const ownerTx = await contract.transferOwnership(newOwner)
                console.log('Ownership transaction sent:', ownerTx.hash)
                await ownerTx.wait()
                console.log('Ownership transferred successfully')
            }

            // Get current delegate
            try {
                const currentDelegate = await contract.delegate()
                console.log('Current delegate:', currentDelegate)

                // Check if already delegated to target address
                if (currentDelegate.toLowerCase() === newOwner.toLowerCase()) {
                    console.log('Already delegated to target address, skipping delegate transfer')
                } else {
                    // Set delegate (same as owner)
                    const delegateTx = await contract.setDelegate(newOwner)
                    console.log('Delegate transaction sent:', delegateTx.hash)
                    await delegateTx.wait()
                    console.log('Delegate set successfully')
                }
            } catch (error) {
                console.log('No delegate function found or error checking delegate')
            }

            // Verify new owner and delegate
            const newContractOwner = await contract.owner()
            console.log('New owner:', newContractOwner)

            try {
                const newContractDelegate = await contract.delegate()
                console.log('New delegate:', newContractDelegate)
            } catch {
                // Skip delegate verification if function doesn't exist
            }
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
