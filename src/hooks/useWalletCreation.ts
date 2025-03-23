import { useLoading } from "@/context/LoadingContext";
import { createNewWallet } from "@/utils/monero";
import { useCallback } from "react";

export const useWalletCreation = ({
  loadWallets,
  requestPinCode,
  setPinText,
}: {
  loadWallets: () => void;
  requestPinCode: () => Promise<string>;
  setPinText: (text: string) => void;
}) => {
  const { setLoading } = useLoading();

  const handleWalletCreation = useCallback(async () => {
    
    try {
      setPinText("The PIN is used locally and only for this wallet. You won’t be asked to confirm it when setting it up.")
      const pin = await requestPinCode();
      if (pin.length === 4) { 
        setLoading(true);
        await createNewWallet(pin);
        loadWallets();
      }
    } catch (error) {
      console.error("Wallet creation error:", error);
    } finally {
      setLoading(false); 
    }
  }, [loadWallets, requestPinCode, setLoading]);

  return { handleWalletCreation };
};