<template>
  <div class="pledge bg_img">
    <div class="pledge_box">
      <div class="pledge_head bg_img">
        <div>TVL</div>
        <div>${{integer(PoolData.tvl)}}</div>
      </div>
      <div class="pledge_content bg_img">
        <div class="pledge_icon">
          <div class="img_box dsp_f jc_c">
            <img class="img smc_icon" src="./../../assets/pledge/smc-icon.png" alt="">
            <img class="img bnb_icon" src="./../../assets/pledge/bnb-icon.png" alt="">
          </div>
          <div class="icon_name">SMC/BNB</div>
        </div>
        <div class="rows">
          <div class="row dsp_f jc_sb">
            <div class="head_name i18n">{{$t('lppool.lppool01')}}</div>
            <div class="head_val" >{{FormatNum(PoolData.apy,2,2)}}%</div>
          </div>
          <div class="row dsp_f jc_sb">
            <div class="head_name i18n">{{$t('lppool.lppool02')}}</div>
            <div class="head_val">{{FormatNum(PoolData.dayapy,2,2)}}%</div>
          </div>
          <div class="row dsp_f jc_sb">
            <div class="head_name i18n">{{$t('lppool.lppool03')}}</div>
            <div class="head_val">{{PoolData.per_day}} SMC</div>
          </div>
          <div class="row dsp_f jc_sb">
            <div class="head_name i18n">{{$t('lppool.lppool04')}}</div>
            <div class="head_val">${{FormatNum(PoolData.tvl)}}</div>
          </div>
          <div class="row dsp_f jc_sb">
            <div class="head_name i18n">{{$t('lppool.lppool05')}}</div>
            <div class="head_val">{{FormatNum(getpledgedata.LoopbalanceOf)}} LP</div>
          </div>
          <div class="row dsp_f jc_sb">
            <div class="head_name i18n">{{$t('lppool.lppool06')}}</div>
            <div class="head_val">{{FormatNum(getpledgedata.pairbalanceOf)}} LP</div>
          </div>
          <div class="row dsp_f jc_sb">
            <div class="head_name i18n">{{$t('lppool.lppool07')}}</div>
            <div class="head_val">{{FormatNum(getpledgedata.earned,2,4)}} SMC</div>
          </div>
          <div class="itme_text i18n">{{$t('lppool.lppool08')}}{{settime(getpledgedata.userStartTime)}}</div>
          <div v-if="isApprove">
            <div class="btns dsp_f jc_sb">
            <el-button :loading="isGetPoolloading" class="btn get_btn disabledopacity i18n" @click="GetstakedLpOutPool()">{{$t('lppool.lppool09')}}</el-button>
            <el-button :loading="isstakedloading" class="btn set_btn disabledopacity i18n" @click="stakedtrigger()">{{$t('lppool.lppool10')}}</el-button>
          </div>
          <el-button :loading="isGetRewardloading" :disabled="!getpledgedata.canGetReward || getpledgedata.earned <= 0" class="receiveaward disabledopacity i18n" @click="GetReward()">{{$t('lppool.lppool11')}}</el-button>
          <el-button class="receiveaward packbtn i18n" @click="OpenLink('http://183.6.115.185:3000/#/add/ETH/0x5fe4b862FCc043DfE5971D411815ed3C971146b6')">{{$t('lppool.lppool12')}}</el-button>
          </div>
          <div v-else>
            <el-button :loading="isapproveFnloading" class="receiveaward i18n" @click="approveFn()" >{{$t('lppool.lppool17')}}</el-button>
          </div>
          
        </div>
      </div>
      
    </div>
    <van-popup class="stakepopup" v-model="stakepopup">
      <div class="title i18n">{{$t('lppool.lppool13')}}</div>
      <div class="inp_box dsp_f jc_sb">
        <input v-model="inputValue" placeholder="0" class="inp" type="text" />
        <div class="btn_max i18n" @click="MaxBtn()">{{$t('lppool.lppool14')}}</div>
      </div>
      <div class="hint dsp_f i18n" v-if="Number(getpledgedata.pairbalanceOf) < Number(inputValue)">
        <van-icon class="icon" name="warning-o" />{{$t('lppool.lppool18')}}
      </div>
      <div class="che_box dsp_f jc_sb">
        <div>{{$t('lppool.lppool15')}}:{{ FormatNum(getpledgedata.pairbalanceOf) }}</div>
      </div>
      <div class="btns dsp_f jc_sb">
        <!-- <div class="btn" @click="stakedtrigger()">取消</div> -->
        <el-button :loading="isstakedloading" class="btn config i18n" @click="SetstakedLpToPool()">{{$t('lppool.lppool16')}}</el-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Data from "./../../utils/data"
