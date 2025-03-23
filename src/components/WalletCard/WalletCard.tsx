import { useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import { copyToClipboard } from "@/utils/clipboard";
import { encryptData, getSeed } from "@/utils/monero";
import { PincodeModal } from "@/components/PinCode/PincodeModal";
import { RenameModal } from "./RenameModal";
import { WalletActions } from "./WalletActions";
import { MnemonicModal } from "./MnemonicModal";
import { QRCodeModal } from "./QRCodeModal";
import { PrintablesModal } from "./PrintablesModal";
import { Wallet } from "@/types/wallet";

interface WalletCardProps {
  address: string;
  wallet: Wallet;
  currentHeight?: number;
  onDelete: (address: string) => void;
  onRename: (address: string, newName: string) => void;
  onOpenWallet: (seed: string, rHeight: number, name: string) => void;
}

export const WalletCard = ({ address, wallet, currentHeight, onDelete, onRename, onOpenWallet }: WalletCardProps) => {
  const { showNotification } = useNotification();
  const [mnemonic, setMnemonic] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [resolvePin, setResolvePin] = useState<((pin: string) => void) | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeLink, setQRCodeLink] = useState("");
  const [secretPhrase, setSecretPhrase] = useState("");
  const [showPrintablesModal, setShowPrintablesModal] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [pinText, setPinText] = useState("")

  const syncStatus = currentHeight !== undefined && wallet.lHeight !== undefined
    ? currentHeight - wallet.lHeight
    : 0;

  const requestPinCode = () => new Promise<string>((resolve) => {
    const handleSubmit = (pin: string) => {
      setShowPinModal(false);
      resolve(pin);
    };

    setResolvePin(() => handleSubmit);
    setShowPinModal(true);
  });

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(address);
    showNotification({
      title: (success ? "Address copied to clipboard!" : "Failed to copy address."),
      color: "success",
      message: ""
    });
  };

  const handleDeleteWallet = () => {
    onDelete(address);
  };

  const handleOpenWallet = async () => {
    try {
      setPinText("Please enter your PIN for this wallet.");
      const pin = await requestPinCode();
      if (pin) {
        const seed = await getSeed(pin, wallet.encryptedSeed || "");
        const rHeight = wallet.rHeight || 0;
        const name = wallet.name || address.slice(0, 12)
        onOpenWallet(seed, rHeight, name); 
      }
    } catch (error) {
      showNotification({
        title: "Wrong pin!",
        color: "danger",
        message: "",
      });
    }
  };

  const handleShowMnemonic = async () => {
    try {
      setPinText("Please enter your PIN for this wallet.")
      const pin = await requestPinCode();
      if (pin) {
        const seed = await getSeed(pin, wallet.encryptedSeed || "");
        setMnemonic(seed);
      }
    } catch (error) {
      showNotification({
        title: "Wrong pin!",
        color: "danger",
        message: ""
      });
    }
  };

  const handleShowQRCode = async () => {
    try {
      setPinText("Please enter your PIN for this wallet.")
      const pin = await requestPinCode();
      if (pin && wallet.encryptedSeed) {
        const seed = await getSeed(pin, wallet.encryptedSeed);
        const secretPhrase = seed.split(" ").slice(0, 2).join(" ");
        const encrypted = encryptData(seed, secretPhrase);
        const domain = window.location.origin;
        const link = `${domain}?${wallet.name ? `n=${encodeURIComponent(wallet.name)}&` : ""}h=${wallet.rHeight}&m=${encodeURIComponent(encrypted)}`;
        setQRCodeLink(link);
        setSecretPhrase(secretPhrase);
        setShowQRModal(true);
      } else {
        throw new Error("Invalid pin or encrypted seed");
      }
    } catch (error) {
      showNotification({
        title: "Wrong pin!",
        color: "danger",
        message: ""
      });
    }
  };

  const handleShowPrintables = async () => {
    try {
      setPinText("Please enter your PIN for this wallet.")
      const pin = await requestPinCode();
      if (pin && wallet.encryptedSeed) {
        const seed = await getSeed(pin, wallet.encryptedSeed);
        const secretPhrase = seed.split(" ").slice(0, 2).join(" ");
        const encrypted = encryptData(seed, secretPhrase);
        const domain = window.location.origin;
        const link = `${domain}?${wallet.name ? `n=${encodeURIComponent(wallet.name)}&` : ""}h=${wallet.rHeight}&m=${encodeURIComponent(encrypted)}`;
        setQRCodeLink(link);
        setSecretPhrase(secretPhrase);
        setShowPrintablesModal(true);
      } else {
        throw new Error("Invalid pin or encrypted seed");
      }
    } catch (error) {
      showNotification({
        title: "Wrong pin!",
        color: "danger",
        message: ""
      });
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(qrCodeLink);
    showNotification({
      title: (success ? "Link copied to clipboard!" : "Failed to copy."),
      color: "success",
      message: ""
    });
  };

  const saveSVGAsFile = () => {
    const svgElement = document.querySelector('.p-4.rounded-xl.bg-white.hidden svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(svgBlob);
    downloadLink.download = `${fileName}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const fileName = `QR ${wallet.name || address.slice(0, 12)}`;

  const handleOpenRenameModal = () => setIsRenameOpen(true);
  const handleCloseRenameModal = () => setIsRenameOpen(false);
  const handleRename = (newName: string) => {
    onRename(address, newName);
    handleCloseRenameModal();
  };

  return (
    <>
      <WalletActions
        onCopyAddress={handleCopyAddress}
        onRename={handleOpenRenameModal}
        onShowMnemonic={handleShowMnemonic}
        onShowQRCode={handleShowQRCode}
        onShowPrintables={handleShowPrintables}
        onDelete={handleDeleteWallet}
        onOpenWallet={handleOpenWallet}
        wallet={wallet} 
        address={address} 
        syncStatus={syncStatus} />
      <MnemonicModal
        isOpen={!!mnemonic}
        onClose={() => setMnemonic("")}
        mnemonic={mnemonic}
        onCopy={() => copyToClipboard(mnemonic).then(() => showNotification({ title: "Mnemonic copied!", color: "success", message: "" }))} 
      />
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        qrCodeLink={qrCodeLink}
        secretPhrase={secretPhrase}
        onCopyLink={handleCopyLink}
      />
      <PrintablesModal
        isOpen={showPrintablesModal}
        onClose={() => setShowPrintablesModal(false)}
        qrCodeLink={qrCodeLink}
        secretPhrase={secretPhrase}
        fileName={fileName}
        onSaveQR={saveSVGAsFile}
      />
      <PincodeModal
        visible={showPinModal}
        onClose={() => setShowPinModal(false)}
        resolvePin={resolvePin}
        pinText={pinText}
      />
      <RenameModal
        isRenameOpen={isRenameOpen}
        walletName={wallet.name || ''}
        onRename={handleRename}
        onClose={handleCloseRenameModal}
      />
    </>
  );
};