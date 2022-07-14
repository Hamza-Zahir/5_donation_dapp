import Web3 from "web3";
import big from "big.js";
import dataCcontract from "../smart_contract/build/contracts/Donation.json";
const AbiCcontract = dataCcontract.abi;
const contractAddres = "0x2Dc28C932d45A44E3A6aEa32C8c470774591AbfF";

const state = {
  AllImages: [],
};

const getters = {
  AllImages: (state) => state.AllImages,
};
const actions = {

  async getAllImages({ commit }) {
    try {
      let _AllImages = [];
      const ethereum = window.ethereum;
      if (ethereum) {
        const web3 = new Web3(Web3.givenProvider || ethereum);
        const DonationContract = new web3.eth.Contract(
          AbiCcontract,
          contractAddres
        );
        const _imageCount = await DonationContract.methods.imageCount().call();

        if (Number(_imageCount) > 0) {
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
        }
        commit("setAllImages", _AllImages);
      }
    } catch (error) {}
  },
};
const mutations = {
  setAllImages: (state, array) => (state.AllImages = array),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
