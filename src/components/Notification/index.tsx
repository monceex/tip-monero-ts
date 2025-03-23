import { Alert } from "@heroui/alert";
import { useEffect, useRef, useState } from "react";

type AlertColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";

interface CustomNotificationProps {
  title: string;
  message: string;
  color: AlertColor;
  onClose: () => void;
  isClosing?: boolean;
}

export default function CustomNotification({ title, message, color, onClose, isClosing }: CustomNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 15);
  }, []);

  useEffect(() => {
    if (isClosing) {
      setIsVisible(false);
      setTimeout(onClose, 500);
    }
  }, [isClosing, onClose]);

  return (
    <div
      className={`transition-all z-[99999999] w-full lg:w-[320px] duration-500 ease-in-out transform ${
        isClosing ? "-translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      }`}
      onClick={onClose}
    >
      <Alert variant="solid" className="h-12 items-center w-full" color={color} description={message} title={title} />
    </div>
  );
}
