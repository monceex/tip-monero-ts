import { useState, useEffect } from "react";
import { daemonHeight } from "@/utils/monero";

export const useDaemonHeight = () => {
  const [currentHeight, setCurrentHeight] = useState<number>();

  useEffect(() => {
    const fetchHeight = async () => {
      setCurrentHeight(await daemonHeight());
    };

    fetchHeight();
    const interval = setInterval(fetchHeight, 60000);
    return () => clearInterval(interval);
  }, []);

  return { currentHeight };
};