import React, { createContext, useState, useContext, ReactNode } from "react";
import CustomNotification from "@/components/Notification";

type AlertColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";

interface Notification {
  id: number;
  title: string;
  message: string;
  color: AlertColor;
  isClosing?: boolean;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, "id">) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
  
    const showNotification = (notification: Omit<Notification, "id">) => {
      const id = Date.now();
      setNotifications((prev) => [...prev, { ...notification, id }]);
  
      setTimeout(() => closeNotification(id), 4000);
    };
  
    const closeNotification = (id: number) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isClosing: true } : n))
      );
  
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 500);
    };
  
    return (
      <NotificationContext.Provider value={{ showNotification }}>
        {children}
        <div className="fixed px-4 z-[99999999] w-full justify-center mt-4 left-0 top-0 flex flex-col gap-2">
          {notifications.slice().reverse().map((notification) => (
            <CustomNotification
              key={notification.id}
              title={notification.title}
              message={notification.message}
              color={notification.color}
              onClose={() => closeNotification(notification.id)}
              isClosing={notification.isClosing}
            />
          ))}
        </div>
      </NotificationContext.Provider>
    );
  };
  
  
  

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};