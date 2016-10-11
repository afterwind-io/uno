<template>
  <div class="card" :style="bgColorLight">
    <div class="inner" :style="bgColorNormal">
      <p class="lt">{{card.symbol}}</p>
      <p class="rb">{{card.symbol}}</p>
    </div>
    <div class="center" :style="bgColorLight"></div>
    <p class="number" :style="fgColor">{{card.symbol}}</p>
  </div>
</template>

<script>
export default {
  props: ['card'],
  computed: {
    bgColorLight () {
      if(this.card.color === 'red') return {'background-color': 'rgb(255, 245, 245)'}
      if(this.card.color === 'green') return {'background-color': 'rgb(245, 255, 245)'}
      if(this.card.color === 'blue') return {'background-color': 'rgb(245, 245, 255)'}
      if(this.card.color === 'yellow') return {'background-color': 'rgb(255, 255, 245)'}
      return {'background-color': 'rgb(245, 245, 245)'}
    },
    bgColorNormal () {
      if(this.card.color === 'red') return {'background-color': 'rgb(255, 150, 150)'}
      if(this.card.color === 'green') return {'background-color': 'rgb(150, 255, 150)'}
      if(this.card.color === 'blue') return {'background-color': 'rgb(150, 150, 255)'}
      if(this.card.color === 'yellow') return {'background-color': 'rgb(255, 255, 150)'}
      return {'background-color': 'rgb(150, 150, 150)'}
    },
    fgColor () {
      if(this.card.color === 'red') return {'color': 'rgb(255, 150, 150)'}
      if(this.card.color === 'green') return {'color': 'rgb(150, 255, 150)'}
      if(this.card.color === 'blue') return {'color': 'rgb(150, 150, 255)'}
      if(this.card.color === 'yellow') return {'color': 'rgb(255, 255, 150)'}
      return {'color': 'rgb(150, 150, 150)'}
    }
  }
}
</script>

<style lang="css" scoped>
*{
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.card{
  position: relative;
  height: 160px;
  width: 100px;
  padding: 8px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow:
    0px 2px 4px 1px rgba(150, 150, 150, 0.5),
    0px -1px 1px 0px rgba(150, 150, 150, 0.8) inset,
    0px 1px 1px 0px rgba(255, 255, 255, 0.8) inset
}

.inner{
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 3px;
}

.number{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  line-height: 160px;
  text-align: center;
  font-size: 50px;
}

.lt, .rb{
  position: absolute;
  line-height: 21px;
  font-size: 21px;
  color: white;
}

.lt{
  left: 5px;
  top: 5px;
}

.rb{
  right: 5px;
  bottom: 5px;
  transform: rotate(180deg);
}

.center{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  height: 70px;
  width: 100px;
  border-radius: 50%;
  transform: rotate(-45deg);
}
</style>
