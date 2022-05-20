<template>
  <div class="mainBox">
    <div class="headBar">
      <div class="headLeft">
        <div class="logo">
          <img src="./../../assets/tabbar/logo@2x.png" alt="">
        </div>
        <div class="name">Skate Metaverse</div>
      </div>
      <div class="headRight">
        <div class="connectWallet" v-if="!useraddress" @click="connectWallet()">{{$t('publics.publics01')}}
        </div>
        <div class="connectWallet useraddress" v-else>{{FormatAddr(useraddress)}}
          <div class="wallet">
            <img class="img" src="./../../assets/nft/nav-icon-wallet-defalt@2x.png" alt="">
          </div>
        </div>
        <div class="menuBarBox" @click="menuBarShow()">
          <el-popover popper-class="myPopover" placement="bottom" width="150" trigger="click" v-model="visible" transition="fade-in-linear">
          <div class="menuBar_item" v-for="item in menuBar" :key="item.name" @click="menuEvent(item)">
            <div class="i_icon">
              <img :src="item.icon" alt="">
            </div>
            <div class="i_name i18n">{{$t(`link.${ item.name}`)}}</div>
          </div>
          <div class="menuBarBtn" slot="reference">
            <img src="./../../assets/tabbar/nav-icon-menu-click@2x.png" alt="">
          </div>
        </el-popover>
        </div>
      </div>
    </div>
    <div class="Content">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view>
    </div>
    <TabBar class="bottomBar" />
  </div>
</template>

<script>
import TabBar from "@/components/Tabbar/tabbar";
import { mapGetters } from "vuex";
import { Toast } from "vant";
import { formatAddr } from "../../utils/tool";
import store from "../../store";
export default {
  name: "Swapdemo1Index",
  
  components: { TabBar },
  inject:['reload'],
  directives: {},

  data() {
    return {
      timer: "",
      toast: "",
      visible: false, // 菜单栏图标切换
      menuBar: [
        {
          name: "link01",
          icon: require("./../../assets/tabbar/content-icon-home-click@2x.png"),
          url: "/home",
          type: "1",
        },
        {
          name: "link02",
          icon: require("./../../assets/tabbar/content-lp-icon-click@2x.png"),
          url: "/pledge",
          type: "1",
        },
        {
          name: "link03",
          icon: require("./../../assets/tabbar/content-nft-icon-click@2x.png"),
          url: "/nft",
          type: "1",
        },
        {
          name: "link04",
          icon: require("./../../assets/tabbar/content-dao-icon-click@2x.png"),
          url: "/dao",
          type: "1",
        },
        {
          name: "link05",
          icon: require("./../../assets/tabbar/content-shenji-icon-click@2x.png"),
          url: "https://www.baidu.com/",
          type: "2",
        },
        {
          name: "link06",
          icon: require("./../../assets/tabbar/content-whitepaper-icon-click@2x.png"),
          url: "",
          type: "2",
        },
        {
          name: "link07",
          icon: require("./../../assets/tabbar/content-guthub-icon-click@2x.png"),
          url: "https://www.baidu.com/",
          type: "2",
        },
        {
          name: "link08",
          icon: require("./../../assets/tabbar/content-switchover-icon-click@2x.png"),
          url: "",
          type: "3",
          finally: "1",
        },
      ],
      useraddress:'',
    };
  },
  computed: {
    ...mapGetters(['userName']),
  },
  mounted() {
    if (typeof window.ethereum !== 'undefined') {
      console.log(ethereum.selectedAddress);
      ethereum.selectedAddress && store.dispatch('setUserName', ethereum.selectedAddress)
      this.useraddress = ethereum.selectedAddress
    }

  },
  watch: {
      userName(v,n){
        if (v != n) {
          this.useraddress = v
        }
      }
  },

  methods: {
    FormatAddr(text){
      return formatAddr(text)
    },
    // 连接钱包弹窗
    async connectWallet(){
      console.log("=====>>>连接钱包");
      if (this.userName) {
        return
      }
      if (typeof window.ethereum !== 'undefined') {
          let addr = await ethereum.request({ method: 'eth_requestAccounts' });//授权连接钱包
          store.dispatch('setUserName', addr[0])
          console.log('用户钱包地址:',addr[0]);
      }else{
          console.log('未安装钱包插件！');
      }
      
      // ethereum.enable().then(function (accounts) {
      //   location.reload();
      // }).catch(err => {
      //     console.log(err)
      // });
    },

    // 菜单栏图标点击事件
    menuBarShow(){
      console.log("=====>>>显示隐藏菜单栏");
      // this.visible = !this.visible
    },
    // 菜单点击事件
    menuEvent(item, data = ''){
      console.log("菜单点击事件====>>>", item);
      if(item.type == "1"){
        // 路由跳转
        const newUrl = item.url
        const oldUrl = this.$route.path
        if(newUrl !== oldUrl){
          this.$router.push({path: newUrl})
          this.menuBarShow()
        }
        
      } else if(item.type == "2"){
        // 链接跳转
        this.OpenLink(item.url)
        this.menuBarShow()
      }else{
        // 语言切换
        this.triggerlanguage()
      }
    },
    triggerlanguage(){
        console.log(this.$i18n.locale );
      if (this.$i18n.locale == 'zh-CN') {
        this.$i18n.locale = 'en-US'
      }else{
        this.$i18n.locale = 'zh-CN'
      }
      console.log('this.$i18n.locale =>',this.$i18n.locale);
      localStorage.setItem('language',this.$i18n.locale)
    },
    OpenLink(url) {
      if (url) {
          window.open(url, "_blank");
      } else {
          this.$toast("Coming Soon");
      }
    },
  },
  beforeDestroy() {
    console.log("卸载页面");
    clearTimeout(this.timer);
    this.timer = null;
  },
};
</script>

<style lang="scss" scoped>
// @deep:~'>>>';
// /deep/.el-popover{
//   .myPopover{
//     .menuBar_item{
//       display: flex;
//       .i_icon{
//         width: 60px !important;
//         height: 60px !important;
//         >img{
//           width: 100% !important;
//         }
//       }
//       .i_name{
        
//       }
//     }
//   }
// }
.mainBox{
  // position: relative;
  // width: 100vw;
  display: flex;
  flex-direction: column;
  .headBar{
    background-color: #292146;
    height: 100px;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    // position: absolute;
    // top: 0;
    // left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 40px;
    .headLeft{
      display: flex;
      align-items: center;
      .logo{
        width: 60px;
        height: 60px;
        margin-right: 10px;
        >img{
          width: 100%;
        }
      }
      .name{
        font-size: 24px;
        color: #EBEBEB;
        font-weight: Regular;
        font-family: Arial-Regular;
      }
    }
    
    .headRight{
      display: flex;
      align-items: center;
      .connectWallet{
        margin-right: 20px;
        background-color: #8e2efc;
        padding: 10px 20px;
        color: #fff;
        line-height: 40px;
        font-size: 24px;
        border-radius: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        .wallet{
          width: 34px;
          height: 34px;
          margin-left: 10px;
        }
      }
      .useraddress{
        background-color: #151515;
      }
      .menuBarBox{
        
          .menuBarBtn{
            width: 30px;
            height: 30px;
            >img{
              width: 100%;
            }
        }
          .menuBar_item{
            font-size: 24px;
          }
        
      }
    }
  }
  .Content{
    // flex: 1;
    // height: 2000px;
    height: 100%;
    min-height: 100vh;
    background-color: #1f1b23;
    &::-webkit-scrollbar{
      width: 0px;
    }
  }
  .bottomBar{

  }
}

</style>
