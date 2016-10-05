<template>
  <div class="popupContainer">
    <room-creator></room-creator>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import roomCreator from './pop-crtRoom.vue'

export default {
  components: {
    roomCreator
  }
};
</script>

<style lang="css">
</style>
