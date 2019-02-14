<template>
  <div class="">
    <h1>添加菜品</h1>
    <el-form label-width="100px">
      <el-form-item label="菜品图片：">
        <el-upload class="ht-uploader" :action="uploadAction" :on-success="doUploadSucc" :before-upload="beforeAvatarUpload">
          <img :src="imageUrl" alt="" v-if="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p>上传图片必须为JPG或者PNG格式，大小不得超过2MB</p>
      </el-form-item>
      <el-form-item label="名称：">
        <el-input v-model="title" placeholder="请输入菜品名称"></el-input>
      </el-form-item>
      <el-form-item label="类别：">
          <el-radio v-model="categoryId" :label="item.cid"  border size="medium" v-for="(item,index) of kindOf" :key="index">{{item.cname}}</el-radio>
      </el-form-item>
      <el-form-item label="价格：">
        <el-input v-model="price" placeholder="请输入菜品价格"></el-input>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input type="textarea"  :rows="2" placeholder="请输入内容" v-model="details"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sendDishInfo">提交</el-button>
        <el-button @click="clearDishInfo">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  
  export default {
    data(){
      return{
        imageUrl:"",
        uploadAction:this.$store.state.globalSettings.apiUrl  + '/admin/dish/image',   //可处理文件上传的数据api
        title:"",
        imgUrl:"",   //菜品图片在服务器上的随机文件名
        price:"",
        details:"",
        categoryId:1,
        kindOf:[]
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
      },
      beforeAvatarUpload(file){
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        const isPNG = file.type === 'image/png';

        if (!isJPG || !isPNG) {
          this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      sendDishInfo(){
        let formdata={
          title:this.title,
          imgUrl:this.imgUrl,
          price:this.price,
          details:this.details,
          categoryId:this.categoryId,
        }
        let url=this.$store.state.globalSettings.apiUrl +'/admin/dish';
        this.$axios.post(url,formdata).then(res=>{
          if(res.data.code == 200){
            this.$message({message:"添加成功",type:'success'})
          }else{
            this.$message({message:'添加出错',type:'warning'})
          }
        })
      },
      clearDishInfo(){
        this.title="";
          this.imgUrl="";
          this.price="";
          this.details="";
          this.categoryId=1
      }
    },
    mounted() {
     this.kindOf = this.$store.state.kindOf
    },
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
    .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  }
  img{
    max-width:100%;
  }
</style>