import API from "./../../api/smc-bnb";
import { formdate,formatNum } from "../../utils/tool";
export default {
  name: 'StakingFrontendProjectPledge',

  data() {
    return {
      PoolData:{
        'apy':'0.00%',
        'per_year':0,
        'dayapy':0,
        "per_day":0,
        'tvl':0,
      },
      getpledgedata:{
        'canGetReward':0,
        'userStartTime':0,
        'LoopbalanceOf':0,
        'pairbalanceOf':0,
        'earned':0,
      },
      stakedLp:'',
      isApprove:false,
      //
      stakepopup:false,//质押弹窗
      inputValue:0,//质押数量
      isextract:false,//是否可以领取
      PairTotalSupply:0,
      drawtime:'-',//领取时间
      isGetPoolloading:false,//loading
      isstakedloading:false,//
      isGetRewardloading:false,
      isapproveFnloading:false,
      timer:'',
    };
  },

  mounted() {
    this.info()
    this.getdata()
    this.getApprove()
    this.timerdata()
  },

  methods: {
    timerdata(){
      this.timer = null
      this.timer = setTimeout(() => {
        this.getdata()
        this.info()
        this.timerdata()
      }, 10000);
    },
    FormatNum(num,min = 2,max = 6){
      return formatNum(num,min,max)
    },
    integer(num){
      return Math.floor(num)
    },
    // 质押点击最大
    MaxBtn() {
      this.inputValue = this.getpledgedata.pairbalanceOf;
    },
    // 质押弹窗
    stakedtrigger() {
      this.inputValue = ''
      this.stakepopup = !this.stakepopup;
    },
    info(){
      Data.getPoolListData().then(res => {
          this.PoolData = res.flat[0]
      })

    },
    OpenLink(url) {
        if (url) {
            window.open(url, "_blank");
        } else {
            this.$toast("Coming Soon");
        }
    },
    // 授权
    approveFn() {
      this.isapproveFnloading = true
      API.approve()
        .then(res => {
          this.getApprove()
        })
        .catch(error => {
          console.error(error)
        }).finally( () => {
          this.isapproveFnloading = false
        })
    },
    // 质押
    SetstakedLpToPool() {
      if (!this.inputValue) {
        return
      }
      this.isstakedloading = true
      API.stakedLpToPool(this.inputValue).then(res => {
        this.getdata()
        this.info()
      }).finally( () => {
        this.stakepopup = false
          this.isstakedloading = false
        })
    },
    // 取回流动性
    GetstakedLpOutPool() {
      if (this.getpledgedata.LoopbalanceOf <= 0) {
        this.$toast(this.$t('publics.publics03'))
        return
      }
      this.isGetPoolloading = true
      API.stakedLpOutPool().then(res => {
        this.getdata()
        this.info()
      }).finally( () => {
          this.isGetPoolloading = false
        })
    },
    // 领取收益
    GetReward() {
      if (this.getpledgedata.earned <= 0) {
        this.$toast(this.$t('publics.publics06'))
        return
      }
      if (!this.getpledgedata.canGetReward) {
        this.$toast(this.$t('publics.publics02'))
        return
      }
      this.isGetRewardloading = true
      API.getReward()
        .then(res => {
          this.getdata()
          this.info()
        })
        .catch(error => {
          console.error(error)
        }).finally( () => {
          this.isGetRewardloading = false
        })
    },
    getApprove(){
      API.isApprove().then(res => {
        this.isApprove = res
      })
    },
    //用户质押开始时间
    settime(res){
      const that = this
      return res != 0 ? formdate(res * 1000 + 600000,'YYYY/MM/DD hh:mm:ss') : this.$t('lppool.lppool06')
    },
    getdata() {
      const that = this
      API.getpledgedata().then( res => {
        this.getpledgedata = res
      })
      
    }
  },
  beforeDestroy() {
    console.log("卸载页面");
    clearTimeout(this.timer);
    this.timer = null;
  },
};
</script>

