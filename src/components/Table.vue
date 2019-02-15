<template>
  <div class="ht-table-info">
    <el-card shadow="hover">
      <div class="ht-table" :style="{background:getTableColor(data.status)}">{{data.tid}}号桌：{{data.status | filterStatus}}</div>
      <el-button type="success" plain size="mini" @click="showTableDetail">详情</el-button>
      <el-button type="danger" plain size="mini" @click="showTableUpdate">修改</el-button>
    </el-card>

    <!--桌台详情对话框-->
    <el-dialog :title="data.tid+'号桌台详情'" :visible="dialogTableDetailVisible" :before-close="closeDialogTableDetail">
      <!--对话框主体-->
      <el-tabs type="border-card" @tab-click="makeQRCode">
        <el-tab-pane label="桌台状态" class="tab-status">
            <el-form :label-position="labelPosition" label-width="80px">
              <el-form-item label="桌台状态:">
                  <el-tag>{{data.status | filterStatus}}</el-tag>
              </el-form-item>
            </el-form>
            <!-- 预定 -->
            <el-form :label-position="labelPosition" label-width="80px" v-show="checkIn">
              <el-form-item label="预定人:">
                <el-tag>{{tableInfo.contactName}}</el-tag>
              </el-form-item>
              <el-form-item label="联系电话:">
                <el-tag>{{tableInfo.phone}}</el-tag>
              </el-form-item>
              <el-form-item label="联系时间:">
                <el-tag>{{tableInfo.contactTime | filterTime}}</el-tag>
              </el-form-item>
              <el-form-item label="用餐时间:">
                <el-tag>{{tableInfo.dinnerTime | filterTime}}</el-tag>
              </el-form-item>
            </el-form>
            <!-- 占用 -->
            <el-form :label-position="labelPosition" label-width="80px" v-show="soldOut">
                <el-form-item label="桌台名称:">
                  <el-tag>{{tableName.tname}}</el-tag>
                </el-form-item>
                <el-form-item label="类型:">
                  <el-tag>{{tableName.type}}</el-tag>
                </el-form-item>
                <el-form-item label="用餐人数:">
                  <el-tag>{{order.customerCount}}</el-tag>
                </el-form-item>
                <el-form-item label="下单人:">
                  <el-tag v-for="(p,index) of customer" :key="index">{{p}}</el-tag>
                </el-form-item>
                <el-form-item label="用餐时间:">
                    <el-tag>{{order.startTime | filterTime}}</el-tag>
                  </el-form-item>
                  <el-form-item label="用餐菜单:">
                      <el-row>
                          <el-col :span="8" v-for="(d,index) of dish" :key="index">
                            <el-row>
                              <el-col :span="12"><img :src="require('../assets/img/dish/'+d.imgUrl)" alt=""></el-col>
                              <el-col :span="12">{{d.title}}</el-col>
                            </el-row>
                            <div>数量：{{orderDetail[index].dishCount}}</div>
                          </el-col>
                      </el-row>
                  </el-form-item>
              </el-form>
        </el-tab-pane>
        <el-tab-pane label="桌台二维码">
          <img :src="qrcodeData">
        </el-tab-pane>
      </el-tabs>
      <!--对话框尾部-->
      <div slot="footer">
        <el-button type="primary" @click="dialogTableDetailVisible=false">确定</el-button>
      </div>
    </el-dialog>
    <!-- 桌台修改对话框 -->
    <el-dialog :title="data.tid+'号桌台修改'" :visible="dialogTableUpdateVisible" :before-close="closeDialogTableUpdate">
      <el-form :label-position="labelPosition">
        <el-form-item label="状态：" >
          <el-radio v-model="checkStatus" label="1" border size="medium" @change="changeStatus">空闲</el-radio>
          <el-radio v-model="checkStatus" label="2" border size="medium" @change="changeStatus">预定</el-radio>
          <el-radio v-model="checkStatus" label="3" border size="medium" @change="changeStatus">占用</el-radio>
        </el-form-item>
      </el-form>
      <!-- 预定 -->
      <el-form  :label-position="labelPosition" label-width="100px" v-show="checkIn">
        <el-form-item label="预定时间：">
          <el-date-picker v-model="dinnerDate" type="datetime" placeholder="选择日期时间" class="ht-date"></el-date-picker>
        </el-form-item>
        <el-form-item label="预定人姓名：">
          <el-input placeholder="预定人姓名" v-model="checkName"></el-input>
        </el-form-item>
        <el-form-item label="预定人电话：">
          <el-input placeholder="预定人电话号码" v-model="checkPhone"></el-input>
        </el-form-item>
        <el-form-item class="ht-button">
            <el-button type="primary" @click="sendOrder">确定</el-button>
        </el-form-item>
      </el-form>
      <!-- 占用 -->
      <el-form :label-position="labelPosition" label-width="100px" v-show="soldOut">
        <el-form-item label="用餐人数：">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="用餐时间：">
            <el-input value="当前系统时间"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      dialogTableDetailVisible: false,
      dialogTableUpdateVisible:false,
      qrcodeData: '',  //二维码图片数据：Base64编码的字符串
      labelPosition:'left',
      checkIn:false,
      soldOut:false,
      tableInfo:[],
      order:[],
      orderDetail:[],
      dish:[],
      customer:[],
      tableName:[],
      dinnerDate:'',
      checkStatus:'1',
      checkName:'',
      checkPhone:''
    }
  },
  props:['data'],
  methods:{
    //桌台颜色
    getTableColor(status){
      if(status==1) return '#67C23A';
      else if(status==2) return '#E6A23C';
      else if(status==3) return '#F56C6C';
      else return '#909399';
    },
    //桌台数据
    showTableDetail(){
      //console.log(this.data); 当前桌子的数据
      this.dialogTableDetailVisible = true;
     
      let url = this.$store.state.globalSettings.apiUrl+`/admin/table/getInfo/${this.data.tid}/${this.data.status}`;
      this.$axios.get(url).then(res=>{
        if(this.data.status==2){
        this.checkIn = true
         console.log(res.data)
        this.tableInfo=res.data[0]
      }else if(this.data.status==3){
        this.soldOut=true
        console.log(res.data)
        let {order,table,orderDetail,dish}=res.data;
        this.order=order[0];
        this.orderDetail=orderDetail;
        let orderMan=new Set();
        orderDetail.map(detail=>orderMan.add(detail.customerName))
        this.customer=Array.from(orderMan)
        this.dish=dish
        this.tableName=table[0]
      }
      }).catch(err=>{
        console.log(err)
      })
    },
    //关闭
    closeDialogTableDetail(){
      this.dialogTableDetailVisible = false;
    },
    //二维码
    makeQRCode(){
      //创建二维码——注意此方法不能在当前组件的mounted中调用，因为绘图必需的canvas在el-dialog中，对话框在组件加载时并不在DOM树上
      var qrcode = require('qrcode');
      //每个桌子对应的URL应该形如：
      //http://127.0.0.1:8092/#/3       3为当前桌子编号
      var tableUrl = this.$store.state.globalSettings.appUrl + '/#/'+this.data.tid;

      //把绘制得到的图片二进制数据转换为Base64编码的字符串
      qrcode.toDataURL(tableUrl, {
        width: 300,
        errorCorrectionLevel: 'H'
      }, (err, url)=>{
        //console.log('二维码图片绘制完成,数据如下：')
        //console.log(url);   
        this.qrcodeData = url;
      })
    },
    // 修改桌台信息
    showTableUpdate(){
      this.dialogTableUpdateVisible = true;
      if(this.data.status==2){
        this.checkIn = true
        this.checkStatus ='2'
      }else if(this.data.status==3){
        this.soldOut = true
        this.checkStatus='3'
      }
    },
    closeDialogTableUpdate(){
      this.dialogTableUpdateVisible = false;
    },
    changeStatus(){
      if(this.checkStatus==2){
        this.checkIn=true
        this.soldOut=false
      }else if(this.checkStatus==3){
        this.soldOut=true
        this.checkIn=false
      }else{
        this.soldOut=false
        this.checkIn=false
      }
    },
    sendOrder(){
      let myDate=new Date();
      let nowTime = myDate.getTime()
      let formDate={
        tableId:this.data.tid,
        contactName:this.checkName,
        contactTime:nowTime,
        dinnerTime:this.dinnerDate,
        phone:this.checkPhone
      }
      console.log(formDate)
      let url='http://127.0.0.1:8090/admin/table'
      this.$axios.post(url,formDate).then(res=>{
        if(res.data.code==200){
          this.$message({message:res.data.msg,type:'success'})
          this.dataStatus='2'
          this.dialogTableUpdateVisible=false
        }else{
          this.$message({message:'添加失败',type:'danger'})
        }
      })
    }
  },
 
    
}
</script>

<style lang="scss">
.ht-table-info {
  padding: 3px;
  text-align: center;

  .ht-table {
    width: 90%;
    height: 120px;
    line-height: 120px;
    border: 1px solid #aaa;
    border-radius: 50%;
    box-shadow: 3px -4px 5px #666;
    margin: 5px auto;
  }
}
.tab-status{
  text-align: left
}
.ht-date{
  margin-right:22rem
}
.ht-button{
  text-align:left
}
</style>