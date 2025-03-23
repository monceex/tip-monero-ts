//PincodeModal.tsx
import { Pincode } from "@/components/PinCode/Pin";


interface PincodeModalProps {
  visible: boolean;
  onClose: () => void;
  resolvePin: ((pin: string) => void) | null;
  pinText: string;
}

export const PincodeModal = ({ visible, onClose, resolvePin, pinText }: PincodeModalProps) => {
  if (!visible) return null;

  const handleSubmit = (result: { pin?: string;  }) => {
    if (resolvePin && result.pin?.length === 4) {
      resolvePin(result.pin);
    }
    
  };

  return <Pincode onSubmit={handleSubmit} onClose={onClose} pinText={pinText} />;
};