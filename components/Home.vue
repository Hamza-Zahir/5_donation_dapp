<template>
  <div>
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
        <div v-for="post in AllImages" :key="post.id">
          <PostsCard :post="post" />
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
    };
  },
  computed: {
    ...mapGetters(["AllImages"]),
  },
  mounted() {
    this.getAllImages();
  },
  methods: {
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

</style>
