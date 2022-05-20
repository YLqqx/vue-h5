import Web3 from "web3";
class API {
	constructor(contract) {
		this.contract = contract
	}
	init(){
		return new Promise((resolve, reject) => {

			return this.contract.Connectpurse((result) => {
				resolve(result)
			}, (error) => {
				reject(error)
			})
		})

	}
	//home
	//获取总dao 质押量
	GetAlltotalSupply(){
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getAlltotalSupply(
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	//获取msc流通量
	GetmsctotalSupply(){
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getmsctotalSupply(
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	//TokenDao
	GetAllDao() {//GetDAOData
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				Promise.all([
					this.contract.GetAllDAO(1),
					this.contract.GetAllDAO(7),
					this.contract.GetAllDAO(15),
					this.contract.GetAllDAO(30),
				]).then(res => {
					console.log('dao data => 1',res);
					resolve(res)
				}).catch(err => {
					reject(err)
				})
			})
		})

	}
	getpledgedata(){
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getpledgedata(
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	//是否可提取
	GetcanGetReward(){
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.GetcanGetReward(
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	//提取
	Getwithdraw(type){
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.Getwithdraw(type,
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	//授权
	Buyapprove(type){
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.Buyapprove(type,
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	//是否授权
	getTokenDaoisApprove(){
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getTokenDaoisApprove(
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	// 质押
	setdeposit(daotype,amount,type){
		return new Promise((resolve, reject) => {
			this.contract.setdeposit(
				daotype,
				Web3.utils.toWei(amount, 'ether'),
				type,
				(result) => {
					resolve(result)
				}, (error) => {
					reject(error)
				}
			)
		})
	}
	// 一个周期区块数
	getlockTime(){
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getlockTime(
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	// 获取用户第一个周期的结束区块号
	getlockBlocks(){
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getlockBlocks(
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	// 是否自动质押
	IsAutoDeposits(){
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.IsAutoDeposits(
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	// 获取当前可提取数量(本金+利息)
	getcaculateWithdraw(){
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getcaculateWithdraw(
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	//获取利率
	getTokenDaorewardRatio(){
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getTokenDaorewardRatio(
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	//
	isApprove() {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getAccountStakedStatus(
					(result) => {
						if (result === '0') {
							resolve(false)
						} else resolve(true)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	//
	// 一个周期区块数
	getPairTotalSupply(){
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getPairTotalSupply(
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	// 获取矿池月/年收益
	getInitreward() {
		// return this.contract.initFnPromise().then(res => {
		return new Promise((resolve, reject) => {
			this.contract.getInitreward((result) => {
				let per = Web3.utils.fromWei(result, 'ether')
				resolve({
					per_day: per * 1 / 365,
					per_year: per
				})
			}, (error) => {
				reject(error)
			})
		})
		// })
	}
	// //获取授权地址未抵押的LP
	getUnStakedLp() {

		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getBalanceFromhuiwanUsdtMdexContract(
					window.accountAddress,
					(result) => {
						let temp = Web3.utils.fromWei(result, 'ether')
						resolve(temp)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	// 获取授权地址在pool中抵押数量
	getStakedLp() {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getPoolLP(
					window.accountAddress,
					(result) => {
						let temp = Web3.utils.fromWei(result, 'ether')
						resolve(temp)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	// 用户质押loop时间
	GetuserStartTime() {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getuserStartTime(
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	// 抵押LP到pool中--
	stakedLpToPool(amount) {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.stakingToHuiwanUsdtLoopContract(
					Web3.utils.toWei(amount, 'ether'),
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	// // 解押LP到从pool中 --
	stakedLpOutPool() {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.withdrawFromHuiwanUsdtLoopContract(
					(result) => {
						resolve(result)
					}, (error) => {
						reject(error)
					}
				)
			})

		})
	}
	// //检查交易状态
	checkedDeal(hash) {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve) => {
				this.contract.getDealStatusByHash(
					hash,
					(err, res) => {
						resolve(err, res)
					}
				)
			})
		})
	}

	// 未授权进行授权 approveHuiwanUsdtLoopAddr --
	approve() {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.approveHuiwanUsdtLoopAddr(
					(result) => {
						resolve(result.result)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}


	// 获取池子里的当前收益
	getEarned() {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getEarned(
					window.accountAddress,
					(result) => {
						let temp = Web3.utils.fromWei(result, 'ether')
						resolve(temp)
					}, (error) => {
						reject(error)
					}
				)
			})
		})
	}
	//领取收益 --
	getReward() {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getReward((res) => {
					resolve(res)
				}, (err) => {
					reject(err)
				})
			})
		})
	}
	// 每个池子每秒挖矿产出
	getRewardRate() {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getRewardRate((res) => {
					resolve(res)
				}, (err) => {
					reject(err)
				})
			})
		})
	}

	// pooldata
	getPoolData() {
		return new Promise((resolve, reject) => {
			this.getTokenRate().then(res => {
				let {
					precoin,
					nextcoin,
				} = res
				this.getInitreward().then(result => {
					this.contract.getTotalSupply(supply => {
						nextcoin = (Web3.utils.fromWei(nextcoin, 'ether')) * 1
						precoin = (Web3.utils.fromWei(precoin, 'ether')) * 1
						resolve({
							...result,
							precoin,
							nextcoin,
							supply
						})
					}, (error) => {
						reject(error)
					})

				})
			})
		})
	}


	getTokenRate(type) {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getBalanceFromHuiwanTokenContract((precoin) => {
					this.contract.getBalanceFromUsdtTokenContract((nextcoin) => {
						if (type && type === 'TPT') {
							nextcoin = (Web3.utils.fromWei(nextcoin, 'ether')) * 1
							precoin = (Web3.utils.fromWei(precoin, 'kwei')) / 10
						}
						let rate = 0
						if (type && type === 'USDTPRE') {
							rate = precoin / nextcoin
						} else if (type && type === 'HUSD') {
							rate = precoin / (nextcoin * 10000000000)
						} else if (type && type === 'DOGE') {
							rate = (nextcoin) / (precoin * 10000000000)
						} else if (type && type === 'XRP') {
							rate = (nextcoin * 10000000000) / (precoin)
						} else if (type && type === 'ADA') {
							rate = (nextcoin * 100000000000) / (precoin)
						} else if (type && type === 'EOS') {
							rate = (nextcoin * 10000000000000000) / (precoin)
						} else {
							rate = nextcoin / precoin
						}

						resolve({
							precoin,
							nextcoin,
							rate
						})
					})
				})
			})
		})
	}

	getBalanceOf() {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getBalanceFromUsdtTokenContract((res) => {
					resolve(Web3.utils.fromWei(res, 'ether'))
				}, (err) => {
					reject(err)
				})
			})
		})
	}
	// 时间戳
	getLastTime(rewardRate) {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getLastTime(res => {
					resolve(res)
				}, err => {
					reject(err)
				})
			})
		})
	}
	// 获取用户钱包代币数量 
	getWalletAllToken() {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getWalletAllToken((res) => {
					console.log('dao 获取余额 ',Web3.utils.fromWei(res, 'ether'));
					resolve(Web3.utils.fromWei(res, 'ether'))
				}, (error) => {
					reject(error)
				})
			})
		})
	}
	// 获取 
	getsmcbalanceOf(type) {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getsmcbalanceOf(type,(res) => {
					resolve(Web3.utils.fromWei(res, 'ether'))
				}, (error) => {
					reject(error)
				})
			})
		})
	}
	// 矿池开始时间
	getPoolStartTime() {
		return this.contract.initFnPromise().then(res => {
			return new Promise((resolve, reject) => {
				this.contract.getPoolStartTime((res) => {
					resolve(res)
				}, (error) => {
					reject(error)
				})
			})
		})
	}
}
export default API