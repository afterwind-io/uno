<template>
  <div id="app">
    <a href="https://github.com/afterwind-io">
      <img style="position: absolute; top: 0; right: 0; border: 0;" src="./assets/fork-me-on-github.png" alt="Fork me on GitHub">
    </a>

    <div id="appFrame">
      <router-view></router-view>

      <div id="gridRows">
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
        <div class="grid-row"></div>
      </div>
      <div id="gridCols">
        <div class="grid-col"></div>
        <div class="grid-col"></div>
        <div class="grid-col"></div>
        <div class="grid-col"></div>
        <div class="grid-col"></div>
        <div class="grid-col"></div>
        <div class="grid-col"></div>
        <div class="grid-col"></div>
        <div class="grid-col"></div>
        <div class="grid-col"></div>
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style lang="less">
#appFrame {
  position: relative;
  width: 1280px;
  height: 800px;
}

#gridRows, #gridCols {
  opacity: 0;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
}
#gridCols {
  flex-direction: column;
}
.grid-row {
  width: 5%;
  height: 100%;
}
.grid-row:nth-child(odd){
  background-color: rgba(255, 0, 0, 0.3);
}
.grid-row:nth-child(even){
  background-color: rgba(255, 100, 0, 0.3);
}
.grid-col {
  width: 100%;
  height: 10%;
}
.grid-col:nth-child(odd) {
  background-color: rgba(0, 0, 255, 0.3);
}
.grid-col:nth-child(even) {
  background-color: rgba(0, 100, 255, 0.3);
}
</style>
