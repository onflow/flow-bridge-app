<p align="center">
  <a href="https://layerzero.network">
    <img alt="LayerZero" style="width: 400px" src="https://docs.layerzero.network/img/LayerZero_Logo_White.svg"/>
  </a>
</p>

<h1 align="center">Bridge PYUSD Between Arbitrum & Flow</h1>

<p align="center">
  Bridge PYUSD tokens between Arbitrum and Flow using LayerZero protocol.
</p>

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment

Create a `.env` file with your private key:
```bash
echo "PRIVATE_KEY=your_private_key_here" > .env
```

⚠️ **Never commit `.env` files to version control!**

### 3. Compile Contracts
```bash
pnpm compile
```

## Contract Addresses

### Arbitrum
| Contract | Address | Description |
|----------|---------|-------------|
| OFT Adapter | `0x3CD2b89C49D130C08f1d683225b2e5DeB63ff876` | Call `send()` on this contract |
| PYUSD Token | `0x46850aD61C2B7d64d08c9C754F45254596696984` | PayPal USD on Arbitrum |

### Flow
| Contract | Address | Description |
|----------|---------|-------------|
| OFT Adapter | `0x26d27d5AF2F6f1c14F40013C8619d97aaf015509` | Call `send()` on this contract |
| **PYUSD0 Token** ⭐ | `0x99aF3EeA856556646C98c8B9b2548Fe815240750` | The token you receive after bridging |

> **Note**: Check your balance at the **PYUSD0 Token** address, not the OFT Adapter.

## Bridge Commands

### Arbitrum → Flow

```bash
# Dry run (quote only):
DRY_RUN=true AMOUNT=1 npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet

# Execute transfer:
AMOUNT=1 npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet

# With custom recipient:
AMOUNT=2 RECIPIENT=0xYourFlowAddress npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet
```

### Flow → Arbitrum

```bash
# Dry run (quote only):
DRY_RUN=true AMOUNT=1 npx hardhat run scripts/sendFromFlow.ts --network flow-mainnet

# Execute transfer:
AMOUNT=1 npx hardhat run scripts/sendFromFlow.ts --network flow-mainnet

# With custom recipient:
AMOUNT=2 RECIPIENT=0xYourArbitrumAddress npx hardhat run scripts/sendFromFlow.ts --network flow-mainnet
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AMOUNT` | Amount of tokens to bridge | `1` |
| `RECIPIENT` | Destination address | Your wallet address |
| `DRY_RUN` | Set to `true` for quote only | `false` |

## Track Your Transaction

After sending, track your cross-chain message at:
- **LayerZero Scan**: https://layerzeroscan.com/

Enter your transaction hash to see the message status. Transfers typically complete in 2-5 minutes.

## Check Your Balance

### On Flow
```bash
# Check PYUSD0 balance
cast call 0x99aF3EeA856556646C98c8B9b2548Fe815240750 "balanceOf(address)(uint256)" YOUR_ADDRESS --rpc-url https://mainnet.evm.nodes.onflow.org
```

Or view on [Flowscan](https://evm.flowscan.io/token/0x99aF3EeA856556646C98c8B9b2548Fe815240750)

### On Arbitrum
```bash
# Check PYUSD balance
cast call 0x46850aD61C2B7d64d08c9C754F45254596696984 "balanceOf(address)(uint256)" YOUR_ADDRESS --rpc-url https://arb1.arbitrum.io/rpc
```

Or view on [Arbiscan](https://arbiscan.io/token/0x46850aD61C2B7d64d08c9C754F45254596696984)

## Troubleshooting

**Transaction successful but tokens not received:**
- Check [LayerZero Scan](https://layerzeroscan.com/) for message status
- Messages typically take 2-5 minutes to be delivered
- Verify you're checking the correct token address (PYUSD0 on Flow, PYUSD on Arbitrum)

**Insufficient balance error:**
- Ensure you have enough tokens on the source chain
- Ensure you have native tokens for gas (ETH on Arbitrum, FLOW on Flow)

**RPC timeout:**
- Try again or use a different RPC endpoint
- Arbitrum: `https://arb1.arbitrum.io/rpc`
- Flow: `https://mainnet.evm.nodes.onflow.org`

## Network Information

| Network | Chain ID | EID | RPC |
|---------|----------|-----|-----|
| Arbitrum | 42161 | 30110 | https://arb1.arbitrum.io/rpc |
| Flow | 747 | 30336 | https://mainnet.evm.nodes.onflow.org |

## Getting Help

- **LayerZero Scan**: https://layerzeroscan.com/
- **LayerZero Docs**: https://docs.layerzero.network/
- **Discord**: https://discord-layerzero.netlify.app/discord

---

## Advanced: Getting PYUSD on Arbitrum

If you have PYUSD on Ethereum and need to get it to Arbitrum first:

1. Go to [Stargate Finance](https://stargate.finance/bridge)
2. Connect your wallet
3. Select PYUSD: Ethereum → Arbitrum
4. Complete the bridge

Then use the scripts above to bridge from Arbitrum to Flow.
