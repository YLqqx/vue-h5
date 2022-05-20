import Web3 from "web3";
import { daoAbi } from "../abis/daoABI"
import { pairAbi } from "../abis/pairABI"
import { poolAbi } from "../abis/poolABI"
import BigNumber from "bignumber.js"
import store from './../../store'

class Contract {
    constructor(options) {
        // addr
        this.PoolAddr = options.PoolAddr
        this.PreTokenAddr = options.PreTokenAddr
        this.NextTokenAddr = options.NextTokenAddr
        this.PairAddr = options.PairAddr
        this.TokenDaoAddress = '0x151C60371BF503F40d91687E4f23aC0F18b70ED2'
        this.TokenDaoAddress7 = '0x7A726b756532e12E2dE7B763684A7AFCe1A0c904'
        this.TokenDaoAddress15 = '0x0145FAA17F1c591c55e7266DAe78b041e5Cf7Cc5'
        this.TokenDaoAddress30 = '0x3E8c2276ccA8440D96CD2bB0B1f0a215e12f3F7F'

        // 合约abi
        this.poolABI = poolAbi
        this.PreTokenABI = options.PreTokenABI
        this.NextTokenABI = options.NextTokenABI
        this.PairABI = pairAbi
        this.TokenDaoABI = daoAbi
        // 合约对象
        this.huiwanUsdtLoopContract = null
        this.huiwanTokenContract = null
        this.usdtTokenContract = null
        this.huiwanUsdtMdexContract = null
        this.web3 = null
        this.account = null
        this.TokenDaoContract = null
        this.TokenDaoContract7 = null
        this.TokenDaoContract15 = null
        this.TokenDaoContract30 = null
        // this.init(function(){})
        this.isInit = false
    }
    
    web3account;
    // 初始化
    async init(callback) {
        let that = this
        if (this.isInit) {
            callback(this.web3account);
        } else {
            this.Connectpurse( res => {
                callback(res);
            })
            ethereum.on('accountsChanged',function(accounts){
                that.Connectpurse( res => {
                    callback(res);
                    location.reload();

                })
            }).on('chainChanged', (_chainId) =>{
                that.Connectpurse( res => {
                    callback(res);
                    location.reload();

                })
            });
            // else {
            //     alert("Looks like you need a Dapp browser to get started.");
            //     alert("Consider installing MetaMask!");
            // }
        }
    }

