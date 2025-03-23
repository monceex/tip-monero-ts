import { useEffect, useState } from "react";
import { Main } from "@/components/Main/Main";
import { WalletPage } from "@/components/Wallet";
import DefaultLayout from "@/layouts/default";
import { PassPhraseModal } from "@/components/PassPhrase/PassPhrase";
import { decryptData } from "@/utils/monero";

export default function IndexPage() {
  const [openedWallet, setOpenedWallet] = useState<{
    name: string;
    seed: string;
    rHeight: number;
  } | null>(null);

  const [showPassModal, setShowPassModal] = useState(false);
  const [encryptedSeed, setEncryptedSeed] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [restoreHeight, setRestoreHeight] = useState<number | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get("n");
    const height = urlParams.get("h");
    const encryptedSeedParam = urlParams.get("m");

    if (height && encryptedSeedParam) {
      setEncryptedSeed(decodeURIComponent(encryptedSeedParam));
      setWalletName(name ? decodeURIComponent(name) : "Wallet");
      setRestoreHeight(parseInt(height));
      setShowPassModal(true);
    }
  }, []);

  const handlePassPhraseSubmit = (pass: string) => {
    if (!encryptedSeed || !restoreHeight) return;

    try {
      const decryptedSeed = decryptData(encryptedSeed, pass);

      setOpenedWallet({
        name: walletName || "Wallet",
        seed: decryptedSeed,
        rHeight: restoreHeight,
      });
      setShowPassModal(false);
    } catch (error) {
      console.error("Decryption failed:", error);
    }
  };

  return (
    <DefaultLayout>
      {openedWallet ? (
        <WalletPage
          seed={openedWallet.seed}
          rHeight={openedWallet.rHeight}
          name={openedWallet.name}
          onClose={() => setOpenedWallet(null)}
        />
      ) : (
        <Main
          onOpenWallet={(seed, rHeight, name) =>
            setOpenedWallet({ seed, rHeight, name })
          }
        />
      )}

      <PassPhraseModal
        visible={showPassModal}
        onClose={() => setShowPassModal(false)}
        onSubmit={handlePassPhraseSubmit}
        passText="Please enter your secret key to unlock wallet"
      />
    </DefaultLayout>
  );
}