import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import LearnMore from "./LearnMore";
import WalletRecommendations from "./WalletRecommendations";
import BalanceCard from "./BalanceCard";
import { useTitle } from "@/context/TitleContext";
import { useNavbarButton } from "@/context/NavbarButtonContext";
import { getWalletFull, closeWallet, syncWallet } from "@/utils/monero";
import { Wallet } from "@/types/wallet";
import { useNotification } from "@/context/NotificationContext";


interface WalletProps {
    seed: string;
    rHeight: number;
    name: string;
    onClose: () => void;
  }
  

  export const WalletPage = ({ seed, rHeight, name, onClose }: WalletProps) => {
    const [walletFull, setWalletFull] = useState<any>(null);
    const [walletData, setWalletData] = useState<Wallet>({});
    const [isSyncing, setisSyncing] = useState<boolean>(true);
    const [isBalanceLoading, setBalanceLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setTitle } = useTitle();
    const { setButton } = useNavbarButton();
    const { showNotification } = useNotification();


    const handleClose = async (walletFull: any) => {
        try {
          await closeWallet(walletFull);
          onClose();
        } catch (error) {
          onClose();
        }
      };

    useEffect(() => {
      setTitle(name);
      setButton(<Icon icon="ep:close-bold" width="16" height="16" />, () => handleClose(walletFull));
      initializeWallet();
    }, []);
    


    const updateWalletData = async (x: Partial<Wallet>) => {
        setWalletData((prevWalletData) => ({
          ...prevWalletData,
          ...x,
        }));
      };


      useEffect(() => {
        if (walletData?.address) {
          const wsData = JSON.parse(localStorage.getItem('ws') || '{"wallets": {}}');
          const wallets = wsData.wallets;
          const wallet = wallets[walletData.address];
      
          if (wallet) {
            const updatedWallet = {
              ...wallet,
              balance: walletData.balance != null ? walletData.balance.toString() : wallet.balance,
              unlocked: walletData.unlocked != null ? walletData.unlocked.toString() : wallet.unlocked,
              lHeight: walletData.lHeight != null ? walletData.lHeight : wallet.lHeight,
              rHeight: walletData.rHeight != null ? walletData.rHeight : wallet.rHeight,
            };
      
            wallets[walletData.address] = updatedWallet;
            localStorage.setItem('ws', JSON.stringify({ wallets }));
          }
        }
      }, [walletData]);


      const initializeWallet = async () => {
        try {
          await updateWalletData({ rHeight, name });
          const wallet = await getWalletFull(seed, rHeight);
          setWalletFull(wallet?.walletFull);
    
          const address = await wallet?.walletFull.getPrimaryAddress();
          await updateWalletData({ address });
        } catch (error) {
          console.error("Failed to initialize wallet:", error);
        }
      };

        const handleSyncProgress = async (height: number, percentDone: number) => {
            await updateWalletData({ lHeight: height });
          
            if (percentDone === 1) {
              setisSyncing(false);
              // if (walletData.balance === 0 || walletData.balance === undefined || walletData.balance === null) {
              //   await updateWalletData({ rHeight: height });
              // }
            }
          };



  const handleBalancesChanged = async (balance: bigint, unlocked: bigint) => {
    await updateWalletData({ balance: Number(balance), unlocked: Number(unlocked)})
    setBalanceLoading(false);
  }
  useEffect(() => {
    if (walletFull) {
      syncWallet(walletFull, handleSyncProgress, handleBalancesChanged)
        .catch((error) => {
          console.error("Error during sync:", error.message);
        });
    }
  }, [walletFull]);




    const sweepUnlocked = async (destinationAddress: string) => {
        if (!walletFull) {
            showNotification({
                title: ("Hey, where is a wallet"),
                color: "warning",
                message: ""
              });
          return;
        }
      
        try {
          setIsLoading(true);
      
          const txs = await walletFull.sweepUnlocked({
            address: destinationAddress,
            relay: true,
          });
          showNotification({
            title: ("Transaction sent successfully! If you need the TX hash, check the console."),
            color: "success",
            message: ""
          });
          console.log("Tx hash:", txs.hash);
          console.log("Tx key:", txs.key);
          console.log("Txs:", txs);
        } catch (error) {
            showNotification({
                title: ("Error sending transaction."),
                color: "danger",
                message: ""
              });
          console.error("Error sending the full balance:", error);
        } finally {
          setIsLoading(false);
        }
      };


      const getBalanceMessage = (unlocked: number, balance: number) => {
        if (unlocked === 0 && balance > 0) {
            return "Your unlocked balance is 0. Please wait for ~10 blockchain confirmations before you can spend your balance. It usually doesn't take long.";
        }
        if (unlocked > 0 && unlocked < balance) {
            return "Some of your funds are still locked. Please wait for ~10 blockchain confirmations before you can spend your whole balance. It usually doesn't take long.";
        }
        return null;
    };
    
    const message = getBalanceMessage(walletData?.unlocked || 0, walletData?.balance || 0);

    return (
        <main className="flex h-dvh flex-col py-4 lg:mt-[-40px] lg:justify-center lg:items-center">
        <div className="flex flex-col gap-4 lg:max-w-[400px]">
          <div className="flex flex-col">
          <BalanceCard balance={walletData.balance || 0} unlockedBalance={walletData.unlocked || 0} isSyncing={isSyncing} isBalanceLoading={isSyncing} sweepUnlocked={sweepUnlocked} />
          {message && (
                <p className="text-xs p-2 opacity-50">
                    {message}
                </p>
            )}
          <WalletRecommendations isSyncing />
            <LearnMore/>
          </div>
    
        </div>
      </main>
    );
  };

