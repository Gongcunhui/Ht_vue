<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- CategorySelect已经是全局组件了 -->
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scence != 0"
        size="mini"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 展示列表数据 -->
      <div v-show="scence == 0">
        <!-- 底部是有3部分进行切换的 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <!-- 表格：展示spu数据的地方 -->
        <el-table :data="list" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 后面用hinButton替换 -->
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku" 
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
              ></hint-button>

              <el-popconfirm :title="`确定删除${row.spuName}吗？`" @onConfirm="deleteSpu(row)">
                <hint-button 
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 
      @size-change="handleSizeChange"  :
      @current-change="handleCurrentChange" :
      -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 8]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <!-- 添加或修改spu-->
      <SpuForm v-show="scence == 1" @scence0="scence0" ref="spu"></SpuForm>
      <!-- 添加sku -->
      <SkuForm v-show="scence == 2" ref="sku"></SkuForm>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",

      page: 1, // 当前页
      limit: 3, // 每一页的数据个数
      list: [], // 存储列表的数据
      total: 10, // 总条数,
      scence: 0, // 0:代表展示spu列表的数据 1：添加 | 修改spu 2：添加sku
    };
  },
  name: "Spu",
  components: { SpuForm, SkuForm },
  methods: {
    // 获取spu列表数据的方法
    async getSpuList() {
      // 需要携带三个参数
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      // console.log(result);
      if (result.code == 200) {
        // 修改响应式数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 三级联动的自定义事件
    getCategoryId({ categoryId, level }) {
      // categoryid:可以获取1，2，3级目的目录的id level：为了区分是哪一集级目录
      if (level == 1) {
        this.category1Id = categoryId;
        // 清空2，3级的id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        // 清除三级目录id
        this.category3Id = "";
      } else if (level == 3) {
        this.category3Id = categoryId;
        // 有了3级目录id 就发请求 展示数据
        this.getSpuList();
      }
    },
    // 当前页发生改变时 触发回调
    handleCurrentChange(page) {
      // console.log(page);
      this.page = page;
      this.getSpuList();
    },
    // 当展示条数发生变化时触发的回调
    handleSizeChange(limit) {
      // console.log(limit)
      this.limit = limit;
      this.getSpuList();
    },
    // 添加spu按钮的回调
    addSpu() {
      // 展示 添加spu模块
      this.scence = 1;
      // 通知子组件发请求
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //修改某一个spu
    updateSpu(row) {
      this.scence = 1;
      // 获取当前组建的子组件的方法
      // console.log(this.$refs.spu);
      this.$refs.spu.initSpuData(row);
    },
    // 自定义事件的回调: 将scence设置为0
    scence0({ flag }) {
      this.scence = 0;
      // 再次获取列表的数据
      if (flag == "修改") {
        this.handleCurrentChange(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除spu按钮的回调
    async deleteSpu(row) {
      // console.log(123);
      // 发请求删除数据
     try {
        await this.$API.spu.reqDeleteSpu(row.id)
        // 弹出 删除成功
        this.$message({type:'success',message:'删除成功'})
        // 删除成功后 重新获取spu列表的数据进行展示
        this.handleCurrentChange(this.list.length>1?this.page:this.page-1)
     } catch (error) {
       alert(error.message)
     }
    
    },
    // hint-button的添加按钮的回调
    addSku(){
      // console.log(123);
      // 切换场景为2
      this.scence=2
      // 通知子组件发请求
      this.$refs.sku.getData()
    }
  },
};
</script>

<style>
</style>