import { Wallet } from "@/types/wallet";
import { useState, useCallback } from "react";


export const useWallets = () => {
    const [wallets, setWallets] = useState<Record<string, Wallet>>({});
  
    const loadWallets = useCallback(() => {
      const walletData = JSON.parse(localStorage.getItem("ws") || JSON.stringify({ wallets: {} }));
      setWallets(walletData?.wallets || {});
    }, []);
  
    const deleteWallet = useCallback((address: string) => {
      const walletData = JSON.parse(localStorage.getItem("ws") || JSON.stringify({ wallets: {} }));
  
      if (!walletData.wallets[address]) {
        throw new Error('Wallet not found!');
      }
  
      delete walletData.wallets[address];
      localStorage.setItem('ws', JSON.stringify(walletData));
  
      setWallets(prevWallets => {
        const newWallets = { ...prevWallets };
        delete newWallets[address];
        return newWallets;
      });
  
      return `Wallet with address ${address} has been deleted.`;
    }, []);

    const renameWallet = useCallback((address: string, newName: string) => {

      const walletData = JSON.parse(localStorage.getItem("ws") || JSON.stringify({ wallets: {} }));
    
      if (!walletData.wallets[address]) {
        throw new Error('Wallet not found!');
      }
    
      walletData.wallets[address].name = newName;
    
      localStorage.setItem('ws', JSON.stringify(walletData));
    
      setWallets(prevWallets => {
        const newWallets = { ...prevWallets };
        if (newWallets[address]) {
          newWallets[address].name = newName;
        }
        return newWallets;
      });
    
      return `Wallet with address ${address} has been renamed to "${newName}".`;
    }, []);
    
  
    return { wallets, loadWallets, deleteWallet, renameWallet };
  };

const getWalletData = () => {
    const walletDataStr = localStorage.getItem('ws');
    if (!walletDataStr) {
      throw new Error('Wallets not found in localStorage!');
    }
    const walletData = JSON.parse(walletDataStr);
    if (!walletData || !walletData.wallets) {
      throw new Error('Invalid wallet data in localStorage!');
    }
    return walletData;
  };
  
  export const getWalletByAddress = (address: string) => {
    const walletData = getWalletData();
  
    if (!walletData.wallets[address]) {
      throw new Error('Wallet not found!');
    }
  
    return walletData.wallets[address];
  };
  
  export const deleteWalletByAddress = (address: string) => {
    const walletData = getWalletData();
  
    if (!walletData.wallets[address]) {
      throw new Error('Wallet not found!');
    }
  
    delete walletData.wallets[address];
    localStorage.setItem('ws', JSON.stringify(walletData));


  
    return `Wallet with address ${address} has been deleted.`;
  };