<template>
    <div class="tabbar">
        <van-tabbar v-model="active" route>
            <van-tabbar-item :to="item.path" v-for="(item ,index) in tablist"  :key="index">
                <!-- <span>{{$t(`tabbar.${item.title}`)}}</span> -->
                <span class="i18n">{{ $t(`tabbar.${item.title}`) }}</span>
                <template #icon="props" class="img_box">
                    <img :src="props.active ? item.icon.active : item.icon.inactive" :class="props.active ? 'active' : ''" />
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
    name: 'Swapdemo1Tabbar',

    data() {
        return {
            active: 0,
            tablist:[
                {
                    // title:'tabbar01',
                    title:'tabbar01',
                    path:'/home',
                    icon: {
                        inactive: require('@/assets/tabbar/tab-home-icon-click@2x.png') ,
                        active: require('@/assets/tabbar/tab-home-icon-select@2x.png'),
                    },
                },
                {
                    // title:'tabbar02',
                    title:'tabbar02',
                    path:'/pledge',
                    icon: {
                        inactive: require('@/assets/tabbar/tab-icon-zhiya-click@2x.png') ,
                        active: require('@/assets/tabbar/tab-icon-zhiya-click@2x.png'),
                    },
                },
                {
                    // title:'tabbar03',
                    title:'tabbar03',
                    path:'/nft',
                    icon: {
                        inactive: require('@/assets/tabbar/tab-icon-nft-click@2x.png') ,
                        active: require('@/assets/tabbar/tab-icon-nft-select@2x.png'),
                    },
                },
                
                {
                    title:'tabbar04',
                    path:'/dao',
                    icon: {
                        inactive: require('@/assets/tabbar/tab-icon-dao-click@2x.png') ,
                        active: require('@/assets/tabbar/tab-icon-dao-select@2x.png'),
                    },
                },
            ]
        };
    },

    methods: {
        openlink(url){
            window.open(url)
        }
    },
};
</script>

<style lang="less" scoped>
.tabbar{
    z-index: 999;
    /deep/ .van-hairline--top-bottom{
        background-color: #292146;
        padding: 40px 0px;
        &::after{
            border: 0px solid #292146;
        }
        .van-tabbar-item{
            color: #F8EEFF;
            font-size: 24px;
            background-color: transparent;
            .van-tabbar-item__icon{
                margin-bottom: 10px;
                >img{
                    width: 52px;
                    height: 52px;
                }
            }
        }
        .van-tabbar-item--active{
            color: #A150FD;
            .van-tabbar-item__icon{
                >img{
                    width: 52px;
                    height: 52px;
                }
            }
        }
    }
    // .img_box{
    //     width: 52px;
    //     height: 52px;
    //     >img{
    //         width: 100%;
    //     }
    // }
    // /deep/ .van-tabbar-item{
    //     color: #F8EEFF;
    //     .active{
    //         position: absolute;
    //         height: 20px;
    //         left: 50%;
    //         top: -50%;
    //         transform: translateX(-50%) translateY(-25%);
    //         box-shadow: 0px 5px 18px -2px #d943ef;
    //         border-radius: 50px;
    //         z-index: 10;
    //         .van-tabbar-item__text{
    //             >span{
    //                 color: #F8EEFF;
    //             }
    //         }
    //         .van-tabbar-item__icon{
    //             position: relative;
    //             display: flex;
    //             justify-content: center;
    //             height: 52px;
    //             width: 100%;
    //             >img{
    //                 height: 52px;
    //                 width: 52px;
    //             }
    //         }
    //     }
    // }
    // /deep/ .van-tabbar-item--active{
    //     background-color: transparent;
    //     color: #A150FD;
    //     position: absolute;
    //     .van-tabbar-item__icon{
    //         position: relative;
    //         left: 50%;
    //         top: -50%;
    //         transform: translateX(-50%) translateY(-25%);
    //         height: 52px;
    //         width: 100%;
    //         display: flex;
    //         justify-content: center;
    //         >img{
    //             width: 52px;
    //             height: 52px;
    //         }
    //     }
    // }
}

 

</style>