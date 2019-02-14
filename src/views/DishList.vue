<template>
  <div class="">
    <h1>菜品列表</h1>
    <el-tabs type="border-card">
      <el-tab-pane v-for="(c,i) in dishList" :key="i">
        <span slot = "label">
          <el-badge :value="c.dishList.length" class="ht-num">{{c.cname}}</el-badge>
        </span>
        <el-row>
          <el-col v-for = "(d,j) of c.dishList" :xs="12" :sm="8" :md="6" :lg="4" :xl="3" :key="j" class="ht-dish">
            <p class="ht-dname">{{d.title}}</p>
            <img :src="require('../assets/img/dish/'+d.imgUrl)" alt="" style="max-width: 90%;">
            <p class="ht-price">价格:{{d.price | filterMoney}}</p>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        dishList:[],
        showOut:false
      }
    },
    methods:{
      mouseIn(){
        this.showOut = true
      },
      outMouse(){
        this.showOut = false
      }
    },
    mounted(){
      //异步获取菜品列表
      let url = this.$store.state.globalSettings.apiUrl + '/admin/dish';
      this.$axios.get(url).then(({data})=>{
        this.dishList = data;
      }).catch((err)=>{
        console.log(err)
      })
    }
  }
</script>
<style lang='scss'>
  .ht-num sup{
    margin:6px -7px 0 0 
  }
  .ht-dish{
    position: relative;
    .ht-dname{
    position:absolute;
    top:0;
    margin:6px;
    color:#fff;
  }
  .ht-price{
      color:rgba(245, 64, 58, 0.959);
      position: absolute;
      top:0;
     margin-top:2rem;
     font-weight:bold;
     background:#00000040
    }
  }
  
</style>
