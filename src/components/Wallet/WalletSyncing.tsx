import { Spinner } from "@heroui/spinner";


export default function WalletSyncing() {
  return (
    <div className="flex flex-col items-center gap-2">
      <p>Be patient, it's syncing with blockchain in your browser...</p>
      <Spinner size="sm" color="primary" variant="dots" />
    </div>
  );
}
