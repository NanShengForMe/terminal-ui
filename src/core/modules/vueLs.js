// https://robinck.gitbooks.io/vue-storage/
import Vue from "vue";
import Storage from "vue-ls";

const options = {
  // key prefix
  namespace: "vuejs__",
  // name variable Vue.[ls] or this.[$ls],
  name: "ls",
  // storage name session, local, memory
  storage: "local"
};

Vue.use(Storage, options);

Vue.$log.debug("register vue-ls finish");
