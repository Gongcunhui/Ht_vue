<template>
  <div>
      <el-card style="margin:20px 0px">
        <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
      </el-card>
      <el-card>
        <!-- 展示平台列表 -->
        <div v-show="isShowTable">
          <el-button type="primary" icon="el-icon-plus" style="margin:0 0 5px 0" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
          <!-- 表格：展示平台属性 -->
          <el-table :data="attrList" style="width: 100%" border>
            <el-table-column type="index" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="attrName" label="属性名称" width="150">
            </el-table-column>
            <el-table-column prop="prop" label="属性值列表" width="width">
              <template slot-scope="{row}">
                <el-tag type="success" v-for="attr in row.attrValueList" :key="attr.id" style="margin:0 20px">{{attr.valueName}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="150">
              <template slot-scope="{row,$index}">
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="editAttr(row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 添加、修改属性的结构 -->
        <div v-show="!isShowTable">
            <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
              <el-form-item label="属性名">
                <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
              </el-form-item>
            </el-form>
            <el-button type="primary" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
            <el-button>取消</el-button>
            <el-table style="width: 100%;margin:20px 0 " border :data="attrInfo.attrValueList">
              <el-table-column  align="center" type="index" label="序号" width="80">
              </el-table-column>
              <el-table-column prop="prop" label="属性值名称" width="width">
                <template slot-scope="{row,$index}">
                  <el-input ref="ainput" v-if="row.flag" @blur="toSpan(row,$event)" v-model="row.valueName" placeholder="请输入属性值名称" size="mini"></el-input>
                  <span v-else @click="toEdit(row)">{{row.valueName}}</span>
                </template>
              </el-table-column>
              <el-table-column  prop="prop" label="操作" width="width">
                <template slot-scope="{row,$index}">
                  <!-- 气泡确认框 -->
                   <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                    <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" @click="AddOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
            <el-button @click="isShowTable=true">取消</el-button>
          
        </div>
      </el-card>
  </div>
</template>

<script>
export default {
  name:'Attr',
  data() {
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',
      flag:true,
      // 平台属性
      attrList:[],
      // 控制表格的显示与隐藏
      isShowTable:true,
      // 收集新增属性或修改属性的属性名称
      attrInfo:{
          attrName: "",  //属性名
          attrValueList: [   //所有的属性值
            // {
            //   attrId: 0,   //属性名的id
            //   valueName: ""  //属性值
            // }
          ],
          categoryId: 0,  //category3Id
          categoryLevel: 3,  //因为需要区分是几级目录
        }

    }
  },
  methods: {
    // 获取三级列表的id
    getCategoryId({categoryId,level}){
      if(level==1){
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      }else if (level==2){
        this.category2Id = categoryId
        this.category3Id= ''
      }else if(level==3){
        // 代表三级分类的id都有了 发请求获取数据
        this.category3Id = categoryId
        this.getAttrList()
      }
    },
    // 获取平台属性
    async getAttrList(){
      // console.log('123发请求');
      const {category1Id,category2Id,category3Id} = this
      let result = await this.$API.attr.reqGetAttrInfo(category1Id,category2Id,category3Id)
      if(result.code ==200){
        this.attrList = result.data
      }
    },
    // 添加属性值的回调
    addAttrValue(){
      // 向属性值的数组里面添加元素
      this.attrInfo.attrValueList.push({
        attrId:this.attrInfo.id, 
        valueName:'',
        flag:true,  //flag:给每一个属性值标记一个flag，用户切换查看模式与编辑模式，每一个属性都有自己的flag
      })
      // 自动聚焦
      this.$nextTick(()=>{
        this.$refs.ainput.focus()
      })
    },
    // 添加属性按钮的回调
    addAttr(){
      // 切换table的显示与隐藏
      this.isShowTable = false
      // attrInfo格式化(每次点击清除上次的数据)
      this.attrInfo={
          attrName: "",  //属性名
          attrValueList: [], //属性值数组
          categoryId: this.category3Id,  //category3Id
          categoryLevel: 3,  //因为需要区分是几级目录
        }

    },
    // 编辑按钮的回调
    editAttr(row){
      // console.log(row);
      this.isShowTable = false
      // 将选中的属性 赋值给 attrInfo (需要使用深拷贝)
      this.attrInfo = JSON.parse(JSON.stringify(row))
      // 给attrInfo 添加flag标记
      this.attrInfo.attrValueList.forEach(item => {
        // 保证添加的flag是响应式的
        this.$set(item,'flag',false)
      });
    },
    // 切换到查看模式
    toSpan(row,$event){
      //保证输入的值 不是空传
      if( $event.target.value.trim()==''){
        this.$message('输入为空！！')
        return
      }
      // 保证添加的属性值不重复
      let result = this.attrInfo.attrValueList.some(item=>{
        // 需要将row从数组里面去除 row是最新添加的那一个属性值（是attrValueList数组中的最后一项）
        if(row!=item){
          return row.valueName == item.valueName
        }
      })
      // console.log(result);
      if(result) {
        this.$message('输入重复！！')
        return
      }
      // input失去焦点 切换到span
      row.flag = false
    },
    // 切换到编辑模式
    toEdit(row){
      row.flag = true
      // 点击span的时候 ，需要自动获取焦点
      this.$nextTick(()=>{
        this.$refs.ainput.focus()
      })
    },
    // 气泡确认框的回调
    deleteAttrValue(index){
      // alert(123)
      // 删除当前索引的属性值
      this.attrInfo.attrValueList.splice(index,1)
    },
    // 保存按钮的回调（添加属性或修改属性）
    async AddOrUpdateAttr(){
      // 整理参数后再次发请求 

      // 整理参数1：如果属性值为空 不需要带给服务器
      // 整理参数2：提交给服务器数据当中不应该出现flag字段
     this.attrInfo.attrValueList =  this.attrInfo.attrValueList.filter(item=>{
        // 过滤掉属性值为空的
        if(item.valueName!=''){
          delete item.flag
          return true
        }
      })
    //  发请求
    try {
      await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
      this.$message('保存成功！')
      // 再次获取平台属性数据
      this.getAttrList()
      // 修改成功后 展示平台属性数据
      this.isShowTable = true
    } catch (error) {
      alert(error.message)
    }
    
    }
  },
}
</script>

<style>

</style>