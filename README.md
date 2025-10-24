# Flow Bridge - LayerZero OFT Implementations

Repository containing LayerZero Omnichain Fungible Token (OFT) implementations for cross-chain token bridging between EVM chains and Flow blockchain.

## Token Bridging Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Cross-Chain Token Bridge                        │
└─────────────────────────────────────────────────────────────────────────┘

    Source Chain (EVM)              LayerZero Protocol           Destination (Flow)
    ──────────────────              ──────────────────           ──────────────────
         
    ┌──────────────┐                                             
    │     User     │                                             
    │ (Ethereum/   │                                             
    │  Arbitrum)   │                                             
    └──────┬───────┘                                             
           │                                                     
           │ 1. Call send()                                      
           ▼                                                     
    ┌──────────────┐                                             
    │ OFT Adapter  │                                             
    │Token Locker  │                                             
    │ Lock Tokens  │                                             
    └──────┬───────┘                                             
           │                                                     
           │ 2. Emit Message                                     
           ▼                                                     
           ╔══════════════════════════════════╗                  
           ║   LayerZero Messaging Layer      ║                  
           ║                                  ║                  
           ║   ┌─────────────────────────┐   ║                  
           ║   │  Decentralized Verifier │   ║                  
           ║   │   Network (DVNs)        │   ║                  
           ║   └─────────────────────────┘   ║                  
           ║                                  ║                  
           ║   ┌─────────────────────────┐   ║                  
           ║   │   Oracle Network        │   ║                  
           ║   └─────────────────────────┘   ║                  
           ║                                  ║                  
           ╚══════════════╦═══════════════════╝                  
                          │ 3. Relay Message                     
                          │                                      
                          ▼                                      
                   ┌──────────────┐                              
                   │ OFT Contract │                              
                   │  on Flow EVM │                              
                   │ Mint Tokens  │                              
                   └──────┬───────┘                              
                          │                                      
                          │ 4. Transfer                          
                          ▼                                      
                   ┌──────────────┐                              
                   │     User     │                              
                   │   on Flow    │                              
                   │  (1:1 parity)│                              
                   └──────────────┘                              
                          
                          
    ◄─── Return Path (Flow to EVM) ───►
                          
                   ┌──────────────┐                              
                   │     User     │                              
                   │   on Flow    │                              
                   └──────┬───────┘                              
                          │                                      
                          │ 1. Call send()                       
                          ▼                                      
                   ┌──────────────┐                              
                   │ OFT Contract │                              
                   │  on Flow EVM │                              
                   │  Burn Tokens │                              
                   └──────┬───────┘                              
                          │                                      
                          │ 2. Message                           
                          ▼                                      
           ╔══════════════════════════════════╗                  
           ║   LayerZero Messaging Layer      ║                  
           ╚══════════════╦═══════════════════╝                  
           │              │ 3. Relay                             
           ▼              │                                      
    ┌──────────────┐     │                                      
    │ OFT Adapter  │◄────┘                                      
    │Token Locker  │                                             
    │Unlock Tokens │                                             
    └──────┬───────┘                                             
           │                                                     
           │ 4. Transfer                                         
           ▼                                                     
    ┌──────────────┐                                             
    │     User     │                                             
    │ (Ethereum/   │                                             
    │  Arbitrum)   │                                             
    └──────────────┘                                             
