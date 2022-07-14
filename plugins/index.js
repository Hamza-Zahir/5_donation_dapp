import Web3 from "web3";
import dataCcontract from "../smart_contract/build/contracts/Donation.json";
const AbiCcontract = dataCcontract.abi;
const contractAddres = "0x2Dc28C932d45A44E3A6aEa32C8c470774591AbfF";


export default {
  async UploadImage(_CurrentAccount, _imgHash, _description ) {
        try {
          const ethereum = window.ethereum;
          const web3 = new Web3(Web3.givenProvider || ethereum);
          const DonationContract = new web3.eth.Contract(
            AbiCcontract,
            contractAddres
          );
          await DonationContract.methods.uploadImage(_imgHash, _description).send({
            from: _CurrentAccount,
          });
        } catch (error) {
          console.log(error)
        }
      },
      async DonateImageOwner(_CurrentAccount, _id, _amount) {
        try {
          const ethereum = window.ethereum;
          const web3 = new Web3(Web3.givenProvider || ethereum);
          const DonationContract = new web3.eth.Contract(
            AbiCcontract,
            contractAddres
          );
          const amount = web3.utils.toWei(_amount.toString(), "Ether");

          await DonationContract.methods.donateImageOwner(_id).send({
            from: _CurrentAccount,
            value: amount,
          });
        } catch (error) {}
      },
};
