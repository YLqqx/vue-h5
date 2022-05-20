import { erc20Abi } from './abis/erc20ABI' // pre-abi
import { usdtAbi } from './abis/usdtABI' // next-abi
import Contract from './contract/index'
import API from './contract/api'

// pre-next SMC/USDT
const smcAddr = `0x4c9cf594259860Dd3bb5BB828e6Ce267cAbAd0D2` // pre-coin
const bnbAddr = `0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd` // next-coin
const smcbnbPairAddr = `0x23a99A913eFC44216b47e71aEfd3fD250ECceFb5` // pre-next-pair
const smcbnbPoolAddr = `0xC69191fE2d68799B29268B6D54077653B9E80C05` // pre-next-pool

const PreTokenAddr = smcAddr
const NextTokenAddr = bnbAddr
const PairAddr = smcbnbPairAddr
const PoolAddr = smcbnbPoolAddr

// pre-next SMC/USDT
const PreTokenABI = erc20Abi //pre-abi
const NextTokenABI = usdtAbi //next-abi



const contract = new Contract({
    PoolAddr,
    PreTokenAddr,
    NextTokenAddr,
    PairAddr,
    PreTokenABI,
    NextTokenABI,
})


export default new API(contract)