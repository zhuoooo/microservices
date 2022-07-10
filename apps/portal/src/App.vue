<template>
  <div id="app">
    <menu-view></menu-view>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MenuView from '@/views/menu/Menu.vue'

@Component({
  components: {
    MenuView
  }
})
export default class HomeView extends Vue {
  
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

</style>
