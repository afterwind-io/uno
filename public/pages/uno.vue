<template>
  <div class="table">
    <card :color="currentCard.color" :symbol="currentCard.symbol"></card>
  </div>
  <div class="players">

  </div>
  <div class="mycards">
    <card v-for="card in cards"
      :color="card.color" :symbol="card.symbol"
    ></card>
  </div>
</template>

<script>
import card from '../components/card.vue'

export default {
  data() {
    return {
    };
  },
  computed: {},
  methods: {},
  components: {
    card
  }
};
</script>

<style lang="css">
</style>
