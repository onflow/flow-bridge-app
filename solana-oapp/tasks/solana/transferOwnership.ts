import { task } from "hardhat/config"
import {
  Connection,
  PublicKey,
  Keypair,
  TransactionInstruction,
  Transaction,
  SimulatedTransactionResponse,
  TransactionSignature,
} from "@solana/web3.js"

import * as anchor from "@coral-xyz/anchor"
import assert from "assert";
import bs58 from 'bs58';
import { BPF_UPGRADE_LOADER_ID } from '@solana/spl-governance'
import { WalletSigner } from '@solana/spl-governance'

class TransactionError extends Error {
  public txid: string
  constructor(message: string, txid?: string) {
    super(message)
    this.txid = txid!
  }
}
function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function getUnixTs() {
  return new Date().getTime() / 1000
}

const DEFAULT_TIMEOUT = 31000

async function sendTransaction({
  transaction,
  wallet,
  signers = [],
  connection,
  timeout = DEFAULT_TIMEOUT,
}: {
  transaction: Transaction
  wallet: WalletSigner
  signers?: Array<Keypair>
  connection: Connection
  timeout?: number
}) {
  const signedTransaction = await signTransaction({
    transaction,
    wallet,
    signers,
    connection,
  })
  return await sendSignedTransaction({
    signedTransaction,
    connection,
    timeout,
  })
}

async function signTransaction({
  transaction,
  wallet,
  signers = [],
  connection,
}: {
  transaction: Transaction
  wallet: WalletSigner
  signers?: Array<Keypair>
  connection: Connection
}) {
  const { blockhash: recentBlockhash } = await connection.getLatestBlockhash('max')
  transaction.recentBlockhash = recentBlockhash
  transaction.setSigners(wallet!.publicKey!, ...signers.map((s) => s.publicKey))
  if (signers.length > 0) {
    transaction.partialSign(...signers)
  }
  return await wallet.signTransaction(transaction)
}

async function sendSignedTransaction({
  signedTransaction,
  connection,
  timeout = DEFAULT_TIMEOUT,
}: {
  signedTransaction: Transaction
  connection: Connection
  timeout?: number
}): Promise<string> {
  // debugger
  console.log('raw tx')
  const rawTransaction = signedTransaction.serialize()
  const startTime = getUnixTs()

  console.log('raw tx', rawTransaction)

  const txid: TransactionSignature = await connection.sendRawTransaction(
    rawTransaction,
    {
      skipPreflight: true,
    }
  )

  console.log('Started awaiting confirmation for', txid)

  let done = false

  ;(async () => {
    while (!done && getUnixTs() - startTime < timeout) {
      connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
      })

      await sleep(3000)
    }
  })()

  try {
    console.log('calling confirmation sig', txid, timeout, connection)

    console.log(
      'calling signatures confirmation',
      await awaitTransactionSignatureConfirmation(txid, timeout, connection)
    )
  } catch (err) {
    if ((err as {timeout: any}).timeout) {
      throw new Error('Timed out awaiting confirmation on transaction')
    }

    let simulateResult: SimulatedTransactionResponse | null = null

    console.log('sined transaction', signedTransaction)

    // Simulate failed transaction to parse out an error reason
    try {
      console.log('start simulate')
      simulateResult = (await connection.simulateTransaction(signedTransaction))
        .value
    } catch (error) {
      console.log('Error simulating: ', error)
    }

    console.log('simulate result', simulateResult)

    // Parse and throw error if simulation fails
    if (simulateResult && simulateResult.err) {
      if (simulateResult.logs) {
        console.log('simulate resultlogs', simulateResult.logs)

        for (let i = simulateResult.logs.length - 1; i >= 0; --i) {
          const line = simulateResult.logs[i]

          if (line.startsWith('Program log: ')) {
            throw new TransactionError(
              'Transaction failed: ' + line.slice('Program log: '.length),
              txid
            )
          }
        }
      }
      throw new TransactionError(JSON.stringify(simulateResult.err), txid)
    }

    console.log('transaction error lasdkasdn')

    throw new TransactionError('Transaction failed', txid)
  } finally {
    done = true
  }

  console.log('Latency', txid, getUnixTs() - startTime)
  return txid
}

