import { useEffect, useCallback, useState } from "react";
import { useTitle } from "@/context/TitleContext";
import { useNavbarButton } from "@/context/NavbarButtonContext";
import { WalletCard } from "@/components/WalletCard/WalletCard";
import { PincodeModal } from "@/components/PinCode/PincodeModal";
import { useWallets } from "@/hooks/useWallets";
import { useDaemonHeight } from "@/hooks/useDaemonHeight";
import { usePinCode } from "@/hooks/usePinCode";
import { Icon } from "@iconify/react";
import { ICON_NAMES } from "@/constants";
import { useWalletCreation } from "@/hooks/useWalletCreation";

const ADD_ICON = <Icon icon={ICON_NAMES.ADD} width="24" height="24" />;

interface MainProps {
  onOpenWallet: (seed: string, rHeight: number, name: string) => void;
}

export const Main = ({ onOpenWallet }: MainProps) => {
  const { wallets, loadWallets, deleteWallet, renameWallet } = useWallets();
  const { currentHeight } = useDaemonHeight();
  const { showPinModal, setShowPinModal, resolvePin, requestPinCode } = usePinCode();
  const [pinText, setPinText] = useState("");
  const { handleWalletCreation } = useWalletCreation({ loadWallets, requestPinCode, setPinText });



  const { setTitle } = useTitle();
  const { setButton } = useNavbarButton();


  useEffect(() => {
    loadWallets();
    setButton(ADD_ICON, handleWalletCreation);
  }, [loadWallets, handleWalletCreation, setButton, renameWallet]);

  const getTitleContent = useCallback(() => {
    const walletCount = Object.keys(wallets).length;
    
    switch(walletCount) {
      case 0: return 'Montip';
      case 1: return 'Wallet';
      default: return (
        <>
          <p>Wallets</p>
          <p className="text-xs ml-1">{walletCount}</p>
        </>
      );
    }
  }, [wallets]);

  useEffect(() => {
    setTitle(getTitleContent());
  }, [wallets, getTitleContent, setTitle]);

  const handleDeleteWallet = (address: string) => {
    deleteWallet(address);
  };

  const handleRename = (address: string, newName: string) => {
    renameWallet(address, newName);
  };


  return (
    <div className="pt-4">
      {Object.keys(wallets).length === 0 
        ? <p className="text-center">No wallets yet</p>
        : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3 lg:flex lg:flex-row lg:flex-wrap ">
            {Object.entries(wallets).map(([address, wallet]) => (
              <WalletCard 
                key={address}
                address={address}
                wallet={wallet}
                currentHeight={currentHeight}
                onDelete={handleDeleteWallet}
                onRename={handleRename} 
                onOpenWallet={onOpenWallet}              
                />
            ))}

          </div>
        )}

      <PincodeModal
        visible={showPinModal}
        onClose={() => setShowPinModal(false)}
        resolvePin={resolvePin} 
        pinText={pinText}        
      />

    </div>
  );
};