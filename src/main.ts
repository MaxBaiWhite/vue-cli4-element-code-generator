import './public-path';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
Vue.config.productionTip = false;



let instance:any = null;

function selfRender() {
  instance = new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount('#app');
}
// @ts-ignore
if (!window.__POWERED_BY_QIANKUN__) {
  selfRender();
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped');
}
// @ts-ignore
export async function mount(props) {
  console.log('[vue] props from main framework', props);
  selfRender();
}

export async function unmount() {
  instance.$destroy();
  instance = null;
  // router = null;
}