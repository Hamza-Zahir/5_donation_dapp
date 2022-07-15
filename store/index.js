import Web3 from "web3";
import big from "big.js";
import dataCcontract from "../smart_contract/build/contracts/Donation.json";
const AbiCcontract = dataCcontract.abi;
const contractAddres = "0x2Dc28C932d45A44E3A6aEa32C8c470774591AbfF";



const state = {
  CurrentAccount: "",
  ChainId: "",
  AllImages: [],

};

const getters = {
  CurrentAccount: (state) => state.CurrentAccount,
  ChainId: (state) => state.ChainId,
  AllImages: (state) => state.AllImages,


};
const actions = {
  async connectMetamask({ commit }) {
    const ethereum = window.ethereum;
    if (!ethereum) {
      window.open("https://metamask.io", "blank");
    } else {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      commit("setCurrentAccount", accounts[0]);

      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${Number(97).toString(16)}` }],
        });
        await ethereum.request({ method: "eth_chainId" }).then((resalt) => {
          commit("setChainId", Number(resalt));
        });
        // window.location.reload();

      } catch (switchError) {
        console.log(switchError);
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

            await ethereum.request({ method: "eth_chainId" }).then((resalt) => {
              commit("setChainId", Number(resalt));
            });
            // ethereum.on("chainChanged", handleChainChanged);
            // function handleChainChanged(_chainId) {
            //   window.location.reload();
            // }
            // window.location.reload();




          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  },
  async checkWalletIsConnected({ commit }) {
    const ethereum = await window.ethereum;
    let web3 = new Web3(Web3.givenProvider || ethereum);
    let accounts = await web3.eth.getAccounts();
    if (accounts.length) {
      commit("setCurrentAccount", accounts[0]);
      await ethereum.request({ method: "eth_chainId" }).then((resalt) => {
        commit("setChainId", Number(resalt));
      });
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
        ethereum.on("accountsChanged", handleAccountsChanged);
        ethereum.on("chainChanged", handleChainChanged);
        ethereum.on("disconnect", handleDisconnect);
  },
  async getAllImages({ commit }) {
        try {
          let _AllImages = [];
          const ethereum = await window.ethereum;
          if (ethereum) {
            const web3 = new Web3(Web3.givenProvider || ethereum);
            const DonationContract = new web3.eth.Contract(
              AbiCcontract,
              contractAddres
            );
            const _imageCount = await DonationContract.methods.imageCount().call();

              for (let i = 1; i <= Number(_imageCount); i++) {
                const _image = await DonationContract.methods.images(i).call();

                const _donationAmount= big(_image.donationAmount)
                .div(10 ** 18)
                .toFixed();

                _AllImages.push({
                  id: _image.id,
                  imgHash: _image.imgHash,
                  description: _image.description,
                  donationAmount: _donationAmount,
                  author: _image.author,
                });
              }
            commit("setAllImages", _AllImages);
          }
        } catch (error) {
          console.log(error)
        }
      },
};
const mutations = {
  setCurrentAccount: (state, addres) => (state.CurrentAccount = addres),
  setChainId: (state, chainId) => (state.ChainId = chainId),
  setAllImages: (state, array) => (state.AllImages = array),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
