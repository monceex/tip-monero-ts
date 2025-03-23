import { useState, useCallback } from "react";

export const usePassPhrase = () => {
  const [showPassModal, setShowPassModal] = useState(false);
  const [resolvePass, setResolvePass] = useState<((pass: string) => void) | null>(null);
  const [rejectPass, setRejectPass] = useState<(() => void) | null>(null);

  const requestPassPhrase = useCallback(() => {
    return new Promise<string>((resolve, reject) => {
      setResolvePass(() => resolve);
      setRejectPass(() => reject);
      setShowPassModal(true);
    });
  }, []);

  const closePassModal = useCallback(() => {
    setShowPassModal(false);
    setResolvePass(null);
    setRejectPass(null);
  }, []);

  const resetResolvePass = useCallback(() => {
    setResolvePass(null);
  }, []);

  return {
    showPassModal,
    requestPassPhrase,
    closePassModal,
    resolvePass,
    resetResolvePass,
  };
};