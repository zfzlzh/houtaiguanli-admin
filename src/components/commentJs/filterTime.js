let filterTime = function(val){
    let data = new Date(val)
    let y = data.getFullYear()
    let m = data.getMonth()+1
    let d = data.getDate()
    let h = data.getHours()
    let mi = data.getMinutes()
    let s = data.getSeconds()
    if(m < 10){m = '0'+m;}
    if(d < 10){d = '0'+d;}
    if(h < 10){h = '0'+h;}
    if(mi < 10){mi ='0'+mi;}
    if(s < 10){s = '0'+s;}
   
    return `${y}-${m}-${d} ${h}:${mi}:${s}`;
};
export default filterTime;