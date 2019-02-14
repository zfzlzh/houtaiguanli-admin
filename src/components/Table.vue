<template>
  <div class="ht-table-info">
    <el-card shadow="hover">
      <div class="ht-table" :style="{background:getTableColor(data.status)}">{{data.tid}}号桌：{{data.status | filterStatus}}</div>
      <el-button type="success" plain size="mini" @click="showTableDetail">详情</el-button>
      <el-button type="danger" plain size="mini">修改</el-button>
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
                      <el-row :gutter="20" >
                          <el-col :span="8" v-for="(d,index) of dish" :key="index">
                            <el-row>
                              <el-col :span="12"><img :src="require('../assets/img/dish/'+d.imgUrl)" alt=""></el-col>
                              <el-col :span="12">{{d.title}}</el-col>
                            </el-row>
                            <div>数量：{{orderDetail.dishCount}}</div>
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
  </div>
</template>

<script>
export default {
  data(){
    return{
      dialogTableDetailVisible: false,
      qrcodeData: '',  //二维码图片数据：Base64编码的字符串
      labelPosition:'left',
      checkIn:false,
      soldOut:false,
      tableInfo:[],
      order:[],
      orderDetail:[],
      dish:[],
      customer:[],
      tableName:[]
    }
  },
  props:['data'],
  methods:{
    getTableColor(status){
      if(status==1) return '#67C23A';
      else if(status==2) return '#E6A23C';
      else if(status==3) return '#F56C6C';
      else return '#909399';
    },
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
    closeDialogTableDetail(){
      this.dialogTableDetailVisible = false;
    },
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
</style>