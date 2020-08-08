<template>
  <div id="app">
    <transition name="fade">
      <router-view />
    </transition>
  </div>
</template>

<style lang="scss">
@import url('./assets/css/commonStyle.scss');
.fade-enter-active{
  display: block;
  transition: opacity .3s;
}
.fade-leave-active {
  display: none;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
