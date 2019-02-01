<template>
  <div class="">
    <h1>添加菜品</h1>
    <el-form label-width="100px">
      <el-form-item label="菜品图片:">
        <el-upload class="ht-uploader" :action="uploadAction" :on-success="doUploadSucc" >
          <img :src="imageUrl" alt="" v-if="imageUrl">
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        imageUrl:"",
        uploadAction:this.$store.state.slobalSetting.apiUrl + '/admin/dish/image',   //可处理文件上传的数据api
        formdata:{
          title:"",
          imgUrl:"",   //菜品图片咋i服务器上的随机文件名
          price:"",
          details:"",
          categoryId:""
        }
      }
    },
    methods:{
      doUploadSucc(res,file){
        //文件上传成功后，客户端得到响应消息之后的处理函数
        //res：服务器端返回的响应消息
        //file：从input[type-file]中读取的第一个上传的文件对象
        this.formdata.imgUrl=res.fileName
        this.imageUrl =URL.createObjectURL(file.raw);
        //把上传的文件编码为DataURL字符串
      }
    }
  }
</script>
<style lang='scss'>
  .ht-uploader{
    .el-upload{
      border: 1px dotted #aaa;
      border-radius: 3px;
      cursor: pointer;
      width: 250px;
      height: 177px;
      overflow:hidden;
      &:hover{
        border-color:#409eff
      }
    }
  }
  img{
    max-width:100%;
  }
</style>