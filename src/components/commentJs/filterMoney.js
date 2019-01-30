let filterMoney = function(string){  
    return `￥${Number(string).toFixed(2)}`
  };
  export default filterMoney;