async function awaitTransactionSignatureConfirmation(
  txid: TransactionSignature,
  timeout: number,
  connection: Connection
) {
  let done = false
  const result = await new Promise((resolve, reject) => {
    // eslint-disable-next-line
    ;(async () => {
      setTimeout(() => {
        if (done) {
          return
        }
        done = true
        console.log('Timed out for txid', txid)
        reject({ timeout: true })
      }, timeout)
      try {
        connection.onSignature(
          txid,
          (result) => {
            console.log('WS confirmed', txid, result, result.err)
            done = true
            if (result.err) {
              reject(result.err)
            } else {
              resolve(result)
            }
          },
          connection.commitment
        )
        console.log('Set up WS connection', txid)
      } catch (e) {
        done = true
        console.log('WS error in setup', txid, e)
      }
      while (!done) {
        // eslint-disable-next-line
        ;(async () => {
          try {
            const signatureStatuses = await connection.getSignatureStatuses([
              txid,
            ])

            console.log('signatures cancel proposal', signatureStatuses)

            const result = signatureStatuses && signatureStatuses.value[0]

            console.log('result signatures proposal', result, signatureStatuses)

            if (!done) {
              if (!result) {
                // console.log('REST null result for', txid, result);
              } else if (result.err) {
                console.log('REST error for', txid, result)
                done = true
                reject(result.err)
              }
              // @ts-ignore
              else if (
                !(
                  result.confirmations ||
                  result.confirmationStatus === 'confirmed' ||
                  result.confirmationStatus === 'finalized'
                )
              ) {
                console.log('REST not confirmed', txid, result)
              } else {
                console.log('REST confirmed', txid, result)
                done = true
                resolve(result)
              }
            }
          } catch (e) {
            if (!done) {
              console.log('REST connection error: txid', txid, e)
            }
          }
        })()
        await sleep(3000)
      }
    })()
  })
  done = true
  return result
}

async function createSetUpgradeAuthority(
  programId: PublicKey,
  upgradeAuthority: PublicKey,
  newUpgradeAuthority: PublicKey
) {
  const bpfUpgradableLoaderId = BPF_UPGRADE_LOADER_ID

  const [programDataAddress] = PublicKey.findProgramAddressSync(
    [programId.toBuffer()],
    bpfUpgradableLoaderId
  )

  const keys = [
    {
      pubkey: programDataAddress,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: upgradeAuthority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: newUpgradeAuthority,
      isWritable: false,
      isSigner: false,
    },
  ]

  return new TransactionInstruction({
    keys,
    programId: bpfUpgradableLoaderId,
    data: Buffer.from([4, 0, 0, 0]), // SetAuthority instruction bincode
  })
}

task("transfer-solana-program-ownership", "Transfers upgrade authority of a Solana upgradable program")
  .addParam("programId", "The public key of the upgradable program", "")
  // .addParam("multisigProgramId", "Multisign program", "AzHKmHjEoZ7JqiTUPgPVAZgtyNLwa3BTsRgffYxCVDDZ")
  .addParam("multisigProgramId", "Multisign program", "4wcedASdm3sDGirPGBjYsEjSGcLzFWM5fa4EY8RK6KHg")
  .addParam("receiverAddress", "New authority pubkey, or 'clear' to remove ownership", "")
  .setAction(async (args) => {
    const privateKey = process.env.SOLANA_PRIVATE_KEY
    const multisig = process.env.MULTISIG || "";
    const { programId, multisigProgramId, receiverAddress } = args;

    // const connection = new Connection(process.env.RPC_URL_SOLANA || "https://api.mainnet-beta.solana.com", "confirmed");
    const connection = new Connection(process.env.RPC_URL_SOLANA_TESTNET || "https://api.mainnet-beta.solana.com", "confirmed");

    assert(!!privateKey, 'SOLANA_PRIVATE_KEY is not defined in the environment variables.')
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey))

    const wallet = new anchor.Wallet(keypair);
    const provider = new anchor.AnchorProvider(connection, wallet, {});
    const multisigProgram = await anchor.Program.at(multisigProgramId, provider);

    // const currentAuthority = new PublicKey(multisig)
    const currentAuthority = wallet.publicKey

    const programPubkey = new PublicKey(programId);

    const newAuthorityPubkey = new PublicKey(receiverAddress);

    const transferUpgradeAuthIx = await createSetUpgradeAuthority(
      programPubkey,
      currentAuthority,
      newAuthorityPubkey,
    )
    const transaction = new Transaction()
    transaction.add(transferUpgradeAuthIx)
    const signers: Keypair[] = [keypair]
    await sendTransaction({
      transaction,
      wallet,
      connection,
      signers,
    })

  });
