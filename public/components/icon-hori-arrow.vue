<template>
  <div class="i-h-arrow" @click="whenClick">
    <div class="line1 line1-right" :class="line1Class"></div>
    <div class="line2"></div>
    <div class="line3 line3-right" :class="line3Class"></div>
  </div>
</template>

<script>
export default {
  props: ['state', 'whenClick'],
  data() {
    return {
    };
  },
  computed: {
    line1Class () {
      return {
        'line1-right': this.state === 'right',
        'line1-middle': this.state === 'middle'
      }
    },
    line3Class () {
      return {
        'line3-right': this.state === 'right',
        'line3-middle': this.state === 'middle'
      }
    }
  }
};
</script>

<style lang="css">
.i-h-arrow {
  position: relative;
  width: 100px;
  height: 100px;
  overflow: hidden;
}

.i-h-arrow div[class*=line] {
  position: absolute;
  background-color: rgb(80, 80, 80);
  transition: 300ms;
}

.i-h-arrow .line1 {
  bottom: 55px;
  right: 0px;
  height: 50px;
  width: 10px;
  transform-origin: 100% 100%;
}

.i-h-arrow .line2 {
  top: 45px;
  width: 100px;
  height: 10px;
}

.i-h-arrow .line3 {
  top: 55px;
  right: 0px;
  height: 50px;
  width: 10px;
  transform-origin: 100% 0%;
}

.line1-right {
  transform: rotate(-45deg);
}
.line1-middle {
  transform: translateX(-45px);
}
.line3-right {
  transform: rotate(45deg);
}
.line3-middle {
  transform: translateX(-45px);
}

</style>
