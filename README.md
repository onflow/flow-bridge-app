# Flow Bridge - LayerZero OFT Implementations

Repository containing LayerZero Omnichain Fungible Token (OFT) implementations for cross-chain token bridging between EVM chains and Flow blockchain.

## Project Structure

This repository contains multiple implementations for cross-chain token bridging:

### ethereum-oapp/
**EVM LayerZero OFT Implementation**

A comprehensive LayerZero OFT (Omnichain Fungible Token) implementation for EVM-compatible blockchains. This directory contains:

- **Smart Contracts**: Multiple OFT contract implementations (`MyOFT.sol`, `MyOFTAdapter.sol`, `MyOFTFungi.sol`, etc.)
- **Deployment Scripts**: Hardhat-based deployment and configuration tools
- **Testing**: Both Hardhat and Foundry test suites
- **Configuration**: LayerZero network configurations for multiple EVM chains
- **Custom Scripts**: Token transfer utilities for EVM-to-EVM and EVM-to-Flow bridging

**Key Features:**
- Multi-chain deployment support (Ethereum, Arbitrum, Base, Avalanche, etc.)
- LayerZero DevTools integration with helper tasks
- Cross-chain configuration management
- Token minting and burning mechanisms
- OFT transfer scripts with environment variable support

**Supported Networks:**
- Testnets: Sepolia, Base Sepolia, Arbitrum Sepolia, Avalanche Fuji
- Mainnets: Ethereum, Flow, Arbitrum, Base, Avalanche

### solana-oapp/
**Solana LayerZero OFT Implementation**

A complete Solana-based OFT implementation using Anchor framework for cross-chain token bridging. This directory contains:

- **Programs**: Solana programs written in Rust (`oft/`, `endpoint-mock/`)
- **Anchor Framework**: Complete Anchor project setup with tests
- **Deployment Tools**: Solana CLI deployment scripts and utilities
- **Configuration**: LayerZero configuration for Solana networks
- **Tasks**: Hardhat tasks for Solana OFT operations

**Key Features:**
- Solana program deployment and management
- SPL token integration with OFT standard
- Cross-chain messaging with LayerZero
- Mint authority multisig support
- Token creation and transfer utilities

**Requirements:**
- Rust 1.75.0, Anchor 0.29, Solana CLI 1.17.31
- Docker for program builds
- Node.js for deployment scripts

**Supported Networks:**
- Solana Devnet/Testnet and Mainnet-beta
- Cross-chain compatibility with EVM networks


## Technologies Used

- **LayerZero**: Omnichain communication protocol
- **Solidity**: Smart contract development
- **Rust/Anchor**: Solana program development
- **Hardhat/Foundry**: EVM development and testing
- **TypeScript**: Type-safe development

## Getting Started

### Prerequisites

1. **For EVM Development:**
   - Node.js and npm/pnpm
   - Hardhat and Foundry
   - Private keys for deployment networks

2. **For Solana Development:**
   - Rust toolchain
   - Anchor framework
   - Solana CLI tools
   - Docker

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd flow-bridge-app
   ```

2. **Choose your implementation:**
   - For **EVM chains**: Navigate to `ethereum-oapp/`
   - For **Solana**: Navigate to `solana-oapp/`

3. **Follow the setup instructions in each directory's README:**
   - [EVM OFT Guide](./ethereum-oapp/README.md)
   - [Solana OFT Guide](./solana-oapp/README.md)

## Development Workflow

### Deploying Contracts

**EVM Networks:**
```bash
cd ethereum-oapp
npx hardhat lz:deploy
```

**Solana:**
```bash
cd solana-oapp
solana program deploy --program-id target/deploy/oft-keypair.json target/verifiable/oft.so -u devnet
```

### Configuring Cross-Chain Connections

**EVM Networks:**
```bash
npx hardhat lz:oapp:wire --oapp-config layerzero.config.ts
```

**Solana:**
```bash
npx hardhat lz:oapp:wire --oapp-config layerzero.config.ts --solana-secret-key <PRIVATE_KEY>
```

### Transferring Tokens

**EVM to EVM:**
```bash
npx hardhat oft:send --from-chain ethereum-mainnet --to-chain flow-mainnet --amount 1.5 --receiver <ADDRESS>
```

**EVM to Solana:**
```bash
npx hardhat --network sepolia-testnet send --dst-eid 40168 --amount <AMOUNT> --to <ADDRESS>
```

**Solana to EVM:**
```bash
npx hardhat lz:oft:solana:send --amount <AMOUNT> --from-eid 40168 --to <ADDRESS> --to-eid 40161
```

## Documentation

For detailed information about each implementation:

- **[EVM OFT Guide](./ethereum-oapp/README.md)**: Complete documentation for EVM LayerZero OFT implementation
- **[Solana OFT Guide](./solana-oapp/README.md)**: Comprehensive guide for Solana OFT implementation
- **[LayerZero Documentation](https://docs.layerzero.network/)**: Official LayerZero protocol documentation

## Contributing

Please refer to the individual README files in each subdirectory for specific contribution guidelines and development practices.

## License

This project is licensed under the terms specified in the individual contract implementations.

