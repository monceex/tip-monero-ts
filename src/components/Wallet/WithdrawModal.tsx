import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalFooter } from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import { useState, useEffect } from "react";
import { Tooltip } from "@heroui/tooltip";

const MONERO_ADDRESS_REGEX = /^[458][0-9A-Za-z]{94}$/;

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  sweepUnlocked: (address: string) => Promise<void>;
}

export default function WithdrawModal({ isOpen, onClose, sweepUnlocked }: WithdrawModalProps) {
  const [moneroAddress, setMoneroAddress] = useState("");
  const [isValidAddress, setIsValidAddress] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddressTouched, setIsAddressTouched] = useState(false);

  const validateMoneroAddress = (address: string) => MONERO_ADDRESS_REGEX.test(address);

  useEffect(() => {
    setIsValidAddress(validateMoneroAddress(moneroAddress));
  }, [moneroAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setMoneroAddress(address);
    setIsValidAddress(validateMoneroAddress(address));
    setIsAddressTouched(false);
  };

  const handleSubmit = async () => {
    if (!isValidAddress) {
      setIsAddressTouched(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await sweepUnlocked(moneroAddress);
      console.log('Submitting...');
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Submission failed:', error);
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = !isValidAddress || isSubmitting || !moneroAddress;

  return (
    <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} hideCloseButton>
      <ModalContent>
        <ModalBody>
          <p className="mt-2">Please enter your Monero address to proceed with the withdrawal. Once submitted, this action cannot be undone.</p>
          <Input
            label="Wallet address"
            type="text"
            value={moneroAddress}
            onChange={handleInputChange}
            placeholder="888tNkZrPN6JsEgekjM..."
          />
          {!isValidAddress && isAddressTouched && (
            <small className="text-red-500">Invalid Monero address. It should start with '4' or '8' or '5' if stagenet and be 95 characters long.</small>
          )}
        </ModalBody>
        <ModalFooter>
          <Tooltip
            content="Invalid Monero address. It should start with '4' or '8' and be 95 characters long."
            showArrow={true}
            isDisabled={isValidAddress}
          >
            <Button
              fullWidth
              color={isValidAddress ? "success" : "default"}
              variant="flat"
              size="lg"
              isDisabled={isButtonDisabled}
              onClick={handleSubmit}
            >
              {isSubmitting ? <Spinner size="sm" color="success" variant="default" /> : "Submit"}
            </Button>
          </Tooltip>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}