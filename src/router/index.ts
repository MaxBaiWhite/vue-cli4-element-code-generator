import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/VueCli3Generator",
        name: "Vue-Cli3-Element代码生成",
        component: () =>
            import("../views/VueCli3Generator/index.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    //@ts-ignore
    base: window.__POWERED_BY_QIANKUN__ ? process.env.VUE_APP_miBase : process.env.VUE_APP_base,
    // base: '/vue',
    routes
});
export default router;
