<template>
  <router-view/>
</template>

<style lang="less">
body,html{
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

/*公共的flex布局*/
.flex-float{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex{
   display: flex;
   align-items: center;
}
.page_content{
  display: block;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  margin-top: 30px;
  background: #ffffff;
}
</style>
