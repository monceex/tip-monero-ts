import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

interface MnemonicModalProps {
  isOpen: boolean;
  onClose: () => void;
  mnemonic: string;
  onCopy: () => void;
}

export const MnemonicModal = ({
  isOpen,
  onClose,
  mnemonic,
  onCopy,
}: MnemonicModalProps) => {
  const words = mnemonic.trim().split(/\s+/);
  const half = Math.ceil(words.length / 2);
  const left = words.slice(0, half);
  const right = words.slice(half);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Mnemonic</ModalHeader>
        <ModalBody>
          <div className="flex justify-center gap-4">
            <div className="grid grid-cols-2 font-mono text-md gap-8">
              <div className="flex flex-col gap-1">
                {left.map((word, index) => (
                  <div key={index}>
                    <span className="text-gray-500 mr-1">{index + 1}.</span>
                    {word}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1">
                {right.map((word, index) => (
                  <div key={index + half}>
                    <span className="text-gray-500 mr-1">{index + 1 + half}.</span>
                    {word}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>

          <Button color="default" fullWidth size="lg" variant="flat" onPress={onCopy}>
            Copy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
