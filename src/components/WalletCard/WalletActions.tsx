import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Icon } from "@iconify/react";
import { WalletInfo } from "./WalletInfo";
import { Wallet } from "@/types/wallet";

interface WalletActionsProps {
  wallet: Wallet;
  address: string;
  syncStatus: number;
  onCopyAddress: () => void;
  onRename: () => void;
  onShowMnemonic: () => void;
  onShowQRCode: () => void;
  onShowPrintables: () => void;
  onDelete: () => void;
  onOpenWallet: () => void;
}

export const WalletActions = ({
  wallet,
  address,
  syncStatus,
  onCopyAddress,
  onRename,
  onShowMnemonic,
  onShowQRCode,
  onShowPrintables,
  onDelete,
  onOpenWallet,
}: WalletActionsProps) => (
  <Dropdown>
    <DropdownTrigger>
      <button className="min-w-[150px] max-w-[200px]">
        <WalletInfo wallet={wallet} address={address} syncStatus={syncStatus} />
      </button>
    </DropdownTrigger>
    <DropdownMenu aria-label="actions">
      <DropdownItem key="open" startContent={<Icon icon="solar:wallet-bold-duotone" width="24" height="24" />} onPress={onOpenWallet}><p className="text-[16px]">Open wallet</p></DropdownItem>
      <DropdownItem key="copy" startContent={<Icon icon="solar:copy-bold-duotone" width="24" height="24" />} onPress={onCopyAddress}><p className="text-[16px]">Copy address</p></DropdownItem>
      <DropdownItem key="rename" startContent={<Icon icon="solar:pen-2-bold-duotone" width="24" height="24" />} onPress={onRename} ><p className="text-[16px]">Rename wallet</p></DropdownItem>
      <DropdownItem key="mnemonic" startContent={<Icon icon="solar:clipboard-text-bold-duotone" width="24" height="24" />} onPress={onShowMnemonic}><p className="text-[16px]">Mnemonic</p></DropdownItem>
      <DropdownItem key="qr" startContent={<Icon icon="solar:qr-code-bold-duotone" width="24" height="24" />} onPress={onShowQRCode} ><p className="text-[16px]">QRCode</p></DropdownItem>
      <DropdownItem key="printables" startContent={<Icon icon="solar:printer-minimalistic-bold-duotone" width="24" height="24" />} onPress={onShowPrintables} showDivider><p className="text-[16px]">Printables</p></DropdownItem>
      <DropdownItem key="delete" startContent={<Icon icon="solar:trash-bin-minimalistic-bold-duotone" width="24" height="24" />} onPress={onDelete} className="text-danger" color="danger"><p className="text-[16px]">Delete wallet</p></DropdownItem>
    </DropdownMenu>
  </Dropdown>
);