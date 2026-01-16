import hre from 'hardhat'

async function main() {
    const [signer] = await hre.ethers.getSigners()

    // Contract addresses
    const ETH_CONTRACT = '0xa2c323fe5a74adffad2bf3e007e36bb029606444'
    const FLOW_CONTRACT = '0x26d27d5AF2F6f1c14F40013C8619d97aaf015509'

    // Endpoint IDs
    const FLOW_EID = 30336
    const ETH_EID = 30101

    // ABI for peer checking
    const PEER_ABI = [
        'function peers(uint32 eid) view returns (bytes32)',
        'function owner() view returns (address)',
    ]

    console.log('=== Checking Peer Configuration ===\n')

    // Check Ethereum contract
    console.log('Ethereum Contract:', ETH_CONTRACT)
    const ethContract = new hre.ethers.Contract(ETH_CONTRACT, PEER_ABI, signer)

    try {
        const ethOwner = await ethContract.owner()
        console.log('  Owner:', ethOwner)
    } catch (e) {
        console.log('  Owner: Unable to read')
    }

    try {
        const flowPeer = await ethContract.peers(FLOW_EID)
        console.log('  Peer for Flow (EID 30336):', flowPeer)
        if (flowPeer === '0x0000000000000000000000000000000000000000000000000000000000000000') {
            console.log('  ⚠️  NO PEER SET for Flow!')
        }
    } catch (e) {
        console.log('  Peer for Flow: Unable to read')
    }

    console.log('')

    // Note: To check Flow contract, run with --network flow-mainnet
    if (hre.network.name === 'flow-mainnet') {
        console.log('Flow Contract:', FLOW_CONTRACT)
        const flowContract = new hre.ethers.Contract(FLOW_CONTRACT, PEER_ABI, signer)

        try {
            const flowOwner = await flowContract.owner()
            console.log('  Owner:', flowOwner)
        } catch (e) {
            console.log('  Owner: Unable to read')
        }

        try {
            const ethPeer = await flowContract.peers(ETH_EID)
            console.log('  Peer for Ethereum (EID 30101):', ethPeer)
            if (ethPeer === '0x0000000000000000000000000000000000000000000000000000000000000000') {
                console.log('  ⚠️  NO PEER SET for Ethereum!')
            }
        } catch (e) {
            console.log('  Peer for Ethereum: Unable to read')
        }
    } else {
        console.log('To check Flow contract peers, run:')
        console.log('npx hardhat run scripts/checkPeers.ts --network flow-mainnet')
    }

    console.log('\n=== Expected Peer Values ===')
    console.log('Ethereum should have Flow peer:', '0x' + '00'.repeat(12) + FLOW_CONTRACT.slice(2).toLowerCase())
    console.log('Flow should have Ethereum peer:', '0x' + '00'.repeat(12) + ETH_CONTRACT.slice(2).toLowerCase())
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
