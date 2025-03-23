import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useEffect, useRef, useState } from "react";

interface RenameModalProps {
  isRenameOpen: boolean;
  walletName: string;
  onRename: (newName: string) => void;
  onClose: () => void;
}

export const RenameModal = ({ isRenameOpen, onRename, onClose }: RenameModalProps) => {
  const [newWalletName, setNewWalletName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenameOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isRenameOpen]);

  useEffect(() => {
    if (isRenameOpen) {
      setNewWalletName("");
    }
  }, [isRenameOpen]);

  const handleRename = () => {
    if (newWalletName.trim() !== "") {
      onRename(newWalletName);
    }
    onClose();
  };

  return (
    <Modal isOpen={isRenameOpen} onOpenChange={onClose}>
      <ModalContent>
        <>
          <ModalHeader>Rename Wallet</ModalHeader>
          <ModalBody>
            <Input
              ref={inputRef}
              value={newWalletName}
              onChange={(e) => setNewWalletName(e.target.value)}
              label="Name for wallet"

            />
          </ModalBody>
          <ModalFooter>

            <Button color="default" fullWidth variant="flat" onPress={handleRename}>
              Rename
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};