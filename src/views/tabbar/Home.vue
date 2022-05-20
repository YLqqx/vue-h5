<template>
    <div class="homePage">
        <div class="homeBag bg_img">
            <div class="homeBagBox">
                <div class="pledgeTotal">
                    <div class="tvlNum">
                        <div class="tvlNumTitle">TVL</div>
                        <div class="tvlNumValue">$ {{integer(Alldata.tvl)}}</div>
                    </div>
                    <div class="daoNum">
                        <div class="daoNumTitle i18n">{{$t('home.home01')}}</div>
                        <div class="daoNumValue">{{integer(Alldata.AlldaototalSupply)}} SMC</div>
                    </div>
                </div>
            </div>
        </div>
    <div class="homeInfo">
        <div class="info">
            <div class="info_row">
                <div class="infoTitle i18n">{{$t('home.home02')}}</div>
                <div class="infoValue">$ {{integer(Alldata.marketvalue)}}</div>
            </div>
            <div class="info_row">
                <div class="infoTitle i18n">{{$t('home.home04')}}</div>
                <div class="infoValue">$ {{FormatNums(Alldata.smcbnbprice)}}</div>
            </div>
        </div>
        <div class="info">
            <div class="info_row">
                <div class="infoTitle i18n">{{$t('home.home03')}}</div>
                <div class="infoValue">{{integer(Alldata.Allsupplys)}}</div>
            </div>
            <div class="info_row">
                <div class="infoTitle i18n">{{$t('home.home05')}}</div>
                <div class="infoValue">{{integer(Alldata.destroy)}}</div>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import Data from "../../utils/data";
import { formatNum } from "../../utils/tool";
export default {
    name: 'FrontendHome',

    components: {  },

    directives: {  },

    data() {
        return {
            AlldaototalSupply:'0.00',
            Alltvl:'0.00',
            Tokenprice:0,
            Alldata:{
                'Allsupplys':0,//SMC 流通量
                'marketvalue':'0.00',//流通市值
                'AlldaototalSupply':'0.00',//总质押
                'destroy':0,//销毁
                'tvl':'0.00',//tvl
                'smcbnbprice':'0.00',//smc-bnb价格
            },
            timer:'',
            timerminute:'',
        };
    },

    mounted() {
        this.getAlltotalSupply()
        this.timerdata()
        this.timerminutedata()
    },

    methods: {
        timerdata(){
            this.timer = null
            this.timer = setTimeout(() => {
                this.gettimertop()
                this.timerdata()
            }, 10000);
        },
        timerminutedata(){
            this.timerminute = null
            this.timerminute = setTimeout(() => {
                this.getAlltotalSupply()
                this.timerminutedata()
            }, 60000);
        },
        //10s 获取
        gettimertop(){
            Data.GetTimerHomedata().then( res => {
                console.log('res => ',res);
                this.Alldata.tvl = res.tvl
                this.Alldata.AlldaototalSupply = res.AlldaototalSupply
            })
        },
        FormatNums(num,min = 2, max = 6){
            return formatNum(num,min,max)
        },
        integer(num){
            return Math.floor(num)
        },
        getAlltotalSupply(){
            Data.GetAllhomedata().then( res => {
                this.Alldata = res
            })
        }
        
    },
    beforeDestroy() {
        console.log("卸载页面");
        this.timer && clearTimeout(this.timer);
        this.timerminute && clearTimeout(this.timerminute);
        this.timer = null;
        this.timerminute = null;
    },
};
</script>

<style lang="scss" scoped>
    .homePage{
        padding-top: 130px;
        padding-bottom: 140px;
        background-color: #1f1b23;
        display: flex;
        // justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100%;
        .homeBag{
            width: 670px;
            height: 708px;
            background-image: url("./../../assets/home/content-banner-defalt@2x.png");
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            border-radius: 30px;
            .homeBagBox{
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                width: 100%;
                height: 120px;
                background-color: rgba(255, 255, 255, 0.37);
                position: relative;
                overflow: hidden;
                background-color: rgba(255, 255, 255, 0.5);
                border-radius: 0px 0px 30px 30px;
                &::after{
                    content:'';
                    position: absolute;
                    // bottom: 0px;
                    bottom: 0;
                    left: 0;
                    background-color: rgba(255, 255, 255, 0.5);
                    background-image: url("./../../assets/home/content-banner-defalt@2x.png");
                    background-position: bottom center;
                    background-size: cover;
                    filter: blur(10vw);
                    transform: scale(1);
                    width: 100%;
                    height: 708px;
                    z-index: 0;
                }
                .pledgeTotal{
                    width: 100%;
                    padding: 20px 34px;
                    border-radius: 0px 0px 30px 30px;
                    display: flex;
                    z-index: 10;
                    .tvlNum{
                        flex: 1;
                        .tvlNumTitle{
                            font-size: 22px;
                            color: #CACACA;
                            font-weight: Regular;
                            font-family: Arial-Regular;
                            margin-bottom: 5px;
                        }
                        .tvlNumValue{
                            font-size: 32px;
                            color: #F2F2F2;
                            font-weight: bold;
                            font-family: Arial-Bold;
                        }
                    }
                    .daoNum{
                        flex: 1;
                        .daoNumTitle{
                            font-size: 24px;
                            color: #CACACA;
                            font-weight: Regular;
                            font-family: Arial-Regular;
                            margin-bottom: 5px;
                        }
                        .daoNumValue{
                            font-size: 32px;
                            color: #F2F2F2;
                            font-weight: bold;
                            font-family: Arial-Bold;
                        }
                    }
                }
            }
            
        }
        .homeInfo{
            margin-top: 20px;
            width: 670px;
            height: 273px;
            border-radius: 30px;
            background: linear-gradient(to top right,#282046, #45318F);
            display: flex;
            padding: 30px 40px;
            .info{
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .info_row{
                    // flex: 1;
                    .infoTitle{
                        font-size: 26px;
                        color: #CACACA;
                        font-weight: Regular;
                        font-family: Arial-Regular;
                        margin-bottom: 15px;
                    }
                    .infoValue{
                        font-size: 32px;
                        color: #F2F2F2;
                        font-weight: bold;
                        font-family: Arial-Bold;
                    }
                }
            }
        }
    }
</style>