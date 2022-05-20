<!-- home -->
<template>
  <div class="about-container">
    <div class="title i18n">{{$t('dao.dao01')}}</div>
    <div class="title">{{FormatNums(alltotalSupply,2,4)}} SMC</div>
    <div class="head_bg_box">
      <div class="head_bg">
        <img class="img" src="./../../assets/dao/head_bg.png" alt="">
      </div>
    </div>
    
    <div class="item" v-for="(item, index) in DAOdata" :key="index">
      <div class="item_bg bg_img">
        <img class="img" src="./../../assets/dao/card_bg.png" alt="">
      </div>
      <div class="title">SMC DAO {{ item.type }}</div>
      <div class="box">
        <div class="row dsp_f jc_sb">
          <div class="row-col">
            <div class="item_name i18n">{{$t('dao.dao02')}}</div>
            <div class="item_v">{{FormatNums(item.totalSupply)}}</div>
          </div>
          <div class="row-col">
            <div class="item_name i18n">{{$t('dao.dao03')}}</div>
            <div class="item_v">{{FormatNums(item.balanceOf)}}</div>
          </div>
        </div>
        <div class="row dsp_f jc_sb">
          <div class="row-col">
            <div class="item_name i18n">{{$t('dao.dao04')}}</div>
            <div class="item_v">{{ setbignumber(item.apy) }}%</div>
          </div>
          <div class="row-col">
            <div class="item_name i18n">{{$t('dao.dao05')}}</div>
            <div class="item_v">{{setbignumber(item.doubleapy)}}%</div>
          </div>
        </div>
        <div class="row dsp_f jc_sb">
          <div class="row-col">
            <div class="item_name i18n">{{$t('dao.dao06')}}</div>
            <div class="item_v">{{ FormatNums(userbalance) }}</div>
          </div>
          <div class="row-col">
            <div class="item_name i18n">{{$t('dao.dao07')}}</div>
            <div class="item_v">{{FormatNums(item.earnings)}}</div>
          </div>
        </div>
        <div class="row endtime i18n">
          <!-- 结束时间:2022/5/30 12:12:12(每次操作自动续24小时) -->
          {{$t('dao.dao08')}}: {{TimeUnlock(item.expirationtime)}}<span v-if="item.expirationtime">({{item.isAutoDeposits ? `${$t('dao.dao10')}`:`${$t('dao.dao09')}`}})</span> 
        </div>
      </div>
      <div class="btns dsp_f jc_sa" v-if="item.isallowance > 0">
        <el-button :disabled ="!item.canWithdraw || item.balanceOf <= 0" :loading="item.isGetwithdraw" class="btn btn_l i18n" @click="Getwithdraw(item)">{{$t('dao.dao12')}}</el-button>
        <el-button :loading="item.isbuylock" class="btn btn_r i18n" @click="stakedtrigger(item)">{{$t('dao.dao13')}}</el-button>
      </div>
      <div class="btns" v-else>
        <el-button :loading="item.isBuyapprove" class="btn approve i18n" @click="Buyapprove(item)">{{$t('dao.dao19')}}</el-button>
      </div>
    </div>
    <van-popup class="stakepopup" v-model="stakepopup">
      <div class="title i18n">{{$t('dao.dao14')}}</div>
      <div class="inp_box dsp_f jc_sb">
        <input v-model="inputValue" placeholder="0" class="inp" type="number" />
        <div class="btn_max i18n" @click="MaxBtn()">{{$t('dao.dao15')}}</div>
      </div>
      <div class="hint dsp_f" v-if="Number(userbalance) < Number(inputValue)">
        <van-icon class="icon i18n" name="warning-o" />{{$t('dao.dao20')}}
      </div>
      <div class="che_box dsp_f jc_sb">
        <div class="checkbox dsp_f">
          <van-checkbox v-model="checked" class="i18n" :disabled="selectdao.balanceOf > 0" icon-size="24px" checked-color="2f1396" shape="square"></van-checkbox><span>{{$t('dao.dao16')}}</span>
        </div>
        <div class="i18n">{{$t('dao.dao17')}}:{{ FormatNums(userbalance) }}</div>
      </div>
      <div class="btns dsp_f jc_sb">
        <el-button :loading="selectdao.isbuylock" class="btn config i18n" @click="buylock()">{{$t('dao.dao18')}}</el-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 请求接口
