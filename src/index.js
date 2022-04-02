import Vue from "vue";
import App from "./connectWallet/ConnectWallet.view.vue";
import mitt from "mitt";

window.dapp = { event: mitt() };

const appContent = document.createElement("div");
document.body.appendChild(appContent);

new Vue({
  render: (h) => h(App),
}).$mount(appContent);
