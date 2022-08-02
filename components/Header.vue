<template>
  <div
    class="bg-dark text-light p-2 d-flex justify-content-around align-items-center"
  >
    <h2 class="">Donation DApp</h2>
    <div
      class="btn btn-primary"
      :class="CurrentAccount && ChainId != 97 ? 'btn-warning' : ''"
      @click="
        () => {
          connectMetamask();
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
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["CurrentAccount"]),
    ...mapGetters(["ChainId"]),
  },
  methods: {
    ...mapActions(["checkWalletIsConnected"]),
    ...mapActions(["connectMetamask"]),
  },
  mounted() {
    this.checkWalletIsConnected();
  },
};
</script>
