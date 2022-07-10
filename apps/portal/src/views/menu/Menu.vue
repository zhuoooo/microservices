<template>
  <nav class="menu">
      <router-link v-for="item of router" :key="item.routeName" :to="{name: item.routeName}" class="menu-item">{{item.text}}</router-link>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import allRouter from './const';

@Component
export default class HomeView extends Vue {
  get router () {
    return allRouter;
  }
}
</script>

<style scoped lang="less">
.menu {

  padding: 30px;
  &-item {
    margin-left: 8px;
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>