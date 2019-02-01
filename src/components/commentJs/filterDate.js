let filterDate = function(val){
    let data = new Date(val)
    let y = data.getFullYear();
    let m = data.getMonth()+1;
    let d = data.getDate();
    if(m < 10){m = '0'+m;}
    if(d < 10){d = '0'+d;}
   
    return `${y}-${m}-${d}`;
};
export default filterDate;