import * as CryptoJS from 'crypto-js';
import moneroTs, { MoneroWalletListener } from "monero-ts";
import { config } from '@/config/config';

// set worker loader if not copied to public directory
moneroTs.LibraryUtils.setWorkerLoader(() => new Worker(new URL("monero-ts/dist/monero.worker.js", import.meta.url)));

// @ts-ignore
window.monero = moneroTs;

if (!moneroTs) {
  console.error("Ошибка загрузки monero-ts!");
}

let daemon = await moneroTs.connectToDaemonRpc(config.daemonUrl);

export async function daemonHeight() {
  let height = await daemon.getHeight();
  return height
}

async function createWalletKeys() {
  let w = await moneroTs.createWalletKeys({
    networkType: config.networkType,
    language: "English",
  });

  let seed = await w.getSeed();
  let address = await w.getAddress(0, 0);
  // let spend_key = await  w.getPrivateSpendKey();
  // let view_key = await  w.getPrivateViewKey();

  return {
    seed: seed,
    address: address
  };
}


export function encryptData(data: string, pin: string) {
  if (!data) {
    throw new Error("Data to encrypt is empty");
  }


  const encrypted = CryptoJS.AES.encrypt(data, pin).toString();
  return encrypted;
}


export function decryptData(encryptedData: string, pin: string) {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, pin).toString(CryptoJS.enc.Utf8);
  if (!decrypted) {
    return "x"
  }
  return decrypted;
}


export async function createNewWallet(pin: string) {
  try {
    const w = await createWalletKeys();
    const encryptedSeed = encryptData(w.seed, pin);
    console.log("Data encrypted successfully");

    let walletDataStr = localStorage.getItem('ws');
    let walletData;

    if (walletDataStr) {
      walletData = JSON.parse(walletDataStr);
    } else {
      walletData = { wallets: {} };
    }

    let ch = await daemonHeight();

    walletData.wallets[w.address] = {
      encryptedSeed: encryptedSeed,
      rHeight: ch,
      lHeight: ch,
      balance: 0,
      unlocked:0,
      ph: false,
    };

    localStorage.setItem('ws', JSON.stringify(walletData));
    console.log('Wallet saved securely!');
  } catch (error) {
    console.error("Error creating new wallet:", error);
    throw error;
  }
}

export async function getSeed(pin: string, encryptedSeed: string) {
  const seed = decryptData(encryptedSeed, pin);

  return seed.toString();
}


export const getWalletFull = async (seed: string, height: number) => {
  if (!daemon) {
    console.error("No connection to the daemon has been established.");
    return;
  }

  try {

    const hash = CryptoJS.SHA256(seed).toString(CryptoJS.enc.Hex);
    const walletFull = await moneroTs.createWalletFull({
      networkType: config.networkType,
      seed: seed,
      restoreHeight: height,
      server: { uri: config.daemonUrl },
    });

    const address = await walletFull.getPrimaryAddress()

    return {walletFull};
  } catch (error) {
    console.error("Error when loading the wallet:", error);
  } 
};



interface SyncProgressCallback {
  (height: number, percentDone: number): void;
}

interface BalanceCallback {
  (balance: bigint, unlockedBalance: bigint): void;
  
}

/**
 * Synchronizes the wallet and returns the balance and unlocked balance.
 * @param walletFull - Wallet object.
 * @param onSyncProgress - Callback to receive synchronization progress.
 * @returns An object with balance and unlocked balance.
 */

export const syncWallet = async (
  walletFull: any,
  onSyncProgress?: SyncProgressCallback,
  onBalancesChanged?: BalanceCallback,
): Promise<void> => {
  try {

    await walletFull.sync(
      new (class extends MoneroWalletListener {
        async onSyncProgress(
          height: number,
          startHeight: number,
          endHeight: number,
          percentDone: number,
          message: string,
        ): Promise<void> {
          if (onSyncProgress) {
            onSyncProgress(height, percentDone);
          }
        }

        async onBalancesChanged(balance: bigint, unlockedBalance: bigint): Promise<void> {
          if (onBalancesChanged) {
            onBalancesChanged(balance, unlockedBalance);
          }
        }
      })()
    );

  } catch (error) {
    console.error("Failed to sync wallet:", error);
    throw new Error("Wallet synchronization failed");
  }
};

/**
 * Removes all listeners from the wallet.
 * @param walletFull - Wallet object.
 */
export const closeWallet = (walletFull: any): void => {
  try {
    walletFull.close();
  } catch (error) {
    console.error("Failed to remove listeners:", error);
    throw new Error("Failed to remove listeners");
  }
};