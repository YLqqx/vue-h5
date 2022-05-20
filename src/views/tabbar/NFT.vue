<template>
    <div class="nftPage">
        <div class="nftTitleBox">
            <div class="nftTitle">
                <img v-if="$i18n.locale == 'zh-CN'" src="./../../assets/nft/content-nft-zh.png" alt="">
                <img v-else src="./../../assets/nft/content-nft-us.png" alt="">
            </div>
        </div>
        <div class="nftContent">
            <div class="nft_item bg_img" @click="nft" v-for="(item,index) in nftData" :key="index"> 
                <div class="itme_img">
                    <img :src="item.img" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Swapdemo1Menu',

    components: {  },

    directives: {  },

    data() {
        return {
            nftData: [
                {
                   img: require("./../../assets/nft/nft-img1-skating-defalt@2x.png") ,
                },
                {
                   img: require("./../../assets/nft/nft-img2-skating-defalt@2x.png") ,
                },
                {
                   img: require("./../../assets/nft/nft-img3-skating-defalt@2x.png") ,
                },
                {
                   img: require("./../../assets/nft/nft-img4-skating-defalt@2x.png") ,
                },
                {
                   img: require("./../../assets/nft/nft-img5-skating-defalt@2x.png") ,
                },
                {
                   img: require("./../../assets/nft/nft-img6-skating-defalt@2x.png") ,
                },
                
            ]
        };
    },

    mounted() {
        
    },

    methods: {
        nft(){
            console.log("=====>>>nft");
        },
    },
};
</script>

<style lang="scss" scoped>
    .nftPage{
        background-color: #1f1b23;
        // height: 100%;
        padding: 120px 40px 150px;
        .nftTitleBox{
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 0px 30px;
            .nftTitle{
                width: 248px;
                height: 72px;
                >img{
                    width: 100%;
                }
            }
        }
        .nftContent{
            display: flex;
            flex-wrap: wrap;
            padding-bottom: 30px;
            margin-top: 30px;
            // background-color: #1f1b23;
            .nft_item{
                width: 320px;
                height: 320px;
                background-image: url("./../../assets/nft/nft-card-skating1-defalt@2x.png");
                display: flex;
                justify-content: center;
                align-items: center;
                .itme_img{
                    width: 192px;
                    height: 192px;
                    >img{
                        width: 100%;
                    }
                }
            }
        }
    }
</style>