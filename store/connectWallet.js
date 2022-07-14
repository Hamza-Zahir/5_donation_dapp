import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
// import AbiCcontract from "../json/abiContract.json";

const INFURA_KEY = "58559f183f064e169dc624695e4da204";
const APP_NAME = "Donation DApp";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: INFURA_KEY,
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: APP_NAME,
      infuraId: INFURA_KEY,
      rpc: "",
      chainId: 4,
      darkMode: true,
    },
  },

  binancechainwallet: {
    package: true,
  },
};
const state = {
  CurrentAccount: "",
  ChainId: "",
  TokenUrlsOfUser: [],
  TotalBalans: 0,
};

const getters = {
  CurrentAccount: (state) => state.CurrentAccount,
  ChainId: (state) => state.ChainId,
  TokenUrlsOfUser: (state) => state.TokenUrlsOfUser,
  TotalBalans: (state) => state.TotalBalans,
};
const actions = {
  async connect_wallet({ commit }) {
    try {
      const web3Modal = new Web3Modal({
        network: "rinkeby",
        cacheProvider: true,
        providerOptions,
      });
      web3Modal.clearCachedProvider();

      await web3Modal.connect();

      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  },
  async checkWalletIsConnected({ commit }) {

    const provider = window.ethereum;
    if (provider) {
      const accountes = await provider.request({ method: "eth_accounts" });
      const library = new ethers.providers.Web3Provider(provider);
      const signer = library.getSigner();
      const chainId = await signer.getChainId();
      if (accountes.length) {
        commit("setCurrentAccount", accountes[0]);
        commit("setChainId", Number(chainId));
      }

        function handleAccountsChanged(accounts) {
          commit("setCurrentAccount", accounts[0]);
        }
        function handleChainChanged(_chainId) {
          commit("setChainId", Number(_chainId));
        }
        const handleDisconnect = () => {
          disconnect();
        };
        // ......................................
        provider.on("accountsChanged", handleAccountsChanged);
        provider.on("chainChanged", handleChainChanged);
        provider.on("disconnect", handleDisconnect);
    }
  },
  async chengNetwork() {
    try {
      const ethereum = window.ethereum;
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${Number(97).toString(16)}` }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${Number(97).toString(16)}`,
                chainName: "Binance Smart Chain Testnet",
                nativeCurrency: {
                  name: "Binance Chain Native Token",
                  symbol: "BNB",
                  decimals: 18,
                },
                rpcUrls: [
                  "https://data-seed-prebsc-1-s1.binance.org:8545",
                  "https://data-seed-prebsc-2-s1.binance.org:8545",
                  "https://data-seed-prebsc-1-s2.binance.org:8545",
                  "https://data-seed-prebsc-2-s2.binance.org:8545",
                  "https://data-seed-prebsc-1-s3.binance.org:8545",
                  "https://data-seed-prebsc-2-s3.binance.org:8545",
                ],
                blockExplorerUrls: ["https://testnet.bscscan.com"],
              },
            ],
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  },
};
const mutations = {
  setCurrentAccount: (state, addres) => (state.CurrentAccount = addres),
  setChainId: (state, chainId) => (state.ChainId = chainId),
  setTokenUrlsOfUser: (state, array) => (state.TokenUrlsOfUser = array),
  setTotalBalans: (state, num) => (state.TotalBalans = num),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
