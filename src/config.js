// 主网id
export const mainNetwork = [0x38];

export const infuraId = "81110507733e42848ee5e2da1279ebac";

export const bscTestRpc1 = "https://data-seed-prebsc-1-s1.binance.org:8545/";

export const bscTestRpc2 = "https://bsc-dataseed1.defibit.io";

export const bscTestRpc3 = "https://bsc-dataseed.binance.org";

export const bscRpc = "https://bsc-dataseed.binance.org/";

// 网络配置
export const networkConf = {
  prod: {
    "0x38": {
      chainId: "0x38", // 56
      chainName: "BSC",
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
      rpcUrls: ["https://bsc-dataseed.binance.org/"],
      blockExplorerUrls: ["https://testnet.bscscan.com/tx/"],
    },
  },
  dev: {
    "0x61": {
      chainId: "0x61", // 97
      chainName: "BSC Test",
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
      rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
      blockExplorerUrls: ["https://bscscan.com/tx/"],
    },
  },
};
