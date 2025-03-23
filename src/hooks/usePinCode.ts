import { useState, useCallback } from "react";

export const usePinCode = () => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [resolvePin, setResolvePin] = useState<((pin: string) => void) | null>(null);
  const [rejectPin, setRejectPin] = useState<(() => void) | null>(null);

  const requestPinCode = useCallback(() => new Promise<string>((resolve, reject) => {
    const handleSubmit = (pin: string) => {
      setShowPinModal(false);
      resolve(pin);
    };

    const handleClose = () => {
      setShowPinModal(false);
      reject(new Error("Pin code input canceled"));
    };

    setResolvePin(() => handleSubmit);
    setRejectPin(() => handleClose);
    setShowPinModal(true);
  }), []);

  const closePinModal = useCallback(() => {
    setShowPinModal(false);
    if (rejectPin) {
      rejectPin();
    }
  }, [rejectPin]);

  return { showPinModal, setShowPinModal, resolvePin, requestPinCode, closePinModal };
};