    Connectpurse(callback){
        let _this = this
            let web3Provider
            if (window.ethereum) {
                web3Provider = window.ethereum;
                try {
                    // 请求用户授权
                    window.ethereum.request({ method: 'eth_requestAccounts' })
                        .then(function (accounts) {
                            //创建web3对象;
                            _this.web3 = new Web3(window.ethereum);
                            _this.account = accounts[0]
                            // 创建合约
                            //
                            if (_this.PoolAddr) {
                                _this.huiwanUsdtLoopContract = new _this.web3.eth.Contract(_this.poolABI, _this.PoolAddr);
                            }
                            //
                            _this.huiwanTokenContract = new _this.web3.eth.Contract(_this.PreTokenABI, _this.PreTokenAddr);
                            //
                            _this.usdtTokenContract = new _this.web3.eth.Contract(_this.NextTokenABI, _this.NextTokenAddr);
                            //
                            _this.huiwanUsdtMdexContract = new _this.web3.eth.Contract(_this.PairABI, _this.PairAddr);
                            _this.TokenDaoContract = new _this.web3.eth.Contract(_this.TokenDaoABI, _this.TokenDaoAddress);
                            _this.TokenDaoContract7 = new _this.web3.eth.Contract(_this.TokenDaoABI, _this.TokenDaoAddress7);
                            _this.TokenDaoContract15 = new _this.web3.eth.Contract(_this.TokenDaoABI, _this.TokenDaoAddress15);
                            _this.TokenDaoContract30 = new _this.web3.eth.Contract(_this.TokenDaoABI, _this.TokenDaoAddress30);

                            //
                            window.accountAddress = accounts[0];
                            store.dispatch('setUserName', accounts[0])
                            _this.web3account = accounts[0]
                            _this.isInit = true
                            callback(accounts[0]);
                        })
                } catch (error) {
                    // 用户不授权时
                    console.error("User denied account access")
                }
            } else if (window.web3) {
                web3Provider = window.web3.currentProvider;
                //创建web3对象;
                _this.web3 = new Web3(web3Provider);

                _this.web3.eth.getAccounts(function (error, res) {
                    if (!error) {
                        _this.account = res[0]

                        // 创建合约
                        if (_this.PoolAddr) {
                            _this.huiwanUsdtLoopContract = new _this.web3.eth.Contract(_this.poolABI, _this.PoolAddr);
                        }
                        //
                        _this.huiwanTokenContract = new _this.web3.eth.Contract(_this.PreTokenABI, _this.PreTokenAddr);
                        //
                        _this.usdtTokenContract = new _this.web3.eth.Contract(_this.NextTokenABI, _this.NextTokenAddr);
                        //
                        _this.huiwanUsdtMdexContract = new _this.web3.eth.Contract(_this.PairABI, _this.PairAddr);

                        _this.TokenDaoContract = new _this.web3.eth.Contract(_this.TokenDaoABI, _this.TokenDaoAddress);
                        _this.TokenDaoContract7 = new _this.web3.eth.Contract(_this.TokenDaoABI, _this.TokenDaoAddress7);
                        _this.TokenDaoContract15 = new _this.web3.eth.Contract(_this.TokenDaoABI, _this.TokenDaoAddress15);
                        _this.TokenDaoContract30 = new _this.web3.eth.Contract(_this.TokenDaoABI, _this.TokenDaoAddress30);

                        window.accountAddress = res[0];
                        store.dispatch('setUserName', accounts[0])

                        _this.web3account = accounts[0]
                        _this.isInit = true

                        callback(res[0]);
                    }
                })

            }

    }
    //
    getpledgedata(callback, errorCallBack){
        let _this = this
        let item = {}
        return new Promise((resolve, reject) => {
            Promise.all([
                _this.huiwanUsdtLoopContract.methods.canGetReward(window.accountAddress).call(),// 是否可以提取
                _this.huiwanUsdtLoopContract.methods.userStartTime(window.accountAddress).call(),//用户质押开始时间
                _this.huiwanUsdtLoopContract.methods.balanceOf(window.accountAddress).call(),//查询pool余额
                _this.huiwanUsdtMdexContract.methods.balanceOf(window.accountAddress).call(),//查询pair余额
                _this.huiwanUsdtLoopContract.methods.earned(window.accountAddress).call()//查询某个用户在Loop 池子中的当前收益
            ]).then(async res => {
                item.canGetReward = res[0]
                item.userStartTime = res[1]
                item.LoopbalanceOf = Web3.utils.fromWei(res[2], 'ether')
                item.pairbalanceOf = Web3.utils.fromWei(res[3], 'ether')
                item.earned = Web3.utils.fromWei(res[4], 'ether')
                console.log('LPpool data =>',item);
                callback && callback(item)
            }).catch(err => {
                errorCallBack && errorCallBack(_this.handleError(err));
            })
        })
    }
    // LpPool
    // 是否可以提取
    GetcanGetReward(callback, errorCallBack) {
        let _this = this
        this.huiwanUsdtLoopContract.methods
            .canGetReward(window.accountAddress)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }
    //home
    getAlltotalSupply(callback, errorCallBack){
        let _this = this
        return new Promise((resolve, reject) => {
            Promise.all([
                _this.TokenDaoContract.methods.totalSupply().call(),// 总质押
                _this.TokenDaoContract7.methods.totalSupply().call(),// 总质押
                _this.TokenDaoContract15.methods.totalSupply().call(),// 总质押
                _this.TokenDaoContract30.methods.totalSupply().call(),// 总质押
            ]).then(async res => {
                let alltotalSupply = new BigNumber(res[0]).plus(new BigNumber(res[1])).plus(new BigNumber(res[2])).plus(new BigNumber(res[3])).div(new BigNumber(10).pow(18))
                callback(alltotalSupply)
            }).catch(err => {
                errorCallBack && errorCallBack(_this.handleError(error));
            })
        })
    }
    //msc流通
    getmsctotalSupply(callback, errorCallBack){
        let _this = this
        this.huiwanTokenContract.methods
            .totalSupply()
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }
    // TokenDao
    //GetAllDAO
    GetAllDAO(type) {
        let DaoContract, Daoaddress, _this = this
        switch (type) {
            case 1:
                DaoContract = _this.TokenDaoContract;
                Daoaddress = _this.TokenDaoAddress;
                break;
            case 7:
                DaoContract = _this.TokenDaoContract7;
                Daoaddress = _this.TokenDaoAddress7;
                break;
            case 15:
                DaoContract = _this.TokenDaoContract15;
                Daoaddress = _this.TokenDaoAddress15;
                break;
            case 30:
                DaoContract = _this.TokenDaoContract30;
                Daoaddress = _this.TokenDaoAddress30;
                break;
        }
        let item = {}
        return new Promise((resolve, reject) => {
            Promise.all([
                DaoContract.methods.lockTime().call(),// 一个周期区块数
                DaoContract.methods.lockBlocks(window.accountAddress).call(),// 获取用户第一个周期的结束区块号
                DaoContract.methods.isAutoDeposits(window.accountAddress).call(),// 是否自动质押
                DaoContract.methods.caculateWithdraw(window.accountAddress).call(),// 获取当前可提取数量(本金+利息)
                DaoContract.methods.rewardRatio().call(),// 获取利率
                // this.web3.eth.getBlockNumber(),//获取当前块
                this.web3.eth.getBlock('latest'),
                this.huiwanTokenContract.methods.allowance(window.accountAddress, Daoaddress).call(),//是否授权
                DaoContract.methods.balanceOf(window.accountAddress).call(),// 我的质押
                DaoContract.methods.totalSupply().call(),// 总质押
                DaoContract.methods.canWithdraw(window.accountAddress).call(),// 是否可提取

            ]).then(async res => {
                // (Math.ceil((res[5].number-res[1])/res[0])*res[0]+res[1]-res[5].number)*3+res[5].timestamp
                // (res[0] - ((res[5].number-res[1])%res[0]) )*3000 + res[5].timestamp
                let time
                if (res[7] != 0) {
                   if (res[2] && res[5].number > res[1]) {
                        time = (new BigNumber(res[0]).minus((new BigNumber(res[5].number).minus(new BigNumber(res[1]))).mod(new BigNumber(res[0])) )).multipliedBy(new BigNumber(3)).plus(new BigNumber(res[5].timestamp))
                        time = time.multipliedBy(new BigNumber(1000))
                    }else{
                        time = (new BigNumber(res[1]).minus(new BigNumber(res[5].number))).multipliedBy(new BigNumber(3)).plus(new BigNumber(res[5].timestamp)).multipliedBy(new BigNumber(1000))
                    }
                }else{
                    time = ''
                }
                
                item.type = type
                item.lockTime = res[0]
                item.lockBlocks = res[1]
                item.isAutoDeposits = res[2]
                item.earnings =  new BigNumber(res[3]).minus(new BigNumber(res[7])).div(new BigNumber(10).pow(18))
                item.rewardRatio = new BigNumber(res[4]).div(new BigNumber(100))
                item.apy = new BigNumber(res[4]).div(new BigNumber(10000)).multipliedBy(new BigNumber(10512000)).div(new BigNumber(res[0])).multipliedBy(new BigNumber(100))
                item.doubleapy = new BigNumber(1).plus(new BigNumber(res[4]).div(new BigNumber(10000))).pow(new BigNumber(10512000).idiv(new BigNumber(res[0]) )).minus(new BigNumber(1)).multipliedBy(new BigNumber(100))
                item.expirationtime = time
                item.period = res[0] * 3
                item.isallowance = res[6]
                item.balanceOf = new BigNumber(res[7]).div(new BigNumber(10).pow(18))
                item.totalSupply = new BigNumber(res[8]).div(new BigNumber(10).pow(18))
                item.canWithdraw = res[9]
                item.isGetwithdraw = false//是否提取
                item.isbuylock = false
                item.isBuyapprove = false
                console.log(' DAO data 1=>',item);
                resolve(item)
            }).catch(err => {
                errorCallBack && errorCallBack(_this.handleError(error));
                reject(err)
            })
        })
    }
    //提取
    Getwithdraw(type,callback, errorCallBack) {
        let DaoContract, Daoaddress, _this = this
        switch (type) {
            case 1:
                DaoContract = _this.TokenDaoContract;
                Daoaddress = _this.TokenDaoAddress;
                break;
            case 7:
                DaoContract = _this.TokenDaoContract7;
                Daoaddress = _this.TokenDaoAddress7;
                break;
            case 15:
                DaoContract = _this.TokenDaoContract15;
                Daoaddress = _this.TokenDaoAddress15;
                break;
            case 30:
                DaoContract = _this.TokenDaoContract30;
                Daoaddress = _this.TokenDaoAddress30;
                break;
        }
        if (!_this.web3) return
        let data = DaoContract.methods
            .withdraw()
            .encodeABI();
        this.sendTransactions(window.accountAddress,Daoaddress, data, callback, errorCallBack);
    }
    //授权
    Buyapprove(type,callback, errorCallBack) {
        let DaoContract, Daoaddress, _this = this
        switch (type) {
            case 1:
                DaoContract = _this.TokenDaoContract;
                Daoaddress = _this.TokenDaoAddress;
                break;
            case 7:
                DaoContract = _this.TokenDaoContract7;
                Daoaddress = _this.TokenDaoAddress7;
                break;
            case 15:
                DaoContract = _this.TokenDaoContract15;
                Daoaddress = _this.TokenDaoAddress15;
                break;
            case 30:
                DaoContract = _this.TokenDaoContract30;
                Daoaddress = _this.TokenDaoAddress30;
                break;
        }
        if (!_this.web3) return
        let data = this.huiwanTokenContract.methods
            .approve(Daoaddress, '115792089237316195423570985008687907853269984665640564039457584007913129639935')
            .encodeABI();
        this.sendTransactions(window.accountAddress, this.PreTokenAddr, data, callback, errorCallBack);
    }
    // 查询董事会是否授权
    getTokenDaoisApprove(callback, errorCallBack) {
        let _this = this
        this.huiwanTokenContract.methods
            .allowance(window.accountAddress, this.TokenDaoAddress)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }
    // 质押
    setdeposit(daotype,num, type, callback, errorCallBack) {
        let DaoContract, Daoaddress, _this = this
        switch (daotype) {
            case 1:
                DaoContract = _this.TokenDaoContract;
                Daoaddress = _this.TokenDaoAddress;
                break;
            case 7:
                DaoContract = _this.TokenDaoContract7;
                Daoaddress = _this.TokenDaoAddress7;
                break;
            case 15:
                DaoContract = _this.TokenDaoContract15;
                Daoaddress = _this.TokenDaoAddress15;
                break;
            case 30:
                DaoContract = _this.TokenDaoContract30;
                Daoaddress = _this.TokenDaoAddress30;
                break;
        }

        if (!_this.web3) return
        let data = DaoContract.methods
            .deposit(num, type)
            .encodeABI();
        // this.sendTransfer(window.accountAddress,Daoaddress, data, callback, errorCallBack);
        this.sendTransactions(window.accountAddress,Daoaddress, data, callback, errorCallBack);
    }
    // 一个周期区块数
    getlockTime(callback, errorCallBack) {
        let _this = this
        this.TokenDaoContract && this.TokenDaoContract.methods
            .lockTime()
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }
    // 获取用户第一个周期的结束区块号
    getlockBlocks(callback, errorCallBack) {
        let _this = this
        _this.web3.eth.getBlockNumber().then(newblock => {
            _this.TokenDaoContract && _this.TokenDaoContract.methods
                .lockBlocks(window.accountAddress)
                .call(function (error, res) {
                    if (error) {
                        errorCallBack && errorCallBack(_this.handleError(error));
                    } else {
                        callback && callback({ 'lockblocks': res, 'newblock': newblock });
                    }
                });
        })
    }
    // 是否自动质押
    IsAutoDeposits(callback, errorCallBack) {
        let _this = this
        this.TokenDaoContract && this.TokenDaoContract.methods
            .isAutoDeposits(window.accountAddress)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }
    // 获取当前可提取数量(本金+利息)
    getcaculateWithdraw(callback, errorCallBack) {
        let _this = this
        this.TokenDaoContract && this.TokenDaoContract.methods
            .caculateWithdraw(window.accountAddress)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }
    //获取利率
    getTokenDaorewardRatio(callback, errorCallBack) {
        let _this = this
        this.TokenDaoContract && this.TokenDaoContract.methods
            .rewardRatio()
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }
    // 
    // 查询用户是否授权
    getAccountStakedStatus(callback, errorCallBack) {
        let _this = this
        this.huiwanUsdtMdexContract.methods
            .allowance(window.accountAddress, this.PoolAddr)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 查询 huiwanUsdtLoop 池子初始奖励数量 57600000000000000000000
    getInitreward(callback, errorCallBack) {
        let _this = this
        this.huiwanUsdtLoopContract && this.huiwanUsdtLoopContract.methods
            .initreward()
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 查询项目方 huiwanUsdtLoop 池子里面的 lp 总数量
    getTotalSupply(callback, errorCallBack) {
        let _this = this
        this.huiwanUsdtLoopContract.methods
            .totalSupply()
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 查询某个用户在 huiwanUsdtLoop 池子中的当前收益
    getEarned(account, callback, errorCallBack) {
        let _this = this
        this.huiwanUsdtLoopContract.methods
            .earned(account)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }
    // 最新时间
    getLastTime(callback, errorCallBack) {
        let _this = this
        this.huiwanUsdtLoopContract.methods
            .lastTimeRewardApplicable()
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 查询 mdex 中配对合约拥有 huiwanToken 的数量
    getBalanceFromHuiwanTokenContract(callback, errorCallBack) {
        let _this = this
        this.huiwanTokenContract.methods
            .balanceOf(_this.PairAddr)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 获取用户token数量 
    getWalletAllToken(callback, errorCallBack) {
        let _this = this
        this.huiwanTokenContract.methods
            .balanceOf(_this.account)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }
    // 获取用户token数量 
    getsmcbalanceOf(type,callback, errorCallBack) {
        let Daoaddress, _this = this
        switch (type) {
            case 'pool':
                Daoaddress = _this.PoolAddr;
                break;
            case 1:
                Daoaddress = _this.TokenDaoAddress;
                break;
            case 7:
                Daoaddress = _this.TokenDaoAddress7;
                break;
            case 15:
                Daoaddress = _this.TokenDaoAddress15;
                break;
            case 30:
                Daoaddress = _this.TokenDaoAddress30;
                break;
            case 'dead':
                Daoaddress = '0x000000000000000000000000000000000000dead'
        }
        this.huiwanTokenContract.methods
            .balanceOf(Daoaddress)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 查询 mdex 中配对合约拥有 usdtToken 的数量
    getBalanceFromUsdtTokenContract(callback, errorCallBack) {
        let _this = this
        this.usdtTokenContract.methods
            .balanceOf(_this.PairAddr)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 授权 huiwanUsdtLoop 池子合约可以帮我在 mdex 配对合约花费我的 100000000 个 lp 份额 --
    approveHuiwanUsdtLoopAddr(callback, errorCallBack) {
        let _this = this
        if (!_this.web3) return
        let data = this.huiwanUsdtMdexContract.methods
            .approve(this.PoolAddr, _this.web3.utils.toWei("100000000"))
            .encodeABI();
        this.sendTransactions(window.accountAddress, this.PairAddr, data, callback, errorCallBack);
    }
    //lppool用户开始质押时间
    getuserStartTime(callback, errorCallBack) {
        let _this = this
        this.huiwanUsdtLoopContract.methods
            .userStartTime(window.accountAddress)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }
    // 在 mdex 配对合约中获取我的 lp 数量
    getBalanceFromhuiwanUsdtMdexContract(account, callback, errorCallBack) {
        let _this = this
        this.huiwanUsdtMdexContract.methods
            .balanceOf(account)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }
    // 查询项目方 huiwanUsdtLoop 池子里面的 lp 总数量
    getPairTotalSupply(callback, errorCallBack) {
        let _this = this
        this.huiwanUsdtMdexContract.methods
            .totalSupply()
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 抵押 lp 到 huiwanUsdtLoop 池子 --
    stakingToHuiwanUsdtLoopContract(amount, callback, errorCallBack) {
        let data = this.huiwanUsdtLoopContract.methods
            .stake(amount)
            .encodeABI();
        this.sendTransactions(window.accountAddress, this.PoolAddr, data, callback, errorCallBack);
    }

    // 查询某个用户在 huiwanUsdtLoop 池子中的余额
    getBalanceFromHuiwanUsdtLoopContract(account, callback, errorCallBack) {
        let _this = this
        this.huiwanUsdtLoopContract.methods
            .balanceOf(account)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 解押 --
    withdrawFromHuiwanUsdtLoopContract(callback, errorCallBack) {
        let data = this.huiwanUsdtLoopContract.methods.withdraw().encodeABI();
        this.sendTransactions(window.accountAddress, this.PoolAddr, data, callback, errorCallBack);
    }

    // 每秒挖矿产出
    getRewardRate(callback, errorCallBack) {
        let _this = this
        this.huiwanUsdtLoopContract.methods
            .rewardRate().call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }
    // 矿池开始时间
    getPoolStartTime(callback, errorCallBack) {
        let _this = this
        this.huiwanUsdtLoopContract.methods
            .starttime().call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 查询某个用户在 huiwanUsdtLoop 池子中的当前LP余额
    getPoolLP(account, callback, errorCallBack) {
        let _this = this
        this.huiwanUsdtLoopContract.methods
            .balanceOf(account)
            .call(function (error, res) {
                if (error) {
                    errorCallBack && errorCallBack(_this.handleError(error));
                } else {
                    callback && callback(res);
                }
            });
    }

    // 通过交易哈希查询 交易是否成功
    getDealStatusByHash(hash, callback) {
        this.web3 && this.web3.eth.getTransactionReceipt(hash, callback)


    }

    // 获取所有收益 --
    getReward(callback, errorCallBack) {
        let data = this.huiwanUsdtLoopContract.methods.getReward()
            .encodeABI();
        this.sendTransactions(window.accountAddress, this.PoolAddr, data, callback, errorCallBack)
    }


    // 获取&解押
    getExit(callback, errorCallBack) {
        let data = this.huiwanUsdtLoopContract.methods.exit()
            .encodeABI();
        this.sendTransfer(window.accountAddress, this.PoolAddr, data, callback, errorCallBack);
    }

    sendTransfer2(account, to, data) {
        this.web3.eth.sendTransaction({
            data: data,
            from: account,
            to: to
        })
            .then(function (receipt) {
            });
    }

    // /**
    //  * 发送交易
    //  * @param {Object} account 用户地址
    //  * @param {Object} to 合约地址
    //  * @param {Object} data 数据
    //  * @param {Object} callback 返回hash
    //  * @param {Object} errorCallBack 返回的错误
    //  */
    sendTransfer(account, to, data, callback, errorCallBack) {
        let _this = this
        let value = 0x0;
        //获取gaslimit
        _this.web3 && _this.web3.eth.estimateGas({
            from: account,
            to: to,
            data: data,
            value: value,
        },
            function (error1, gaslimit) {
                if (error1) {
                    // alert(error1);
                    errorCallBack(_this.handleError(error1));
                } else {
                    //获取gasprice
                    _this.web3 && _this.web3.eth.getGasPrice(function (error2, gasPrice) {
                        if (error2) {
                            errorCallBack(_this.handleError(error2));
                        } else {
                            gaslimit -= -10000;
                            let params = [{
                                // gasPrice: gasPrice,
                                // gasLimit: gaslimit,
                                to: to,
                                from: account,
                                data: data,
                                value: value,
                            },];
                            //提交交易
                            window.ethereum.sendAsync({
                                method: "eth_sendTransaction",
                                params: params,
                                from: account,
                            },
                                function (error, hash) {
                                    if (error) {
                                        errorCallBack && errorCallBack(_this.handleError(error));
                                    } else {
                                        callback(JSON.parse(JSON.stringify(hash)));
                                    }
                                }
                            );
                        }
                    });
                }
            }
        );


    }
    sendTransactions(account, to, data, callback, errorCallBack) {
        let _this = this
        _this.web3 && _this.web3.eth.sendTransaction({
            from: account,
            to: to,
            data: data,
        }).on('receipt', function(receipt){
            callback && callback(receipt)
        }).on('error', function(receipt){
            errorCallBack && errorCallBack(receipt)
        }); 
    }

    // init 进一步封装

    initFnPromise() {
        return new Promise((resolve, reject) => {
            this.init((res) => {
                if (res) {
                    resolve(res)
                } else {
                    reject('error')
                }
            })
        })
    }

    handleError(errorMsg) {
        if ("message" in errorMsg) {
            return errorMsg.message;
        }
        errorMsg = errorMsg.toString();
        errorMsg = errorMsg.replace(/\s+/g, " ");
        errorMsg = errorMsg.replace(/.+\\"message\\"\\:\s*\\"(.+)\\".+/, "$1");
        return errorMsg;
    }


}



export default Contract