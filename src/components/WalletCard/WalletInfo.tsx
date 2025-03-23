import { Card, CardHeader } from "@heroui/card";
import { Icon } from "@iconify/react";
import { Wallet } from "@/types/wallet";
import { ICON_NAMES } from "@/constants";
import { config } from "@/config/config";

interface WalletInfoProps {
  wallet: Wallet;
  address: string;
  syncStatus: number;
}

const SYNC_ICON = <Icon icon={ICON_NAMES.SYNC} width="14" height="14" />;

const formatBalance = (balance: number | undefined) => {
  if (balance === undefined) {
    return "0";
  }
  const xmrBalance = balance / 1e12;
  const formattedBalance = xmrBalance.toFixed(5).replace(/\.?0+$/, '');

  return formattedBalance;
};

export const WalletInfo = ({ wallet, address, syncStatus }: WalletInfoProps) => (
  <Card className="py-5 pl-4 lg:min-w-[180px]">
    <CardHeader className="pb-0 pt-0 flex-col items-start">
      <div>
        <p className="text-[10px] font-bold">
          {wallet.name
            ? wallet.name.length > 18
              ? wallet.name.slice(0, 18).trimEnd() + '…'
              : wallet.name.trimEnd()
            : address.slice(0, 12)}
        </p>
      </div>
      <h4 className="font-bold text-large leading-[1.2] mt-1">
        {formatBalance(wallet.balance)} XMR
      </h4>
      <small
        className={`text-default-500 leading-[1.2] ${
          wallet?.unlocked !== undefined &&
          wallet?.balance !== undefined &&
          wallet.unlocked < wallet.balance
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        {wallet.unlocked} unlocked
      </small>
      <small className="text-default-500 leading-[1.2]">
        {wallet.balance ? (wallet.balance / 1e12 * config.price).toFixed(2) : "0.00"} $
      </small>
      <small className={`text-default-500 absolute right-5 bottom-5 text-right leading-[14px] flex flex-row gap-1 items-center ${syncStatus <= 0 ? "opacity-0" : "opacity-40"}`}>
        {syncStatus > 0 ? <>{syncStatus} {SYNC_ICON}</> : null}
      </small>
    </CardHeader>
  </Card>
);