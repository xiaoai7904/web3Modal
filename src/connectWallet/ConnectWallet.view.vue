<template>
  <div class="connect-wallet">
    <web3-modal-vue
      ref="web3modal"
      :theme="theme"
      :provider-options="providerOptions"
      cache-provider
    />
  </div>
</template>

<script>
import ConnectWallet from "./ConnectWallet.class";
export default ConnectWallet;
</script>

<style>
.el-notification__content,
.el-notification__title {
  text-align: left;
}
</style>
