import { bnbAbi } from './abis/bnbABI' // pre-abi
import { usdtAbi } from './abis/usdtABI' // next-abi
import Contract from './contract/index'
import API from './contract/api'

// pre-next BNB/USDT
const bnbAddr = `0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd` // pre-coin
const usdtAddr = `0xec95835664d01A49199d8f7729286aF96D93a010` // next-coin
const bnbUsdtPairAddr = `0x08637DD560e526B5685244B11E9426C94EF93460` // pre-next-pair
const bnbUsdtPoolAddr = `` // pre-next-pool

const PreTokenAddr = bnbAddr
const NextTokenAddr = usdtAddr
const PairAddr = bnbUsdtPairAddr
const PoolAddr = bnbUsdtPoolAddr

// pre-next BNB/USDT
const PreTokenABI = bnbAbi //pre-abi
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