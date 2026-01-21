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

### Step 1: Get a Quote (Recommended)

Before bridging, run the quote script to see:
- Protocol-enforced minimum/maximum amounts
- Expected amount you'll receive
- LayerZero messaging fees
- Any potential issues (insufficient balance, liquidity warnings)

```bash
# Quote Arbitrum → Flow:
AMOUNT=1 npx hardhat run scripts/quoteOFT.ts --network arbitrum-mainnet

# Quote Flow → Arbitrum:
AMOUNT=1 npx hardhat run scripts/quoteOFT.ts --network flow-mainnet
```

### Step 2: Execute Bridge

#### Arbitrum → Flow

```bash
# Dry run (quote only):
DRY_RUN=true AMOUNT=1 npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet

# Execute transfer:
AMOUNT=1 npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet

# With custom recipient:
AMOUNT=2 RECIPIENT=0xYourFlowAddress npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet
```

#### Flow → Arbitrum

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
| `SLIPPAGE` | Slippage tolerance in basis points (100 = 1%) | `50` (0.5%) |

### Slippage Examples

```bash
# Default 0.5% slippage
AMOUNT=100 npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet

# 1% slippage (100 basis points)
AMOUNT=100 SLIPPAGE=100 npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet

# 0.1% slippage (10 basis points) - stricter
AMOUNT=100 SLIPPAGE=10 npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet

# 0% slippage (must receive exact amount or revert)
AMOUNT=100 SLIPPAGE=0 npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet
```

## Understanding OFT Limits & Amounts

### Minimum Amount Received (`minAmountLD`)

When bridging, you specify a **minimum amount** you're willing to receive on the destination chain. This protects you from:
- Dust loss (small amounts lost during decimal conversion)
- Unexpected fees

The scripts use a **0.5% slippage tolerance** by default (configurable via `SLIPPAGE` env var). If the actual received amount would be less than your minimum, the transaction **reverts** and you keep your tokens.

```bash
# Example: Set 1% slippage tolerance
AMOUNT=100 SLIPPAGE=100 npx hardhat run scripts/sendFromArbitrum.ts --network arbitrum-mainnet
```

### Protocol Limits

The OFT contracts may enforce minimum/maximum send amounts. Use `quoteOFT.ts` to check:

```bash
AMOUNT=1 npx hardhat run scripts/quoteOFT.ts --network arbitrum-mainnet
```

This shows:
- `Min Sendable`: Protocol-enforced minimum (transaction fails if below this)
- `Max Sendable`: Protocol-enforced maximum (may be unlimited)
- `Amount Received`: Exact amount you'll receive after any dust removal

### Liquidity Considerations

This bridge uses a **lock/mint architecture**:

| Direction | Source Action | Destination Action | Liquidity Risk |
|-----------|---------------|--------------------| ---------------|
| Arbitrum → Flow | PYUSD **locked** | PYUSD0 **minted** | None (minting is unlimited) |
| Flow → Arbitrum | PYUSD0 **burned** | PYUSD **unlocked** | ⚠️ Requires locked PYUSD |

**When bridging Flow → Arbitrum**: The Arbitrum OFT Adapter must have sufficient PYUSD locked to fulfill your withdrawal. If liquidity is insufficient, your transaction may fail on the destination chain.

> **Important**: The `quoteOFT()` function itself does NOT check destination liquidity (it's a view function on the source chain). However, the `quoteOFT.ts` script **does** query Arbitrum's locked balance directly to warn you before you send.

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

**Amount below minimum:**
- Run `quoteOFT.ts` to see the protocol-enforced minimum
- Increase your amount to meet the minimum requirement

**Slippage error (minAmountLD not met):**
- The received amount after dust removal is less than your specified minimum
- Try increasing slippage tolerance or send a rounder amount

**Liquidity error (Flow → Arbitrum):**
- The Arbitrum adapter may not have enough locked PYUSD
- This can happen if more has been bridged OUT of Arbitrum than INTO it
- Wait for liquidity to be restored or try a smaller amount

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