import { mapGetters } from "vuex";
import API from "./../../api/smc-bnb";
import { scientificNotationToString ,formatNum} from "../../utils/tool";
export default {
  data() {
    return {
      inputValue:'', //质押输入框
      stakepopup: false, //质押弹窗
      userbalance: 0, //可用余额
      checked: false,
      isapprove: false, //是否授权
      getlockTime: 0,
      apy: 0,
      doubleapy: 0,
      DAOdata: [
        {
          'apy':'0.00%',
          'balanceOf':0,
          'doubleapy':'0.00%',
          'earnings':'0',
          'expirationtime':'0',
          'isAutoDeposits':false,
          'isBuyapprove':false,
          'isGetwithdraw':false,
          'isallowance':0,
          'isbuylock':false,
          'lockBlocks':'0',
          'lockTime':'0',
          'period':'0',
          'rewardRatio':'0',
          'totalSupply':'0',
          'type':'1',
          'canWithdraw':false,
        },
        {
          'apy':'0.00%',
          'balanceOf':0,
          'doubleapy':'0.00%',
          'earnings':'0',
          'expirationtime':'0',
          'isAutoDeposits':false,
          'isBuyapprove':false,
          'isGetwithdraw':false,
          'isallowance':0,
          'isbuylock':false,
          'lockBlocks':'0',
          'lockTime':'0',
          'period':'0',
          'rewardRatio':'0',
          'totalSupply':'0',
          'type':'7',
          'canWithdraw':false,
        },
        {
          'apy':'0.00%',
          'balanceOf':0,
          'doubleapy':'0.00%',
          'earnings':'0',
          'expirationtime':'0',
          'isAutoDeposits':false,
          'isBuyapprove':false,
          'isGetwithdraw':false,
          'isallowance':0,
          'isbuylock':false,
          'lockBlocks':'0',
          'lockTime':'0',
          'period':'0',
          'rewardRatio':'0',
          'totalSupply':'0',
          'type':'15',
          'canWithdraw':false,
        },
        {
          'apy':'0.00%',
          'balanceOf':0,
          'doubleapy':'0.00%',
          'earnings':'0',
          'expirationtime':'0',
          'isAutoDeposits':false,
          'isBuyapprove':false,
          'isGetwithdraw':false,
          'isallowance':0,
          'isbuylock':false,
          'lockBlocks':'0',
          'lockTime':'0',
          'period':'0',
          'rewardRatio':'0',
          'totalSupply':'0',
          'type':'30',
          'canWithdraw':false,
        },
      ],
      selectdao:{},
      alltotalSupply:0,//总质押数量
      timer:'',
    };
  },
  computed: {
    ...mapGetters(["userName"]),
  },
  mounted() {
    this.getdata();
    this.timerdata()
  },
  methods: {
    timerdata(){
        this.timer = null
        this.timer = setTimeout(() => {
            this.getdata()
            this.timerdata()
        }, 10000);
    },
    FormatNums(num,min = 2, max = 6){
      return formatNum(num,min,max)
    },
    //格式化bignumber
    setbignumber(num){
      return formatNum(scientificNotationToString(num),2,2)
    },
    // 质押点击最大
    MaxBtn() {
      this.inputValue = this.userbalance;
    },
    // 质押弹窗
    stakedtrigger(item) {
      this.selectdao = item
      this.$nextTick(function () {
        this.checked = item.isAutoDeposits
      });
      this.inputValue = ''
      this.checked = false
      this.stakepopup = !this.stakepopup;
    },
    //授权
    Buyapprove(item) {
      let that = this
      item.isBuyapprove = true
      API.Buyapprove(item.type).then((res) => {
        item.isBuyapprove = false
        that.getdata()
      }).catch( err => {
        item.isBuyapprove = false
        console.error(err);
      });
    },
    //质押
    buylock() {
      if (!this.inputValue){
        this.$toast(this.$t('publics.publics04'))
        return;
      }
      if (Number(this.userbalance) < Number(this.inputValue)) {
        this.$toast(this.$t('publics.publics05'))
        return
      }
      
      // else{
        let that = this
        this.selectdao.isbuylock = true
        API.setdeposit(this.selectdao.type,this.inputValue, this.checked).then((res) => {
          that.selectdao.isbuylock = false
          that.stakepopup = false
          that.getdata()
        }).catch( err =>{
          that.selectdao.isbuylock = false
          console.error(err);
        });
      // }
      
    },
    //提取
    Getwithdraw(item) {
      let that = this
      if (item.balanceOf <= 0) {
        this.$toast(this.$t('publics.publics03'))
        return
      }
      if (!item.canWithdraw) {
        this.$toast(this.$t('publics.publics02'))
        return
      }

      item.isGetwithdraw = true
      API.Getwithdraw(item.type).then((res) => {
        item.isGetwithdraw = false
        that.getdata()
      }).catch(err => {
        item.isGetwithdraw = false
        console.error(err);
      })
    },
    //获取数据
    getdata() {
      //
      API.GetAllDao().then((res) => {
        this.DAOdata = res;
        this.alltotalSupply = 0
        res.filter( item => {
          this.alltotalSupply += Number(item.totalSupply)
        })
      });
      //查询用户余额
      API.getWalletAllToken().then((res) => {
        this.userbalance = res;
      });
    },
    TimeUnlock(time) {
      if (time) {
        return this.formattingDate(Number(time));
      }else{
        return this.$t('publics.publics03')
      }
      
    },
    add0(sum) {
      return sum >= 10 ? sum : `0${sum}`;
    },
    formattingDate(getdate) {
      let date = new Date(getdate);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      let newdate = `${year}/${this.add0(month)}/${this.add0(day)} ${this.add0(
        hours
      )}:${this.add0(minutes)}:${this.add0(seconds)}`;
      return newdate;
    },
  },
  beforeDestroy() {
      console.log("卸载页面");
      this.timer && clearTimeout(this.timer);
      this.timer = null;
  },
};
</script>
<style lang="less">
button {
  background-color: transparent;
  border: none;
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
    // .van-switch{
    //   height: 20px;
    //   .van-switch__node{
    //     height: 20px;
    //     width: 20px;
    //   }
    // }
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
      border: none;
    }
    .config {
      background-image: linear-gradient(to right,#cf2fff,#861dff);
      color: #fff;

    }
  }
}
.about-container::-webkit-scrollbar{
    width: 0px !important;
  }
