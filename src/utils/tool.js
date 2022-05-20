import BigNumber from "bignumber.js";
// 格式化数值保留小数位
export function formatNum(str, max = 2, min = 6) {
    if (str * 1 < 0) return 0;
    str = "" + str;
    let flag = str.indexOf(".") > 0;
    let temp;
    if (flag) {
        if (str.split(".")[0].length > 4) {
            let pre = str.split(".")[0];
            let next = str.split(".")[1];
            temp = pre + "." + next.substring(0, max);
        } else {
            let pre = str.split(".")[0];
            let next = str.split(".")[1];
            temp = pre + "." + next.substring(0, min);
        }
    } else temp = str;

    return temp;
}
//补0
export function add0(num) {
    num = Math.floor(num);
    return num < 10 ? "0" + num : num;
}
// 格式化倒计时 times 时间戳
export function CountDown(times) {
    let time = times - new Date().getTime();
    let day = Math.floor(time / 1000 / 60 / 60 / 24);
    let h = Math.floor((time / 1000 / 60 / 60) % 24);
    let m = Math.floor((time / 1000 / 60) % 60);
    let s = Math.floor((time / 1000) % 60);
    return `${add0(day)} : ${add0(h)} : ${add0(m)} : ${add0(s)}`;
}
//时间戳转化时间格式
export function formdate(time,type='YYYY-MM-DD hh:mm:ss') {
    let year = new Date(time).getFullYear();
    let month = new Date(time).getMonth() + 1;
    let day = new Date(time).getDate();
    let h = new Date(time).getHours();
    let m = new Date(time).getMinutes();
    let s = new Date(time).getSeconds();
    return (type.replace('YYYY',year).replace('MM',add0(month)).replace('DD',add0(day)).replace('hh',add0(h)).replace('mm',add0(m)).replace('ss',add0(s)) )
  }
//复制
export function copyUrl(text) {
    var domUrl = document.createElement("input");
    domUrl.value =text;
    domUrl.id = "creatDom";
    document.body.appendChild(domUrl);
    domUrl.select(); //选择对象
    document.execCommand("Copy"); //执行浏览器复制命令
    let creatDom = document.getElementById("creatDom");
    creatDom.parentNode.removeChild(creatDom);
  }
//格式化金额缩写
export function formatPrice(price){
    if (Number(price) < 1000) {
        return `${(price/1).toFixed(3)}`
    } else if (Number(price) >= 1000 && Number(price) < 1000000) {
        return `${(price/1000).toFixed(3)}K`
    }else if (Number(price) >= 1000000 && Number(price) < 1000000000) {
        return `${(price/1000000).toFixed(3)}M`
    }else if (Number(price) >= 1000000000 && Number(price < 1000000000000)) {
        return `${(price/1000000000).toFixed(3)}B`
    }else if (Number(price) >= 1000000000000) {
        return `${(price/1000000000000).toFixed(3)}T`
    }
}
//省略中间
export function formatAddr(Addr,l=3,r=4){
    return Addr && `${Addr.slice(0,l)}***${Addr.slice(Addr.length-r)}`
}
//科学计数法转字符串
export function scientificNotationToString(param) {
    // let indexofnum = param.toString().indexOf('-')
    let indexofnum = false
    if (param.toString().indexOf('-') == 0) {
       param = param.toString().substr(1)
       indexofnum = true
    }
    let strParam = String(param)
    let flag = /e/.test(strParam)
    if (!flag){
       if (indexofnum) {
            return `-${param}`
       }else{
           return param
       }
    } 
    let sysbol = true
    if (/e-/.test(strParam)) {
      sysbol = false
    }
    let index = Number(strParam.match(/\d+$/)[0])
    let basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, '')
    if (indexofnum) {
        if (sysbol) {
            return `-${basis.padEnd(index + 1, 0)}`
        } else {
            return `-${basis.padStart(index + basis.length, 0).replace(/^0/, '0.')}`
        }  
    }else{
        if (sysbol) {
            return basis.padEnd(index + 1, 0)
        } else {
            return basis.padStart(index + basis.length, 0).replace(/^0/, '0.')
        }  
    }
    
  }
//判断 a(String)-b(String/Array)是否相等/含有 caseIncensitive== true 不区分大小写
export function match(a, b, caseIncensitive = true) {
    if (a === null || a === undefined) return false;

    if (Array.isArray(b)) {
      if (caseIncensitive) {//.toLowerCase 转成小写
        return b.map((x) => x.toLowerCase()).includes(a.toLowerCase());
      }
      return b.includes(a);//.includes 方法区分大小写
    }

    if (caseIncensitive) {
      return a.toLowerCase() === b.toLowerCase();
    }

    return a === b;
  }
//验证是否为空
export function isEmpty(a) {
    if (a === null || a === undefined || a === "") {
      return true;
    } else {
      return false;
    }
  }
// 减法
export function Subtr(arg1, arg2) {
    let r1, r2, m, n,s1 = scientificNotationToString(arg1).toString(), s2 = scientificNotationToString(arg2).toString();
    try { r1 = s1.split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = s2.split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    const num = division((Number(accMul(s1,m)) - Number(accMul(s2,m))),m);
    return scientificNotationToString(num)
}
// 乘法
export function accMul(arg1, arg2) {
    let m = 0, s1 = scientificNotationToString(arg1).toString(), s2 = scientificNotationToString(arg2).toString(), num = 0;
    try { m += Number(s1.split(".")[1].length)  } catch (e) { m += 0 }
    try { m += Number(s2.split(".")[1].length) } catch (e) { m += 0 }
    num = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    return scientificNotationToString(num)
}
// 除法
export function division(arg1, arg2){
    let isminus = false , money = 0, t1 = 0, t2 = 0, r1, r2;
    let s1 = scientificNotationToString(arg1).toString(),s2 = scientificNotationToString(arg2).toString()
    let iof1 = s1.indexOf('-'),iof2 = s2.indexOf('-')
    if (iof1 != -1 && iof2 == -1 || iof1 == -1 && iof2 != -1) {
        isminus = true
    }
    try {
    t1 = Number(s1.split(".")[1].length);
    } catch (e) {
        t1 = 0
     }
    try {
    t2 = Number(s2.split(".")[1].length);
    } catch (e) {
        t2 = 0
    }
    r1 = Number(s1.replace(".", ""));
    r2 = Number(s2.replace(".", ""));
    //放大倍数后两个数相除 后，乘以两个小数位数长度相减后的10的次幂
    if (isminus) {
        money = (accMul(Math.abs(r1) / Math.abs(r2),Math.pow(10, t2 - t1))) * (-1);
    }else{
        money = (accMul(Math.abs(r1) / Math.abs(r2),Math.pow(10, t2 - t1)));
    }
    //保留2个小数位数
    return scientificNotationToString(money);
  }
//bignumber 精度转换
export function ConversionAccuracy(value,decimals = 18,type = 'formWei'){
    let num;
    if (type == 'formWei') {
        num = new BigNumber(value).div(new BigNumber(10).pow(decimals)).toString()
    }else{
        num = new BigNumber(value).times(new BigNumber(10).pow(decimals)).toString()
    }
    return scientificNotationToString(num)
}