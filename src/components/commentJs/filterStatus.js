let filterStatus = function(val){
    if( val == 1 ){
        return "空闲"
    }else if ( val == 2 ){
        return "预定"
    }else if( val == 3 ){
        return "占用"
    }else{
        return "其他"
    }
};
export default filterStatus;