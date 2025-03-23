export interface Wallet {
    name?: string;
    lHeight?: number;
    rHeight?: number;
    balance?: number;
    unlocked?: number;
    address?: string;
    encryptedSeed?: string;
    ph?: boolean;
  }