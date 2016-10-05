<template lang="html">
  <div class="mainFrame">
    <h1>Lobby</h1>
    <rooms></rooms>
    <players></players>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ui_players from '../components/lobby-players.vue'
import ui_rooms from '../components/lobby-rooms.vue'


export default {
  data() {
    return {}
  },
  computed: {},
  methods: {},
  components: {
    players: ui_players,
    rooms: ui_rooms,
  }
}
</script>

<style lang="less">
</style>
