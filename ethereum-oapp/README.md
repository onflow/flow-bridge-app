<p align="center">
  <a href="https://layerzero.network">
    <img alt="LayerZero" style="width: 400px" src="https://docs.layerzero.network/img/LayerZero_Logo_White.svg"/>
  </a>
</p>

<p align="center">
  <a href="https://layerzero.network" style="color: #a77dff">Homepage</a> | <a href="https://docs.layerzero.network/" style="color: #a77dff">Docs</a> | <a href="https://layerzero.network/developers" style="color: #a77dff">Developers</a>
</p>

<h1 align="center">Bridge Tokens Between Ethereum & Flow Using LayerZero</h1>

<p align="center">
  <a href="https://layerzero.network" style="color: #a77dff">Homepage</a> | <a href="https://docs.layerzero.network/" style="color: #a77dff">Docs</a> | <a href="https://discord-layerzero.netlify.app/discord" style="color: #a77dff">Discord</a>
</p>

<p align="center">Bridge PYUSD & USDF tokens between Ethereum and Flow, or deploy your own OFT contracts using LayerZero protocol.</p>

## Table of Contents

- [What is an Omnichain Fungible Token?](#what-is-an-omnichain-fungible-token)
- [Quick Start](#quick-start)
- [Bridge PYUSD & USDF Tokens](#bridge-pyusd--usdf-tokens)
- [Deploy Your Own OFT Contracts](#deploy-your-own-oft-contracts)
- [Transfer Tokens](#transfer-tokens)
- [Supported Networks](#supported-networks)
- [Troubleshooting](#troubleshooting)

## What is an Omnichain Fungible Token?

The Omnichain Fungible Token (OFT) Standard is an ERC20 token that can be transferred across multiple blockchains without asset wrapping or middlechains.

<img alt="LayerZero" style="" src="https://docs.layerzero.network/assets/images/oft_mechanism_light-922b88c364b5156e26edc6def94069f1.jpg#gh-light-mode-only"/>

This standard works by burning tokens on the source chain and minting equivalent tokens on the destination chain through the LayerZero protocol, maintaining a unified total supply across all connected networks.

## Quick Start

### Prerequisites
- Node.js and npm/pnpm installed
- A wallet with testnet/mainnet funds for gas fees
- Basic understanding of command line tools

### Installation
```bash
pnpm install
```

### Generate TypeChain Types
Generate TypeScript types for smart contracts (required for some scripts):
```bash
npx hardhat typechain
```

### Compile Contracts
Compile Solidity contracts:
```bash
pnpm compile
```

### Environment Setup

⚠️ **CRITICAL SECURITY WARNING**: Never commit `.env` files to version control! They contain sensitive private keys.

Create a `.env` file with your private keys (this file is already in `.gitignore`):
```env
PRIVATE_KEY=your_ethereum_private_key
FLOW_PRIVATE_KEY=your_flow_private_key
```

**Important**: Make sure `.env` is listed in your `.gitignore` file and never commit it to the repository.

## Bridge PYUSD & USDF Tokens

This repository includes pre-deployed contracts for bridging PYUSD (Ethereum) and USDF (Flow) tokens. If you just want to bridge these tokens without deploying your own contracts, follow these steps.

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Generate TypeChain Types (if using quote script)
If you plan to use the quote script, generate TypeScript types:
```bash
npx hardhat typechain
```

### Step 3: Compile Contracts
```bash
pnpm compile
```

### Step 4: Configure Environment
Create a `.env` file with your wallet private keys:
```env
PRIVATE_KEY=your_ethereum_private_key_here
FLOW_PRIVATE_KEY=your_flow_private_key_here
```

### Step 5: Fund Your Wallet
Ensure your wallet has sufficient funds on the source network for gas fees:
- **Ethereum Mainnet**: ~0.01-0.05 ETH for bridging
- **Sepolia Testnet**: Testnet ETH (get from faucets)
- **Flow Mainnet/Testnet**: FLOW tokens for gas

### Step 6: Bridge Tokens

#### From Ethereum to Flow (PYUSD)
```bash
# Mainnet
SOURCE_CONTRACT=PYUSDLocker AMOUNT=100 DST_NETWORK=flow-mainnet \
npx hardhat run scripts/sendOFT.ts --network ethereum-mainnet

# Testnet
SOURCE_CONTRACT=PYUSDLocker AMOUNT=1 DST_NETWORK=flow-testnet \
npx hardhat run scripts/sendOFT.ts --network sepolia-testnet
```

#### From Flow to Ethereum (USDF)
```bash
# Mainnet
# Source: USDF on Flow Mainnet (0x2aaBea2058b5aC2D339b163C6Ab6f2b6d53aabED)
# Destination: PYUSD on Ethereum Mainnet (0xFA0e06B54986ad96DE87a8c56Fea76FBD8d493F8)
# Block Explorers:
#   - Flow: https://flowscan.io/account/0x2aaBea2058b5aC2D339b163C6Ab6f2b6d53aabED
#   - Ethereum: https://etherscan.io/address/0xFA0e06B54986ad96DE87a8c56Fea76FBD8d493F8
SOURCE_CONTRACT=USDF AMOUNT=100 DST_NETWORK=ethereum-mainnet \
npx hardhat run scripts/sendOFTFromFlow.ts --network flow-mainnet

# Testnet
# Source: USDF on Flow Testnet (0xf2E5A325f7D678DA511E66B1c0Ad7D5ba4dF93D3)
# Destination: PYUSD on Sepolia Testnet (0xb077Ef2833Fd7426146839a86100708c37bfa65)
# Block Explorers:
#   - Flow Testnet: https://testnet.flowscan.io/account/0xf2E5A325f7D678DA511E66B1c0Ad7D5ba4dF93D3
#   - Sepolia: https://sepolia.etherscan.io/address/0xb077Ef2833Fd7426146839a86100708c37bfa65
SOURCE_CONTRACT=USDF AMOUNT=1 DST_NETWORK=sepolia-testnet \
npx hardhat run scripts/sendOFTFromFlow.ts --network flow-testnet
```

### Available Contract Addresses

**PYUSD (Ethereum)**:
- **Mainnet**: `0xFA0e06B54986ad96DE87a8c56Fea76FBD8d493F8`
- **Sepolia Testnet**: `0xb077Ef2833Fd7b426146839a86100708c37bfa65`

**USDF (Flow)**:
- **Mainnet**: `0x2aaBea2058b5aC2D339b163C6Ab6f2b6d53aabED`
- **Testnet**: `0xf2E5A325f7D678DA511E66B1c0Ad7D5ba4dF93D3`

*Note: Contract addresses can also be found in the respective `deployments/[network]/[contract].json` files.*

## Deploy Your Own OFT Contracts

If you want to deploy your own OFT contracts and set up bridging between custom tokens, follow these steps.

### Step 1: Create Your OFT Contract

Choose the appropriate contract type based on your needs:

- **`MyOFT.sol`**: Standard OFT for new tokens
- **`MyOFTAdapter.sol`**: OFT Adapter for existing ERC20 tokens
- **`MyOFTFungi.sol`**: OFT with fungible token features
- **`OFTPermit.sol`**: OFT with permit functionality

Example contract (`contracts/MyOFT.sol`):
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

contract MyOFT is OFT {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate
    ) OFT(_name, _symbol, _lzEndpoint, _delegate) {
        // Additional initialization if needed
    }
}
```

### Step 2: Compile and Generate Types

Compile your contracts and generate TypeScript types:

```bash
# Compile contracts
pnpm compile

# Generate TypeScript types for contract interaction
npx hardhat typechain
```

### Step 3: Configure LayerZero Connections

Create a `layerzero.config.ts` file to define your network connections:

```typescript
import { EndpointId } from '@layerzerolabs/lz-definitions'

const ethereumContract = {
  eid: EndpointId.ETHEREUM_V2_MAINNET,
    contractName: 'MyOFT',
}

const flowContract = {
    eid: EndpointId.FLOW_V2_MAINNET,
    contractName: 'MyOFT',
}

export default {
    contracts: [
        { contract: ethereumContract },
        { contract: flowContract }
    ],
connections: [
  {
    from: ethereumContract,
            to: flowContract,
    config: {
                // Basic send/receive configuration
                sendLibrary: '0x...',
      receiveLibraryConfig: {
                    receiveLibrary: '0x...',
        gracePeriod: BigInt(0),
                },
            },
        },
        {
            from: flowContract,
            to: ethereumContract,
            config: {
                // Reverse direction config
            },
        },
    ],
}
```

### Step 4: Deploy Contracts

Deploy to your desired networks:
```bash
# Deploy to Ethereum mainnet
npx hardhat lz:deploy --contract-name MyOFT --networks ethereum-mainnet

# Deploy to Flow mainnet
npx hardhat lz:deploy --contract-name MyOFT --networks flow-mainnet
```

### Step 5: Configure Flow Connections

Wire up the contracts to enable cross-chain communication:
```bash
npx hardhat lz:oapp:wire --oapp-config layerzero.config.ts
```

### Step 6: Verify Configuration

Check that your contracts are properly connected:
```bash
npx hardhat lz:oapp:config:get --oapp-config layerzero.config.ts
```

### Step 7: Test Your Bridge

Use the transfer scripts with your custom contract:
```bash
# Replace 'MyOFT' with your contract name
SOURCE_CONTRACT=MyOFT AMOUNT=1 DST_NETWORK=flow-mainnet \
npx hardhat run scripts/sendOFT.ts --network ethereum-mainnet
```

## Transfer Tokens (Advanced Usage)

For advanced users who want to use the LayerZero hardhat tasks directly:

### Using Hardhat Tasks

Send tokens using LayerZero's built-in tasks:
```bash
# From Ethereum to Flow
npx hardhat oft:send \
  --from-chain ethereum-mainnet \
  --to-chain flow-mainnet \
  --amount 1.5 \
  --receiver 0x742d35Cc6634C0532925a3b844Bc454e4438f44e

# From Flow to Ethereum
npx hardhat oft:send-from-flow \
  --to-chain ethereum-mainnet \
  --amount 1.0 \
  --receiver 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
```

### Task Parameters
- `--from-chain`: Source chain name (e.g., ethereum-mainnet, ethereum-sepolia)
- `--to-chain`: Destination chain name (e.g., flow-mainnet, flow-testnet)
- `--amount`: Amount of tokens to send (in decimal format)
- `--receiver`: Recipient address on the destination chain
- `--gas-limit`: (Optional) Custom gas limit for the transaction
- `--debug`: (Optional) Enable debug logging

### Additional Scripts

The repository includes several utility scripts in the `scripts/` directory:
- `sendOFT.ts`: Send OFT tokens from EVM chains
- `sendOFTFromFlow.ts`: Send OFT tokens from Flow blockchain
- `quoteOFTSend.ts`: Quote the cost of sending OFT tokens (*requires TypeChain types*)
- `check-config.ts`: Verify LayerZero configuration
- `verify-oft.ts`: Verify deployed OFT contracts

## Supported Networks

### Testnet Networks
The scripts support transfers between the following testnet networks:
- Ethereum Sepolia
- Base Sepolia
- Flow Testnet

### Mainnet Networks
The following mainnet networks are supported:
- Ethereum
- Flow
- Solana (via EVM compatibility layer)

**⚠️ Mainnet Safety Notes:**
- Ensure you have sufficient funds for gas fees
- Double-check all addresses and amounts
- Test the flow on testnet first
- Verify contract addresses on block explorers

Check your `hardhat.config.ts` for the complete list of configured networks and their specific configurations.

## Troubleshooting

### Common Issues

**"Contract not found" error:**
- Ensure your contract is deployed to the network you're trying to use
- Check `deployments/[network]/` directory for deployed contract addresses

**"Insufficient funds" error:**
- Make sure your wallet has enough native tokens for gas fees
- For mainnet: ~0.01-0.05 ETH on Ethereum, FLOW tokens on Flow
- For testnet: Get test tokens from faucets

**"Network not mapped" error:**
- Check that the network name matches what's in `config/network-mapping.ts`
- Verify the network is configured in `hardhat.config.ts`

**Transaction stuck or failed:**
- Check LayerZero explorer: https://layerzeroscan.com/
- Verify your contract configuration with `npx hardhat lz:oapp:config:get`
- Ensure both source and destination contracts are properly wired

### Getting Help

- **LayerZero Documentation**: https://docs.layerzero.network/
- **Discord Community**: https://discord-layerzero.netlify.app/discord
- **GitHub Issues**: Report bugs and request features

### Useful Commands

```bash
# Check your contract configuration
npx hardhat lz:oapp:config:get --oapp-config layerzero.config.ts

# Quote the cost of a transfer
npx hardhat run scripts/quoteOFTSend.ts --network ethereum-mainnet

# Verify a deployed contract
npx hardhat run scripts/verify-oft.ts --network ethereum-mainnet
```
