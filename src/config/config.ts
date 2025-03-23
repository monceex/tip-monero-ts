export const config = {
    daemonUrl: process.env.DAEMON_URL || "https://stagenet.xmr.ditatompel.com:443",
    networkType: process.env.NETWORK_TYPE || 2, // 2 = STAGENET, 1 = MAINNET, 3 = TESTNET
    price: 220 // dummy
  };