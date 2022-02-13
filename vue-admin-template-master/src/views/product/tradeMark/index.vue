<template>
  <div>
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
      >添加</el-button
    >
    <!-- table组件属性：
      data：表格组件将来需要展示的数据---数组类型
      border：表格边框

      column属性：
      label：显示标题
      width：对应列的宽度
      align：文字居中
      prop:对应的字段名

      注意：element-ui当中的table展示的数据是一列一列的展示
      -->
    <el-table border style="width: 100%" :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌logo" width="width">
        <template slot-scope="{ row }">
          {{ row }}
          <!-- <img :src="row.logoUrl" alt=""> -->
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器
      当前第几页、数据的总条数、每一页展示的数据条数、连续页码
      @size-change="handleSizeChange" :pageSize 改变时会触发
      @current-change="handleCurrentChange" :currentPage 改变时会触发

       :current-page="6" :当前第几页
       total：数据总条数
       page-size：代表每一页展示多少条数据
       page-sizes：可以设置每一页展示多少条数据
       layout：可以实现分页器布局
       pager-count：展示多少个分页器按钮 默认7个
     -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout="prev, pager, next,jumper,->,sizes,total"
    >
    </el-pagination>

    <!-- 对话框
    visible.sync：是否显示 Dialog，支持 .sync 修饰符
    :rules="rules" : Form 提供表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
     -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单  ：model：收集表单的数据-->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌名称" label-width="100px" prop="logoUrl">
          <!-- 
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload" -->
          <!-- 这里收集数据不能使用v-model 不是表单元素
            action：设置图片上传的地址 
            :on-success：检测到图片上传成功，当图片上传成功，会执行一次
            :before-upload：可以在上传图片之前，执行一次
            -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  // 组件挂载完成时发请求
  data() {
    return {
      // 分页器的第几页
      page: 1,
      // 每一页的数据条数
      limit: 3,
      // 总共数据的条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 控制对话框是否显示
      dialogFormVisible: false,
      // 收集品牌的信息 :
      tmForm: {
        logoUrl: "",
        tmName: "",
      },
      // 表单验证的规则
      rules: {
        // 品牌名称的验证规则 ： required：必须要校验字段 message：提示信息 tigger：用户行为才导致触发）
        tmName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          // min：品牌名称的长度3-5
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        // 品牌的logoUrl验证的规则
        logoUrl: [{ required: true, message: "请选择图片"}],
      },
    };
  },
  mounted() {
    // 获取列表数据方法
    this.getPageList();
  },
  methods: {
    // 获取品牌列表的数据
    async getPageList() {
      // 获取品牌列表的接口
      const { page, limit } = this; //解构出参数【发请求需要携带的参数，所以在data初始化2个数据】
      let result = await this.$API.trademark.reqTradeMark(page, limit);
      // console.log(result);
      if (result.code == 200) {
        // 展示数据的总条数、列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 当前页发生改变时触发
    handleCurrentChange(page) {
      this.page = page;
      this.getPageList();
    },
    // 当分页器需要展示数据的条数发生变化的时候触发
    handleSizeChange(limit) {
      //  整理参数
      this.limit = limit;
      //  再次发请求展示数据
      this.getPageList();
    },
    // 点击显示对话框
    showDialog() {
      this.dialogFormVisible = true;
      // 清除数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //修改品牌
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      // row:当前用户选中这个品牌信息
      // 将已有的数据赋值给tmform进行展示
      this.tmForm = { ...row };
    },
    // 上传图片的相关回调
    handleAvatarSuccess(res, file) {
      // res：上传成功后返回的前端数据
      // file：上传之后服务器返回的前端数据
      // console.log(res);
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.tmForm.logoUrl = res.data;
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 确定按钮（添加品牌、修改品牌）
    addOrUpdateTradeMark() {
      //  当全部验证字段通过，再去书写业务逻辑
      this.$refs.ruleForm.validate(async (success) => {
        // console.log(success);
        // 如果全部字段符合字段
        if (success) {
          this.dialogFormVisible = false; //隐藏对话框
          // 发请求（添加品牌、修改品牌）
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            // 弹出信息
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            this.getPageList();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除品牌的操作
    deleteTradeMark(row){
      this.$confirm(`你确定删除${row.tmName}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 点击确认按钮的时候触发
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id)
          // 如果删除成功
          console.log(result);
          if(result.code){
              this.$message({
              type: 'success',
              message: '删除成功!'
          });
          // 再次获取品牌列表展示
          this.getPageList(this.list.length>1?this.page:this.page-1)
          }
        }).catch(() => {
          // 点击取消的时候触发
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
};
</script>
 
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
</style>