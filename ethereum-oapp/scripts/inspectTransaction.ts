import hre from 'hardhat'

async function main() {
    const txHash = process.env.TX_HASH || '0xeb0b5567c0aff035ef07c76afbba00aa3bf743b4c376e126d7386c0b2a23a2e5'

    console.log('=== Inspecting Transaction ===')
    console.log('TX Hash:', txHash)
    console.log('')

    const provider = hre.ethers.provider

    try {
        const tx = await provider.getTransaction(txHash)
        const receipt = await provider.getTransactionReceipt(txHash)

        console.log('From:', tx.from)
        console.log('To (Contract Called):', tx.to)
        console.log('Value:', hre.ethers.utils.formatEther(tx.value), 'ETH')
        console.log('')

        // The "to" address is the contract that was called - this is likely the OFT/bridge contract
        console.log('=== This is likely the correct Ethereum bridge contract ===')
        console.log('Contract:', tx.to)
        console.log('')

        // Look for relevant events in logs
        console.log('=== Transaction Logs ===')
        for (const log of receipt.logs) {
            console.log('Log from:', log.address)
            // OFTSent event topic
            if (log.topics[0] === '0x85496b760a4b7f8d66384b9df21b381f5d1b1e79f229a47aaf4c232edc2fe59a') {
                console.log('  ^ OFTSent event detected!')
            }
            // PacketSent event topic (LayerZero)
            if (log.topics[0] === '0xab37c54e08f99ab4f125fb0dc412581b4ef12ece5905c8a11e2a4e38c1c95e4e') {
                console.log('  ^ PacketSent event detected!')
            }
        }

        console.log('')
        console.log('=== Next Steps ===')
        console.log('1. The contract at', tx.to, 'is the Ethereum OFT contract')
        console.log('2. Check this contract on Etherscan to find its peer configuration')
        console.log('3. Update deployments/ethereum-mainnet/PYUSDLocker.json with this address')
        console.log('')
        console.log('View on Etherscan: https://etherscan.io/address/' + tx.to)

    } catch (error) {
        console.error('Error:', error.message)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
