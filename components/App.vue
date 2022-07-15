<template>
  <div>
    <div
      class="bg-dark text-light p-2 d-flex justify-content-around align-items-center"
    >
      <h2 class="">Donation DApp</h2>
      <div
        class="btn btn-primary"
        :class="CurrentAccount && ChainId != 97 ? 'btn-warning' : ''"
        @click="
          () => {
            // connectWallet();
            connectMetamask()
          }
        "
      >
        {{
          CurrentAccount && ChainId == 97
            ? `${CurrentAccount.slice(0, 5)}...${CurrentAccount.slice(
                CurrentAccount.length - 4
              )}`
            : CurrentAccount && ChainId != 97
            ? "network erore"
            : " Conect Wallet"
        }}
      </div>
    </div>
    <div
      v-if="showUplodCard"
      @click="showUplodCard = false"
      class="bgDark"
    ></div>
    <div class="UplodCard p-3" v-if="showUplodCard">
      <h3 class="">Uplod Image to IPFS</h3>
      <input
        type="file"
        name=""
        id=""
        class="m-2"
        @change="
          (e) => {
            handelFile(e.target.files[0]);
          }
        "
      />
      <div class="mx-auto text-center py-3">
        <img v-if="ipfsHash" :src="`https://ipfs.io/ipfs/${ipfsHash}`" alt="" />
      </div>
      <textarea
        name=""
        id=""
        cols=""
        rows="3"
        class="w-100 p-3"
        :value="Description"
        @input="
          (e) => {
            Description = e.target.value;
          }
        "
      ></textarea>
      <div
        class="btn btn-info"
        @click="
          () => {
            creatImage();
          }
        "
      >
        Uplod
      </div>
    </div>

    <div class="content mx-auto mb-5">
      <h4
        class="my-3 text-center bg_info rounded p-2"
        @click="showUplodCard = true"
      >
        Uplod Image +
      </h4>

      <div v-if="AllImages.length" class="w-100">
        <div
          v-for="img in AllImages"
          :key="img.id"
          class="card rounded p-0 my-3"
        >
          <div class="head p-2">
            <span class="mr-2"><img src="../assets/blank.png" alt="" /></span>
            <span>{{ img.author }}</span>
          </div>
          <div class="body">
            <img
              :src="`https://ipfs.io/ipfs/${img.imgHash}`"
              alt=""
              class="w-100"
            />
            <h4 class="m-2">Description:</h4>
            <p class="h6 m-3">{{ img.description }}</p>
          </div>
          <div class="footer h5 p-2 border m-0 mt-2">
            <span>TOTAL TIPS: {{ img.donationAmount }} BNB</span>
            <hr />
            <div class="d-flex justify-content-between align-items-center">
              <input
                type="number"
                name=""
                id=""
                :value="tips"
                placeholder="tips (BNB)"
                step="0.01"
                class="p-2"
                @input="
                  (e) => {
                    id = img.id;
                    tips = e.target.value;
                  }
                "
              />
              <span class="btn btn-info" @click="donateImageOwner">Donate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import plugins from "../plugins/index";
import create from "ipfs-http-client";
const client = new create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});
export default {
  data() {
    return {
      showUplodCard: false,
      ipfsHash: "",
      Description: "",
      tips: "",
      id: "",
    };
  },
  computed: {
    ...mapGetters(["CurrentAccount"]),
    ...mapGetters(["ChainId"]),
    ...mapGetters(["AllImages"]),
  },
  mounted() {
    this.checkWalletIsConnected();
    this.getAllImages();
  },
  methods: {
    ...mapActions(["checkWalletIsConnected"]),
    ...mapActions(["connectMetamask"]),
    ...mapActions(["getAllImages"]),
    async handelFile(file) {
      const added = await client.add(file);
      this.ipfsHash = added[0].hash;
    },

    async creatImage() {
      try {
        if (this.CurrentAccount && this.ipfsHash && this.Description) {
          await plugins
            .UploadImage(this.CurrentAccount, this.ipfsHash, this.Description)
            .then(async () => {
              this.showUplodCard = false;
              this.ipfsHash = "";
              this.Description = "";
              await this.getAllImages();
            });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async donateImageOwner() {
      try {
        if (this.CurrentAccount && this.id && this.tips) {
          await plugins
            .DonateImageOwner(this.CurrentAccount, this.id, this.tips)
            .then(async () => {
              this.tips = "";
              this.id = "";
              await this.getAllImages();
            });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async GetAllImages() {
      await this.checkWalletIsConnected();
      await this.getAllImages();
    },
  },
};
</script>
<style scoped>
.UplodCard {
  min-width: 300px !important;
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 99;
  background: #ececec;
  border-radius: 10px;
}
.bgDark {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.74);
  z-index: 3;
}
.UplodCard img {
  min-width: 75%;
  max-width: 100%;
}
.content {
  max-width: 450px;
}
textarea {
  background: rgb(224, 250, 250);
}
.bg_info {
  background: #8cdcebdc;
  color: rgb(3, 33, 165);
}
.head img {
  width: 35px;
  height: 35px;
}
.card .body img {
  max-height: 350px;
}
.footer input {
  background: rgb(169, 239, 247);
  border: none;
  outline: none;
}
</style>
