import { Card, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { Image } from "@heroui/image";
import { Icon } from "@iconify/react";

interface WalletAppCardProps {
  name: string;
  image: string;
}

interface WalletRecProps {
  isSyncing: boolean;
}

export default function WalletRecommendations(isSyncing : WalletRecProps) {
  return (
    <div className="flex flex-col">

      <p className="text-sm p-2 leading-[1.5]">
        To withdraw balance, you'll need your own wallet. If you don't have one yet, check out these awesome apps!
      </p>

      <div className="flex gap-2 w-full">
        <Link isExternal href="https://stackwallet.com/" className="flex-1">
          <WalletAppCard name="Stack Wallet" image="/stack.png" />
        </Link>
        <Link isExternal href="https://cakewallet.com/" className="flex-1">
          <WalletAppCard name="Cake Wallet" image="/cake.png" />
        </Link>
      </div>
    </div>
  );
}

function WalletAppCard({ name, image }: WalletAppCardProps) {
  return (
    <Card className="py-3 w-full">
      <CardHeader className="pb-0 pt-0 px-3 flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Image width={50} shadow="md" src={image} />
          <p className="text-tiny uppercase font-bold text-lg">{name}</p>
        </div>
        <Icon className="ml-auto" icon="hugeicons:link-square-01" width="1rem" height="1rem" />
      </CardHeader>
    </Card>
  );
}