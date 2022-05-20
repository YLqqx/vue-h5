import SmcBnb from './../api/smc-bnb'
import BnbUsdt from './../api/bnb-usdt'
import Icon from './icon.js'
import Web3 from "web3";
import BigNumber from 'bignumber.js';

import {
    multiNum,
    addNum
} from './calc'


function getCurrentPool(type) {
    let API, coinInfo
    switch (type) {
        case "SmcBnb":
            API = SmcBnb
            coinInfo = Icon[0]
            break;
        default:
            console.log('error')
    }
    return {
        API,
        coinInfo
    }
}
//定时获取 首页tvl dao总质押
function GetTimerHomedata(){
    return new Promise((resolve, reject) => {
        Promise.all([
            SmcBnb.GetAlltotalSupply(),//dao
            getTokenRate(),//token 价格
            getonePoolListData(),
        ]).then(async res => {
            let item = {
                'AlldaototalSupply':'',//总质押
                'tvl':'',//tvl
            }
            let tokenRate = res[1]//token 价格
            let tvls = res[2]
            item.AlldaototalSupply = new BigNumber(res[0])
            item.tvl = new BigNumber(res[0]).multipliedBy(new BigNumber(tokenRate)).plus(new BigNumber(tvls))
            console.log('home data =>',item);
            resolve(item)
        }).catch( err => {
            reject(err)
        })
    })
}
//首页 获取总流通量
function GetAllhomedata(){
    return new Promise((resolve, reject) => {
        Promise.all([
            SmcBnb.GetmsctotalSupply(),//smc 
            SmcBnb.getsmcbalanceOf('pool'),
            SmcBnb.getsmcbalanceOf(1),
            SmcBnb.getsmcbalanceOf(7),
            SmcBnb.getsmcbalanceOf(15),
            SmcBnb.getsmcbalanceOf(30),
            SmcBnb.getsmcbalanceOf('dead'),
            SmcBnb.GetAlltotalSupply(),//dao
            getTokenRate(),//token 价格
            getonePoolListData(),
        ]).then(async res => {
            let item = {
                'Allsupplys':'',//SMC 流通量
                'marketvalue':'',//流通市值
                'AlldaototalSupply':'',//总质押
                'destroy':'',//销毁
                'tvl':'',//tvl
                'smcbnbprice':'',//smc-bnb价格
            }
            let tokenRate = res[8]//token 价格
            let tvls = res[9]
            let allsupply = new BigNumber(res[0]).div(new BigNumber(10).pow(18)).minus(new BigNumber(res[1])).minus(new BigNumber(res[2])).minus(new BigNumber(res[3])).minus(new BigNumber(res[4])).minus(new BigNumber(res[5])).minus(new BigNumber(res[6])).plus(new BigNumber(res[7]))
            item.Allsupplys = allsupply
            item.marketvalue = allsupply.multipliedBy(new BigNumber(tokenRate))
            item.destroy = res[6]
            item.AlldaototalSupply = new BigNumber(res[7])
            item.smcbnbprice = new BigNumber(tokenRate)
            item.tvl = new BigNumber(res[7]).multipliedBy(new BigNumber(tokenRate)).plus(new BigNumber(tvls))
            console.log('home data =>',item);
            resolve(item)
        }).catch( err => {
            reject(err)
        })
    })
}
//单币对
function getonePoolListData() {
    return new Promise((resolve, reject) => {
        Promise.all([
            SmcBnb.getPoolData(),
            getCoinRate(),
            GetPairTotalSupply(),
        ]).then(async res => {
            let coinRate = res[1]  //  汇率
            let PairTotalSupply = res[2]
            let allBalance = 0
            let tvl,isall = false
            tvl = new BigNumber((((multiNum(res[0].nextcoin, 2)) * 1) * coinRate[1].rate).toFixed(2)).multipliedBy(new BigNumber(res[0].supply)).div(new BigNumber(PairTotalSupply))
            allBalance = addNum(tvl, allBalance)
            if (res[0].supply !== '0') {
                isall = true;
            }
            if (isall) {
                resolve(allBalance)
            } else {
                resolve(0)
            }
        })
    })

}
//LPpool
function getPoolListData(type) {
    return new Promise((resolve, reject) => {
        Promise.all([
            SmcBnb.getPoolData(),
            getCoinRate(),//  汇率
            getTokenRate(),//token 价格
            GetPairTotalSupply()
        ]).then(async res => {
            let coinRate = res[1]
            let tokenRate = res[2]
            let PairTotalSupply = res[3]
            let allBalance = 0
            let data = {
                "main": [],
                "flat": [],
                "ideas": []
            }
            let tvl, apy,dayapy, isall = false
            Icon.forEach((item, index) => {
                // precoin nextcoin 数量 2倍的usdt 取前/后币类的汇率 coinRate[0].rate
                switch (item.coin_price) {
                    case 'ETHPRE':
                        tvl = (((multiNum(res[index].precoin, 2)) * 1) * coinRate[0].rate).toFixed(2)
                        break;
                    case 'USDTPRE':
                        tvl = (((multiNum(res[index].precoin, 2)) * 1)).toFixed(2)
                        break;
                    case 'USDTNEXT':
                        tvl = (((multiNum(res[index].nextcoin, 2)) * 1)).toFixed(2)
                        break;
                    case 'BNBPRE':
                        tvl = (((multiNum(res[index].precoin, 2)) * 1) * coinRate[0].rate).toFixed(2)
                        break;
                    case 'BNBNEXT':
                        tvl = (((multiNum(res[index].nextcoin, 2)) * 1) * coinRate[1].rate).toFixed(2)
                        break;
                    case 'TRSPRE':
                        tvl = (((multiNum(res[index].precoin, 2)) * 1) * coinRate[0].rate).toFixed(2)
                        break;
                    default:
                        console.log(`error`);
                }
                tvl = new BigNumber(tvl).multipliedBy(new BigNumber(res[index].supply)).div(new BigNumber(PairTotalSupply))
                if (type !== 'all') {
                    if (res[index].supply === '0') {
                        // apy = `0.00%`
                        // dayapy = `0.00%`
                        apy = (((res[index].per_day * tokenRate) / 1) * 365 * 100).toFixed(2)
                        dayapy = (((res[index].per_day * tokenRate) / 1) * 100).toFixed(2)
                        tvl = `0.00`
                    } else {
                        apy = (((res[index].per_day * tokenRate) / tvl) * 365 * 100).toFixed(2)
                        dayapy = (((res[index].per_day * tokenRate) / tvl) * 100).toFixed(2)
                    }
                    data[item.key_word].push({
                        ...item,
                        ...res[index],
                        tvl,
                        dayapy,
                        apy
                    })
                }
                allBalance = addNum(tvl, allBalance)

                if (res[index].supply !== '0') {
                    isall = true;
                }

            })
            console.log('LPpool data =>',data);
            if (type === 'all') {
                if (isall) {
                    resolve(allBalance)
                } else {
                    resolve(0)
                }

            } else {
                resolve(data)

            }

        })
    })

}

