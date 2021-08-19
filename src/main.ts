import Vue from 'vue';
import Component from 'vue-class-component'
import App from './App.vue';
import VueRouter from 'vue-router';
import router from './router';
import {store} from './store/index';
import interceptors from './modules/interceptors';
import './quasar'
import './assets/site.css';
import 'typeface-nunito-sans';
import 'typeface-pt-sans-narrow';
interceptors();
Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.prototype.$eventHub = new Vue(); // Global event bus
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate' // for vue-router 2.2+
]);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
