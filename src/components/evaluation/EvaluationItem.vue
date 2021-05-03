<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教学评估</el-breadcrumb-item>
      <el-breadcrumb-item>评价管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-button type="primary" @click="showAddItemDialog">添加评价标准</el-button>
        </el-col>

        <el-col :span="17" style="margin-left: 50px; margin-left: 268px; width: 570px;">
          <el-form :inline="true" :model="searchForm" ref="searchFormRef" class="demo-form-inline" style="width: 570px;">
            <el-form-item label="内容">
              <el-input v-model="searchForm.str" placeholder="请输入评价关键词" style="width: 250px" clearable></el-input>
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="searchForm.roleId" placeholder="请选择" style="width: 120px" clearable>
                <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" plain @click="getEvaluationItemList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-table :data="evaluationItemList" stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="评价内容" prop="content" width="300"></el-table-column>
        <el-table-column label="评价角色" prop="roleId"></el-table-column>
        <el-table-column label="权重" prop="weight"></el-table-column>
        <el-table-column prop="operate" label="操作" width="180">
          <template v-slot="scope">
            <el-button type="warning" icon="el-tag-edit" size="small" @click="showEditItemDialog(scope.row)">修改</el-button>
            <el-button type="danger" icon="el-tag-delete" size="small" @click="showDeleteItemDialog(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.startPage"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="this.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total">
      </el-pagination>
    </el-card>

    <!-- 添加评价对话框 -->
    <el-dialog title="添加评价标准项" :visible.sync="addItemDialogVisible" width="50%">
      <el-form :inline="true" :model="addItemForm" :rules="addItemFormRules" ref="addItemFormRef" label-width="100px">
        <el-form-item label="评价项内容:" prop="content" style="margin-left: 10px;">
          <el-input type="textarea" :rows="2" v-model="addItemForm.content" style="width: 460px"></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="roleId" style="margin-left: 10px;">
          <el-select v-model="addItemForm.roleId" placeholder="请选择" clearable style="width: 460px">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重:" prop="weight" style="margin-left: 10px;">
          <el-input v-model="addItemForm.weight" style="width: 150px;"></el-input>
        </el-form-item>        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddItemDialog()">取 消</el-button>
        <el-button type="primary" @click="submitAddItem()">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 修改评价对话框 -->
    <el-dialog title="修改评价标准项" :visible.sync="editItemDialogVisible" width="50%">
      <el-form :inline="true" :model="editItemForm" :rules="addItemFormRules" ref="editItemFormRef" label-width="100px">
        <el-form-item label="评价项内容:" prop="content" style="margin-left: 10px;">
          <el-input type="textarea" :rows="3" v-model="editItemForm.content" style="width: 460px"></el-input>
        </el-form-item>
        <el-form-item label="角色:" prop="roleId" style="margin-left: 10px;">
          <el-select v-model="editItemForm.roleId" placeholder="请选择" clearable style="width: 460px">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重:" prop="weight" style="margin-left: 10px;">
          <el-input v-model="editItemForm.weight" style="width: 150px;"></el-input>
        </el-form-item>        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditItemDialog()">取 消</el-button>
        <el-button type="primary" @click="submitEditItem()">修 改</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      startPage: 1,
      pageSize: 5,
      total: 0,
      evaluationItemList: [],
      roleList: [],
      addItemDialogVisible: false,
      editItemDialogVisible: false,
      searchForm: {
        str: '',
        roleId: ''
      },
      addItemForm: {
        content: '',
        roleId: '',
        weight: 0,
      },
      editItemForm: {},
      addItemFormRules: {
        content: [{ required: true, message: '请输入评价内容', trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择评价角色', trigger: 'blur' }],
        weight: [{ required: true, message: '请输入评价权重', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getEvaluationItemList()
    this.getAllRoleList()
  },
  methods: {
    async getEvaluationItemList() {
      const result = await this.$http.get('/evaluation-manager/evaluationItem/searchItem?pageSize='+this.pageSize+'&startPage='+this.startPage+
      '&str='+this.searchForm.str+'&roleId='+this.searchForm.roleId)
        if (result.status!=200){
          return this.$message.error('获取学生信息失败！')
        }
      this.evaluationItemList = result.data.data.list
      this.total = result.data.data.total
    },
    async getAllRoleList() {
      const result = await this.$http.get('/user-manager/admin/listAllRole')
      if (result.status != 200){
        return this.$message.error('获取班级列表失败！')
      }
      this.roleList = result.data.data
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getEvaluationItemList()
    },
    handleCurrentChange(newPage) {
      this.startPage = newPage
      this.getEvaluationItemList()
    },
    showAddItemDialog() {
      this.addItemDialogVisible = true
    },
    submitAddItem() {
      this.$refs.addItemFormRef.validate(async valid => {
        //验证不通过直接返回
        if (!valid) return this.$message.error('请完整填写评价信息！')
        const result = await this.$http.post('/evaluation-manager/evaluationItem/addItem', this.addItemForm)
        if (result.status!=200){
          return this.$message.error('添加评价标准信息失败！')
        }
        this.$message.success('成功添加评价标准信息！')
        this.$refs.addItemFormRef.resetFields()
        this.addItemDialogVisible = false
        this.getEvaluationItemList()
      })
    },
    closeAddItemDialog() {
      this.$refs.addItemFormRef.resetFields()
      this.addItemDialogVisible = false
    },
    showEditItemDialog(item) {
      this.editItemForm = item
      this.editItemDialogVisible = true
    },
    submitEditItem() {
      this.$refs.editItemFormRef.validate(async valid => {
        //验证不通过直接返回
        if (!valid) return this.$message.error('请完整填写评价信息！')
        const result = await this.$http.put('/evaluation-manager/evaluationItem/updateItem', this.editItemForm)
        if (result.status!=200){
          return this.$message.error('修改评价标准信息失败！')
        }
        this.$message.success('修改添加评价标准信息！')
        this.$refs.editItemFormRef.resetFields()
        this.editItemDialogVisible = false
        this.getEvaluationItemList()
      })
    },
    closeEditItemDialog() {
      this.$refs.editItemFormRef.resetFields()
      this.editItemDialogVisible = false
    },
    async showDeleteItemDialog(item) {
      const result = await this.$confirm('此操作将彻底删除该评价标准，是否继续？','提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result!='confirm' ) {
        return this.$message.info('取消评价项删除操作')
      }
      //提交删除请求
      const result2 = await this.$http.delete('/evaluation-manager/evaluationItem/deleteItem?id='+item.id)
      if (result2.status!=200){
        return this.$message.error('删除评价项操作失败！')
      }
      this.$message.success('成功删除评价项!')
      this.getEvaluationItemList()
    }
  }
}
</script>

<style scoped>

</style>