function getAllBlock() {
    return new Promise((resolve, reject) => {
        Promise.all([
            SmcBnb.getLastTime(),
        ]).then(lastTime => {
            getAllRewardRate().then(allRate => {
                getAllStartTime().then(allTime => {
                    let allBalance = 0
                    allTime.forEach((item, index) => {
                        allBalance = allBalance + (lastTime[index] * 1 - item * 1) * allRate[index]
                    })
                    let a = allBalance + 1932500 - 2592245
                    resolve(a)
                })
            })
        }, error => {
            reject(error)
        })
    })
}
// 所有每秒奖励
function getAllRewardRate() {
    return new Promise((resolve, reject) => {
        Promise.all([
            SmcBnb.getRewardRate(),
        ]).then(res => {
            resolve(res.map((item) => {
                return Web3.utils.fromWei(item, 'ether')
            }))
        }).catch(err => {
            reject(err)
        })
    })
}
// 所有时间
function getAllStartTime() {
    return new Promise((resolve, reject) => {
        Promise.all([
            SmcBnb.getPoolStartTime(),
        ]).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
//获取行情的每一个价格 判断usdt前/后
function getAllTrsRate(){
    return new Promise((resolve, reject) => {
        Promise.all([
            SmcBnb.getTokenRate(),
        ]).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
function getTokenRate() {
    return new Promise((resolve, reject) => {
        Promise.all([
            BnbUsdt.getTokenRate(),
            SmcBnb.getTokenRate(),//BNB
        ]).then(res => {
            resolve(new BigNumber(res[0].rate).multipliedBy(new BigNumber(res[1].rate)))
        }).catch(err => {
            reject(err)
        })
    })
}
function GetPairTotalSupply() {
    return SmcBnb.getPairTotalSupply()
}
// function getTokenRate1() {
//     return Two.getTokenRate('USDTPRE')
// }

//获取汇率
function getCoinRate() {
    return new Promise((resolve, reject) => {
        Promise.all([
            // EthUsdt.getTokenRate(),//ETH
            // SmcBnb.getTokenRate(),//TRS
            SmcBnb.getTokenRate(),//BNB
            BnbUsdt.getTokenRate(),//BNB
        ]).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export default {
    getCurrentPool,
    getPoolListData,
    getTokenRate,
    getAllBlock,
    getAllTrsRate,
    GetAllhomedata,
    GetTimerHomedata
}