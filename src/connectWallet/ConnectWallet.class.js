import Web3 from "web3";
import Web3ModalVue from "../web3modal-vue/src/Web3ModalVue.vue";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { bscRpc, bscTestRpc1, infuraId, networkConf } from "../config";
import { Notification } from "element-ui";

const ChainId = {
  BSC: 56,
  BSC_TEST: 97,
};

const getRpcUrl = () => {
  return { [ChainId.BSC]: bscRpc, [ChainId.BSC_TEST]: bscTestRpc1 };
};

function initWeb3(provider) {
  const web3 = new Web3(provider ? provider : Web3.givenProvider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
}

export default {
  name: "ConnectWallet",

  components: { Web3ModalVue },

  data() {
    return {
      connectOptions: {
        account: "",
        chainId: "",
        library: initWeb3(),
        active: false,
      },
      theme: "light",
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId,
            rpc: getRpcUrl(),
          },
        },
      },
      env: "prod",
    };
  },

  mounted() {
    window.dapp.event.off("login");
    window.dapp.event.off("logout");

    window.dapp.event.on("login", (data) => {
      if (Object.keys(data).length) {
        this.env = data.env;
      }
      this.connect();
    });
    window.dapp.event.on("logout", () => {
      this.logout();
    });
  },

  methods: {
    async connect() {
      const provider = await this.$refs.web3modal.connect();

      const web3 = initWeb3(provider);
      web3.pollingInterval = 12000;

      const network = await web3.eth.getChainId();
      const accounts = await web3.eth.getAccounts();

      this.connectOptions.library = web3;

      // 手机扫描登录情况isMetaMask字段不存在
      if (
        !provider.isMetaMask &&
        !networkConf[this.env][`0x${network.toString(16)}`]
      ) {
        Notification.closeAll();
        Notification.error({
          title: "Hint",
          message: `The current chain is not supported, please switch to the BSC chain`,
        });
        window.dapp.event.emit("chainError", this.connectOptions);
        this.logout();
        return false;
      }

      if (!networkConf[this.env][`0x${network.toString(16)}`]) {
        window.dapp.event.emit("chainError", this.connectOptions);
        await this.addNetwork(provider, this.env === "prod" ? "0x38" : "0x61");
      }

      this.connectOptions.chainId = network;
      this.connectOptions.account = accounts[0];
      this.connectOptions.active = true;
      if (accounts.length > 0) {
        this.connectOptions.account = accounts[0];
        window.dapp.event.emit("loginSuccess", this.connectOptions);
      }

      provider.on("connect", async (info) => {
        let chainId = parseInt(info.chainId);
        this.connectOptions.chainId = chainId;
      });

      provider.on("accountsChanged", (accounts) => {
        this.connectOptions.account = accounts[0];
        window.dapp.event.emit("accountsChanged", this.connectOptions);
        Notification.closeAll();
        Notification.error({
          title: "Hint",
          message: "The current wallet account has changed.",
        });
      });

      provider.on("chainChanged", async (chainId) => {
        this.connectOptions.chainId = chainId;
        window.dapp.event.emit("chainChanged", this.connectOptions);
        Notification.closeAll();
        Notification.error({
          title: "Hint",
          message: "The current connection chain has changed.",
        });
      });
      provider.on("disconnect", (code, reason) => {
        window.dapp.event.emit("disconnect");
      });
    },
    logout() {
      return new Promise(async (reslove) => {
        try {
          if (
            this.connectOptions.library &&
            this.connectOptions.library.currentProvider &&
            this.connectOptions.library.currentProvider.close
          ) {
            await this.connectOptions.library.currentProvider.close();
          }

          if (this.$refs.web3modal) {
            await this.$refs.web3modal.clearCachedProvider();
          }
          this.clear();
          reslove();
        } catch (error) {
          console.error(error);
        }
      });
    },
    clear() {
      this.connectOptions.account = "";
      this.connectOptions.chainId = "";
      this.connectOptions.active = false;
      window.localStorage.removeItem("connectorId");
      window.dapp.event.emit("disconnect");
    },
    addNetwork(provider, chainId) {
      return new Promise((reslove, reject) => {
        if (networkConf[this.env][chainId]) {
          provider
            .request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  ...networkConf[this.env][chainId],
                },
              ],
            })
            .then(() => {
              this.connect();
            })
            .catch((e) => {
              reject();
            });
        }
        reject();
      });
    },
  },
};