.about-container {
  color: #fff;
  box-sizing: border-box;
  background-color: #201a24;
  padding: 140px 40px 150px;
  position: relative;
  .title {
    font-size: 55px;
    padding: 12px 0;
    position: relative;
    z-index: 50;
  }
  .head_bg_box{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .head_bg{
      // position: absolute;
      // top: 0;
      // left: 0;
      position: sticky;
      top: 0;
      width: 100%;
      height: 758px;
    }
  }
  
  .item {
    background-color: #14223d;
    width: 100%;
    margin: 20px auto;
    border-radius: 40px;
    padding: 40px;
    position: relative;
    z-index: 50;
    opacity: 0.98;
    .item_bg{
      
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      // background-image: url("./../../assets/dao/card_bg.png");
      // opacity: 0.8;
      z-index: 10;
      .img{
        -webkit-filter:blur(1);
        filter: blur(1);
      }
    }
    .title {
      padding: 10px 0 40px;
      text-align: center;
      font-size: 36px;
      font-family: Arial-Regular, Arial;
      font-weight: 400;
      color: #f2f2f2;
      position: relative;
      z-index: 50;
    }
    .box {
      position: relative;
      z-index: 50;
      .row {
        padding: 5px 0;
        .row-col {
          flex: 1;
          .item_name {
            font-size: 26px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #cacaca;
            line-height: 42px;
          }
          .item_v {
            font-size: 32px;
            font-family: Arial-Bold, Arial;
            font-weight: bold;
            color: #f2f2f2;
            line-height: 42px;
          }
        }
      }
      .endtime {
        font-size: 24px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #cacaca;
        line-height: 42px;
        padding: 20px 0 36px;
      }
    }
    .btns {
      position: relative;
      z-index: 50;
      .btn {
        width: 46%;
        display: inline-block;
        text-align: center;
        border: 1px solid #14223d;
        border-radius: 10px;
        margin: 5px 0;
        padding: 18px 0;
        font-size: 32px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #f2f2f2;
        line-height: 42px;
        cursor: pointer;
      }
      .btn_l {
        border: 2px solid #8e2efc;
        background-color: #342c4d;
      }
      .btn_r {
        background-image: linear-gradient(to right, #cb34f7, #861dff);
        padding: 20px 0;
      }
      .approve{
        width: 100%;
        background-image: linear-gradient(to right, #cb34f7, #861dff);
      }
    }
  }
}
</style>
