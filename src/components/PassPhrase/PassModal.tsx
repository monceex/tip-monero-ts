// PassModal.tsx
import { PassPhrase } from "@/components/PassPhrase/PassPhrase";

interface PassPhraseModalProps {
  visible: boolean;
  onClose: () => void;
  resolvePass: ((pass: string) => void) | null;
  passText: string;
}

export const PassPhraseModal = ({ visible, onClose, resolvePass, passText }: PassPhraseModalProps) => {
  if (!visible) return null;

  const handleSubmit = (result: { pass?: string }) => {
    if (resolvePass && result.pass && result.pass.split(" ").length === 2) {
      resolvePass(result.pass);
    }
  };

  return <PassPhrase onSubmit={handleSubmit} onClose={onClose} passText={passText} />;
};