<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :value="trade.id"
            v-for="trade in trademark"
            :label="trade.tmName"
            :key="trade.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <!-- 上传图片   
      action：图片上传的地址
      list-type：文件列表的类型
      on-preview：图片预览的时候触发
      on-remove：当图片删除的时候触发
      file-list：照片墙需要展示的数据
      -->
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :flie-list="imgList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove" 
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}个未选择`" v-model="attrIdAndName">
          <el-option :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}`" v-for="unSelect in unSelectSaleAttr" :key="unSelect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndName" @click="addSaleAttr">添加销售属性</el-button>
      </el-form-item>
      <!-- 表格 -->
      <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
        <el-table-column type="index" label="序号" width="80" algin="center">
        </el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="属性值名称列表" width="width">
          <template slot-scope="{ row, $index }">
              <!--
                  el-tag:用于展示已有的属性值的数据的 
                  @close="handleClose(tag) "  -->
            <el-tag
              :key="tag.id"
              v-for="(tag,index) in row.spuSaleAttrValueList" 
              closable
              :disable-transitions="false" 
              @close="row.spuSaleAttrValueList.splice(index,1) "
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <!--  @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm" -->
            <el-input class="input-new-tag"
              v-if="row.inputVisible"
              v-model="row.inputValue"
              ref="saveTagInput"
              size="small" 
              @blur="handleInputConfirm(row)" 
              @keyup.enter.native="handleInputConfirm(row)" 
            >
            </el-input>
            <!-- @click="showInput" -->
            <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">+ New Tag</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
        </el-table-column>
      </el-table>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="scence0">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //spu信息
      spu: {
        category3Id: 0,
        description: "",
        tmId: '',
        spuImageList: [
          {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            spuId: 0,
          },
        ],
        spuName: "",
        spuSaleAttrList: [
          {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "",
                saleAttrName: "",
                saleAttrValueName: "",
                spuId: 0,
              },
            ],
          },
        ],
      },
      trademark: [], //品牌数据
      imgList: [], //存储spu图片
      saleList: [], //销售属性(全部)
      attrIdAndName:'',//收集未选择的属性的id和name
    };
  },
  methods: {
    //   照片墙删除图片的时候触发
    handleRemove(file, fileList) {
        // file：删除的图片
        // fileList：剩下的图片

        // 收集照片墙图片的数据
        // 对于已有的照片墙的图片：我们添加了name 和 url字段
        // 而服务器的照片的不需要 name 和 url字段
        this.imgList=fileList
    //   console.log(file, fileList);
    },
    // 照片墙预览的回调
    handlePictureCardPreview(file) {
        // 修改响应式数据
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(res,file,fileList){
        // console.log(res);
        // 收集图片的信息
        this.imgList = fileList
    },
    // 取消按钮的回调
    scence0() {
        // 取消展示spu列表
      this.$emit("scence0",{flag:''});
        //   Object.assign:合并对象
        // this._data:当前组件实例的响应式数据
        // this.$options.data():这是data配置项 执行就是data初始化数据
      Object.assign(this._data,this.$options.data())  //data数据初始化（清除数据）
    },
    async initSpuData(spu) {
      // console.log(spu);
      // 获取spu信息的请求
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      // console.log(spuResult);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      // 获取品牌的数据
      let trademarkResult = await this.$API.spu.reqTrademarkList();
      // console.log(trademarkResult);
      if (trademarkResult.code == 200) {
        this.trademark = trademarkResult.data;
      }
      // 获取图片的数据
      let imgResult = await this.$API.spu.reqImageList(spu.id);
      // console.log(imgResult);
      if (imgResult.code == 200) {
        let imgArr = imgResult.data;
        imgArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        // 整理好的数据赋值给imgList
        this.imgList = imgArr;
      }

      // 获取平台所有销售属性
      let saleResult = await this.$API.spu.reqSaleAttrList();
      // console.log(saleResult);
      if (saleResult.code == 200) {
        this.saleList = saleResult.data;
      }
    },
    // 添加销售属性按钮的回调
    addSaleAttr(){
        // console.log(123);
        // 分割收集的未选择的属性的id和name
        const [ baseSaleAttrId,saleAttrName] = this.attrIdAndName.split(':')
        // console.log(baseSaleAttrId,saleAttrName);
        // 追加spuSaleAttrList数组新的销售属性
        let newSale = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
        this.spu.spuSaleAttrList.push(newSale)
        // 清空attrIdAndName
        this.attrIdAndName = ''

    },
    // 添加按钮的回调
    addSaleAttrValue(row){
        // 显示input
        // inputVisible为真时，显示input 反之显示button
        this.$set(row,'inputVisible',true)
        // 为销售属性数组 添加input框收集的数据
        this.$set(row,'inputValue','')

    },
    // input失去焦点的回调
    handleInputConfirm(row){
        // 失去焦点显示button
        row.inputVisible=false
        // 向销售属性添加新的销售属性值
        const {baseSaleAttrId,inputValue} = row
        // 新增的销售属性值名名称不能为空
        if(inputValue.trim()==''){
            this.$message('输入为空！！')
            return
        }
        // 新增的销售属性值名称不能重复
        let result = row.spuSaleAttrValueList.every(item=>item.saleAttrValueName!=inputValue)
        if(result==false){
            this.$message('输入重复！！')
            return
        }
        let newSaleValue = {baseSaleAttrId,saleAttrValueName:inputValue}
        row.spuSaleAttrValueList.push(newSaleValue)
        
    },
    // 保存按钮的回调
    async addOrUpdateSpu(){
        // console.log(123);
        // 先整理参数：需要整理照片墙的数据
        // 携带参数：需要携带imgageName 和 imgageUrl字段
        this.spu.spuImageList = this.imgList.map(item=>{
            return {
                imgageName:item.name,
                imgageUrl:(item.response&&item.response.data) || item.url
            }
        })
        // 发请求
        try {
            await this.$API.spu.reqAddOrUpdateSpu(this.spu)
            // 保存 修改成功 重新发请求展示数据
            this.$message({type:'success',message:'保存成功'})
            // this.initSpuData(this.spu)
            // this.getSpuList()
            // 展示spu列表
            this.$emit('scence0',{flag:this.spu.id?'修改':'添加'})
            // 切换到场景0的时候 需要再请求请求展示新的数据（在父组件中进行）
        } catch (error) {
            alert(error.message)
        }
        // 清除数据
        Object.assign(this._data,this.$options.data())

    },
    // 添加spu按钮的回调
    async addSpuData(catagory3Id){
        // 添加spu的时候收集三级目录id
        this.spu.category3Id = catagory3Id
         // 获取品牌的数据
      let trademarkResult = await this.$API.spu.reqTrademarkList();
      // console.log(trademarkResult);
      if (trademarkResult.code == 200) {
        this.trademark = trademarkResult.data;
      }
       // 获取平台所有销售属性
      let saleResult = await this.$API.spu.reqSaleAttrList();
      // console.log(saleResult);
      if (saleResult.code == 200) {
        this.saleList = saleResult.data;
      }
    }
  },
  computed:{
    //   计算出还未选择的销售属性
    unSelectSaleAttr(){
        // 整个平台的销售属性一共有3个：颜色、尺寸、版本  ---saleList
        // 当前spu拥有的属于自己的销售属性spu.spuSaleAttrList  ---颜色
        return this.saleList.filter((item)=>{
            // console.log(item);
            return this.spu.spuSaleAttrList.every(item1=>item.name!=item1.saleAttrName)
        })
    }
  }
};
</script>

<style>
 .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>