<style lang="less" scoped>
.disabledopacity[disabled]{
  opacity: 0.5;
}
.van-checkbox__icon .van-icon{
  border: 2px solid #240f74;
}
.van-checkbox__icon--checked .van-icon{
  background-color: #45318f;
  color: #240f74;
  border-color: #240f74;
}
.van-checkbox__icon--disabled .van-icon{
  background-color: #2d2355;

}
.van-checkbox__icon--disabled.van-checkbox__icon--checked .van-icon{
  background-color: #2d2355;
  color: #848585;
}
.stakepopup {
  padding: 10px;
  border-radius: 20px;
  width: 86%;
  font-size: 16px;
  padding: 40px 40px 31px;
  background-color: #45318f;
  .title {
    color: #fff;
    text-align: center;
    font-size: 36px !important;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #F2F2F2;
    line-height: 42px;
  }
  .balance {
    padding: 8px 0;
    color: #000;
  }
  .switchs {
    display: flex;
    align-items: center;
    color: #000;
    padding: 10px 0;
  }
  .che_box{
    font-size: 24px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #F2F2F2 !important;
    line-height: 42px;
    .checkbox{
      >span{
        margin-left: 5px;
      }
    }
  }
  .inp_box {
    padding: 5px 10px 4px;
    background-color: #240f74;
    border-radius: 4px;
    margin: 32px 0 16px;
    color: #fff;
    .inp {
      border: none;
      width: 80%;
      background-color: transparent;
    }
    .btn_max {
      padding: 4px 10px;
      background-color: #45318f;
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .hint{
    text-align: right;
    justify-content: flex-end;
    font-size: 24px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #FF4843;
    line-height: 42px;
    .icon{
      margin-right: 5px;
    }
  }
  .btns {
    margin: 20px 0;
    .btn {
      width: 40%;
      border-radius: 10px;
      font-size: 15px;
      text-align: center;
      padding: 18px 0;
      color: #fff;
      margin: 0 auto;
      line-height: 42px;
      border: none;
    }
    .config {
      background-image: linear-gradient(to right,#cf2fff,#861dff);
      color: #fff;
    }
  }
}
.pledge{
  background-image: url("./../../assets/pledge/bg@2x.png");
  padding-top: 140px;
  padding-bottom: 150px;
  height: 100vh;
  overflow-y: scroll;
  .pledge_box{
    background-color: #575cef;
    padding: 24px;
    border-radius: 20px;
    width: 90%;
    margin: 0 auto;
    .pledge_head{
      text-align: center;
      padding: 40px 0;
      width: 100%;
      background-image: url("./../../assets/pledge/content-card1-defalt@2x.png");
      >div{
        font-size: 36px;
        font-family: Arial-Bold, Arial;
        font-weight: bold;
        color: #F2F2F2;
        line-height: 42px;
      }
    }
    .pledge_content{
      background-image: url("./../../assets/pledge/content-card2-defalt@2x.png");
      color: #CACACA;
      padding: 23px 16px;
      margin-top: 15px;
      border-radius: 20px;
      .pledge_icon{
        border-bottom: 1px solid #5D48AC;
        padding: 24px 0 24px;
        .img_box{
          // width: 150px;
          // height: 88px;
          margin: 0 auto;
          .img{
            width: 88px;
            height: 88px;
          }
          .smc_icon{
            transform: translateX(10px);
            z-index: 10;
          }
          .bnb_icon{
            transform: translateX(-10px);
          }
        }
        .icon_name{
          font-size: 32px;
          font-family: Arial-Regular, Arial;
          font-weight: 400;
          color: #F2F2F2;
          line-height: 42px;
          text-align: center;
          margin-top: 16px;
        }
      }
      .rows{
        .row{
          padding: 7px 0;
          .head_name{
font-size: 26px;
font-family: PingFang SC-Regular, PingFang SC;
font-weight: 400;
color: #CACACA;
line-height: 42px;
          }
          .head_val{
font-size: 32px;
font-family: Arial-Bold, Arial;
font-weight: bold;
color: #F2F2F2;
line-height: 42px;
          }
        }
        .itme_text{
          padding: 32px 0 50px; 
        }
        .btns {
            margin: 20px 0;
            .btn {
              width: 48%;
              border-radius: 10px;
              font-size: 32px;
              text-align: center;
              padding: 18px 0;
              color: #fff;
              border: none;
              line-height: 42px;
            }
            .get_btn{
              background-color: #342c4d;
              border: 2px solid #8E2EFC;
            }
            .set_btn {
              background-color: #d725eb;
              padding: 20px 0;
              color: #fff;
            }
          }
          .receiveaward{
            background-image: linear-gradient(to right,#ce41c2,#861dff);
            padding: 24px 0;
            text-align: center;
            font-size: 32px;
            border-radius: 10px;
            width: 100%;
            color: #fff;
            border: none;
            line-height: 42px;
          }
          .packbtn{
            margin-left: 0;
            padding: 22px 0;
            margin-top: 20px;
            background-image: none;
            background-color: #312764;
            border: 2px solid #BE84FF;
          }

      }
    }
  }
}
</style>
