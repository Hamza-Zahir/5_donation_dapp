<template>
  <div class="border my-2">

          <div class="head p-2  d-flex">
            <span class=""><img src="../assets/blank.png" alt="" class="" /></span>
            <small class="col">{{ post.author }}</small>
          </div>
          <div class="body">
            <img
              :src="`https://ipfs.io/ipfs/${post.imgHash}`"
              alt=""
              class="w-100"
            />
            <h4 class="m-2">Description:</h4>
            <p class="h6 m-3">{{ post.description }}</p>
          </div>
          <div class="footer h5 p-2 border m-0 mt-2">
            <span>TOTAL TIPS: {{ post.donationAmount }} BNB</span>
            <hr />
            <div class="d-flex m-0 p-0 justify-content-between align-items-center">
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
                    id = post.id;
                    tips = e.target.value;
                  }
                "
              />
              <span class="btn btn-info" @click="donateImageOwner">Donate</span>
            </div>
          </div>
        </div>

</template>
<script>
import { mapActions, mapGetters } from "vuex";
import plugins from "../plugins/index";

export default {
  data() {
    return {
      tips: "",
      id: "",
    };
  },
   props: {
    post: {
      required: true,
      type: Object,
    },
  },
  computed: {
    ...mapGetters(["CurrentAccount"]),
    ...mapGetters(["ChainId"]),
  },

  methods: {
    ...mapActions(["getAllImages"]),

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

  },
};
</script>
<style scoped>
.head img {
  width: 30px;
  height: 30px;
}
.card .body img {
  max-height: 350px;
}
.footer input {
  background: rgb(169, 239, 247);
  border: none;
  outline: none;
  max-width: 70%;

}
</style>