```

**Bridging Process:**

**EVM to Flow (Lock & Mint):**
1. **Source Chain (EVM)**: User calls `send()` on OFT Adapter, tokens are **locked** in the adapter contract
2. **LayerZero Protocol**: Message is encoded and sent through LayerZero's decentralized network of verifiers (DVNs) and oracles
3. **Destination Chain (Flow)**: OFT contract receives verified message and **mints** equivalent tokens on Flow EVM
4. **Result**: User receives newly minted tokens on Flow with 1:1 parity

**Flow to EVM (Burn & Unlock):**
1. **Source Chain (Flow)**: User calls `send()` on Flow OFT contract, tokens are **burned**
2. **LayerZero Protocol**: Message is relayed back through the decentralized network
3. **Destination Chain (EVM)**: OFT Adapter receives message and **unlocks** the original tokens
4. **Result**: User receives unlocked tokens on the EVM chain, maintaining 1:1 parity

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

## Deployed Contract Addresses

### EVM Testnets

#### Sepolia Testnet
- **MyOFTAdapter**: [`0x9D6e122780974a917952D70646dD50D2C4f906ae`](https://sepolia.etherscan.io/address/0x9D6e122780974a917952D70646dD50D2C4f906ae)
- **PYUSDLocker**: [`0xb077Ef2833Fd7b426146839a86100708c37bfa65`](https://sepolia.etherscan.io/address/0xb077Ef2833Fd7b426146839a86100708c37bfa65)
- **MyFungi**: [`0x39dBc26413e6eEe40265E4a7ddc5abDC64849781`](https://sepolia.etherscan.io/address/0x39dBc26413e6eEe40265E4a7ddc5abDC64849781)

#### Arbitrum Sepolia Testnet
- **MyOFTAdapter**: [`0xDD3BFfb358eF34C2964CB9ce29013D071d59094C`](https://sepolia.arbiscan.io/address/0xDD3BFfb358eF34C2964CB9ce29013D071d59094C)
- **MyOFTMock**: [`0x4e2dCCAfe86719B7BFfAc3b1041031dDd07aF5fF`](https://sepolia.arbiscan.io/address/0x4e2dCCAfe86719B7BFfAc3b1041031dDd07aF5fF)
- **MyFungi**: [`0x1605B1067Ce0D294786A09368f38063Df50C0e92`](https://sepolia.arbiscan.io/address/0x1605B1067Ce0D294786A09368f38063Df50C0e92)

#### Avalanche Fuji Testnet
- **MyOFTMock**: [`0x1119cA4D5145432b7B1CD197d136Da15e236E896`](https://testnet.snowtrace.io/address/0x1119cA4D5145432b7B1CD197d136Da15e236E896)

### EVM Mainnets

#### Ethereum Mainnet
- **PYUSDLocker**: [`0xFA0e06B54986ad96DE87a8c56Fea76FBD8d493F8`](https://etherscan.io/address/0xFA0e06B54986ad96DE87a8c56Fea76FBD8d493F8)

### Flow Networks

#### Flow Testnet
- **USDF**: [`0xf2E5A325f7D678DA511E66B1c0Ad7D5ba4dF93D3`](https://testnet.flowscan.io/evm/contract/0xf2e5a325f7d678da511e66b1c0ad7d5ba4df93d3)

#### Flow Mainnet
- **USDF**: [`0x2aabea2058b5ac2d339b163c6ab6f2b6d53aabed`](https://www.flowscan.io/evm/token/0x2aabea2058b5ac2d339b163c6ab6f2b6d53aabed)

### Solana Networks

#### Solana Devnet/Testnet
- **Program ID**: [`D6RHLYN7x69Cb5Y7dFj9T9uJrJCVT9Bt1LT71xHf7QqK`](https://explorer.solana.com/address/D6RHLYN7x69Cb5Y7dFj9T9uJrJCVT9Bt1LT71xHf7QqK?cluster=devnet)
- **Mint**: [`CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM`](https://explorer.solana.com/address/CXk2AMBfi3TwaEL2468s6zP8xq9NxTXjp9gjMgzeUynM?cluster=devnet)
- **Mint Authority**: [`A6v157j6XFJXwtT5VWXX7uLYTUrxcYGXB8R6rxrgr9hQ`](https://explorer.solana.com/address/A6v157j6XFJXwtT5VWXX7uLYTUrxcYGXB8R6rxrgr9hQ?cluster=devnet)
- **Escrow**: [`FKt7QuGTkFWHVt7RVgtEsh3rVRZMaeCdQBseyQ9Vf1PN`](https://explorer.solana.com/address/FKt7QuGTkFWHVt7RVgtEsh3rVRZMaeCdQBseyQ9Vf1PN?cluster=devnet)
- **OFT Store**: [`CFVgSccTEXbs3hN7gnCHx3FAa1L5j5StsKABTPuMaAYo`](https://explorer.solana.com/address/CFVgSccTEXbs3hN7gnCHx3FAa1L5j5StsKABTPuMaAYo?cluster=devnet)

#### Solana Mainnet
- **Program ID**: [`28EyPNAi9BMTvGuCaQrptMXjpWUi7wx8SxAFVoSZxSXe`](https://explorer.solana.com/address/28EyPNAi9BMTvGuCaQrptMXjpWUi7wx8SxAFVoSZxSXe)
- **Mint**: [`2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo`](https://explorer.solana.com/address/2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo)
- **Mint Authority**: [`22mKJkKjGEQ3rampp5YKaSsaYZ52BUkcnUN6evXGsXzz`](https://explorer.solana.com/address/22mKJkKjGEQ3rampp5YKaSsaYZ52BUkcnUN6evXGsXzz)
- **Escrow**: [`6z3QyVS36nQ9fk2YvToxqJqXqtAFsSijqgHxpzKyG5xn`](https://explorer.solana.com/address/6z3QyVS36nQ9fk2YvToxqJqXqtAFsSijqgHxpzKyG5xn)
- **OFT Store**: [`2KUb8dcZR9LyrSg4RdkQx91xX6mPQLpS1MEo6gwfvLZk`](https://explorer.solana.com/address/2KUb8dcZR9LyrSg4RdkQx91xX6mPQLpS1MEo6gwfvLZk)

## Documentation

For detailed information about each implementation:

- **[EVM OFT Guide](./ethereum-oapp/README.md)**: Complete documentation for EVM LayerZero OFT implementation
- **[Solana OFT Guide](./solana-oapp/README.md)**: Comprehensive guide for Solana OFT implementation
- **[LayerZero Documentation](https://docs.layerzero.network/)**: Official LayerZero protocol documentation

## Contributing

Please refer to the individual README files in each subdirectory for specific contribution guidelines and development practices.

## License

This project is licensed under the terms specified in the individual contract implementations.

