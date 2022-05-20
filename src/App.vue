<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>
<script>
import API from "./api/bnb-usdt";
export default {
  name: 'FrontendApp',
  provide(){
    return{
      reload:this.reload
    }
  },
  data() {
    return {
      isRouterAlive:true
    };
  },

  mounted() {
    this.fn();
  },

  methods: {
    reload(){
      console.log('刷新');
      this.isRouterAlive = false
      this.$nextTick(function(){
        this.isRouterAlive = true
      });
    },
    fn(){
      var that = this
      // ethereum.on('accountsChanged',function(accounts){
      //   console.log(99999);
      //   that.reload()
      //   // location.reload();
      // }).on('chainChanged', (_chainId) =>{
      //   that.reload()
      // });
    },
  },
};
</script>

<style lang="scss">

*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.img{
  width: 100%;
  height: 100%;
}
.dsp_f{
  display: flex;
  align-items: center;
}
.jc_sb{
  justify-content: space-between;
}
.jc_sa{
  justify-content: space-around;
}
.jc_c{
  justify-content: center;
}
.bg_img{
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
body{
  .el-popover{
    top: 100px !important;
    padding: 10px 20px 10px;
    background-color: #292146;
    border: 0px solid #292146;
    color: #B9A1C6;
    font-size: 26px;
    font-weight: Regular;
    font-family: PingFang SC-Regular;
    .popper__arrow{
      border-bottom-color: #292146 !important;
      &::after{
        border-bottom-color: #292146 !important;
      }
    }
    .menuBar_item{
      padding: 15px 0px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #47345E;
      &:nth-of-type(8){
        border-bottom: 0px solid #47345E;
      }
      .i_icon{
        width: 30px !important;
        height: 30px !important;
        margin-right: 20px;
        >img{
          width: 100% !important;
        }
      }
      .i_name{
        
      }
    }
  }
}


</style>
