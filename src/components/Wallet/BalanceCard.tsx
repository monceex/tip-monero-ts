import { useState } from "react";
import WithdrawModal from "./WithdrawModal";
import { Card, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { Button } from "@heroui/button";
import { config } from "@/config/config";

interface BalanceCardProps {
  balance: number;
  unlockedBalance: number;
  isSyncing: boolean;
  isBalanceLoading: boolean;
  sweepUnlocked: (address: string) => Promise<void>;
}

export default function BalanceCard({ balance, unlockedBalance, isSyncing, isBalanceLoading, sweepUnlocked }: BalanceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const formattedBalance = (balance / 1e12).toFixed(4).replace(/\.?0+$/, '');
  const formattedUnlockedBalance = (unlockedBalance / 1e12).toFixed(4).replace(/\.?0+$/, '');
  const usdValue = (balance / 1e12 * config.price).toFixed(2);

  const isWithdrawDisabled = unlockedBalance <= 0;

  return (
    <div>
      <Card className="p-4 w-full lg:w-[400px] lg:mr-2 flex flex-row justify-between items-center">
        <CardHeader className="pb-2 pt-3 px-4 flex flex-col items-start flex-1">
          <p className="text-tiny uppercase font-bold">Balance</p>

          {isBalanceLoading ? (
            <Skeleton className="rounded-lg mt-1">
              <h4 className="font-bold text-3xl lg:text-2xl">1 XMR</h4>
            </Skeleton>
          ) : (
            <h4 className="font-bold text-3xl lg:text-2xl">{formattedBalance} XMR</h4>
          )}

          {!isSyncing && (
          <small className={`text-default-500 opacity-0 ${unlockedBalance < balance && ( 'opacity-100' )}`}>Unlocked {formattedUnlockedBalance} XMR</small>
          )}

          {isBalanceLoading ? (
            <Skeleton className="rounded-lg mt-1">
              <small className="text-default-500">10000$</small>
            </Skeleton>
          ) : (
            <small className="text-default-500">{usdValue} $</small>
          )}
        </CardHeader>

        <Button
          color={unlockedBalance > 0 && !isSyncing ? "success" : "default"}
          isDisabled={isWithdrawDisabled || isSyncing}
          variant="flat"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] px-8 py-6 lg:py-2 lg:static lg:w-auto lg:left-0 lg:bottom-0 lg:-translate-x-0 z-100"
          onClick={unlockedBalance > 0 && !isSyncing ? openModal : undefined}
        >
          Withdraw
        </Button>
      </Card>

      {isSyncing && (
        <p
          className={`text-xs px-2 mt-2 py-1 bg-[#f26822] rounded-lg text-black font-bold leading-[1.5] text-center transition-all duration-300 ease-out ${
            isSyncing ? "opacity-100 h-auto" : "opacity-0 h-0"
          }`}
        >
          {unlockedBalance > 0
            ? "Ooh, there is something, but let's wait for a full sync"
            : "Be patient, it's syncing with the blockchain"}
        </p>
      )}

      <WithdrawModal isOpen={isModalOpen} onClose={closeModal} sweepUnlocked={sweepUnlocked} />
    </div>
  );
}