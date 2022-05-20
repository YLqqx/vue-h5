import Web3 from "web3";
import store from '../store'
var web3;
function initWeb3() {
    if (window.ethereum) {
        // console.log('用户 1')
        web3 = new Web3(window.ethereum);
        // 请求用户授权
        window.ethereum.enable().then(function (accounts) {
            window.accountAddress = accounts[0];
            web3.eth.defaultAccount = accounts[0]
            // store.dispatch('setAccountAddr', accounts[0])
            // localStorage.setItem('setAccountAddr',accounts[0])
        }).catch(err => {
            console.log(err)
        });
    } else if (typeof web3 !== 'undefined') {
        // console.log('用户 2',web3)
        web3 = new Web3(web3.currentProvider);
        web3.eth.getAccounts(function (error, res) {
            if (!error) {
                // store.dispatch('setAccountAddr', res[0])
                web3.eth.defaultAccount = res[0]
                window.accountAddress = res[0];
            }
        })
    } else {
        console.log('本地?');
        web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/"));
    }
    // 实例化web3
        // wbnb = new web3.eth.Contract(wbnbabi(), wbnbaddr())
    return web3;
}
//导出相应的方法
export {
    initWeb3
}