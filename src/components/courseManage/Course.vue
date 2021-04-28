<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-button type="primary" @click="showAddCourseDialog">添加课程</el-button>
        </el-col>
        <el-col :span="17" style="margin-left: 80px">
          <!-- 搜索栏 -->
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" style="width: 780px;">
            <el-form-item label="课程">
              <el-input v-model="searchForm.str" placeholder="请输入课程名或课程号"></el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="searchForm.courseClass" placeholder="请选择" style="width: 120px" clearable>
                <el-option label="必修课" value="必修课"></el-option>
                <el-option label="选修课" value="选修课"></el-option>
                <el-option label="全部" value=""></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学院">
              <el-select v-model="searchForm.departmentId" placeholder="请选择" style="width: 200px" clearable>
                <el-option v-for="item in departmentList" :key="item.id"
                  :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" plain @click="searchCourse">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table class="class-table" :data="courseList" style="width: 100%;margin-bottom: 20px;" row-key="id">
        <!-- <el-table-column type="expand">
          <template v-slot="scope">
            <div>
              <el-table :data="scope.row.courseList" row-key="id">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="name" label="课程名" width="180">
                </el-table-column>
                <el-table-column prop="number" label="课程号" width="150">
                </el-table-column>
                <el-table-column prop="teacher.name" label="教师" width="150">
                </el-table-column>
                <el-table-column prop="score" label="学分" width="120">
                </el-table-column>
                <el-table-column prop="courseClass" label="类型" width="120">
                </el-table-column>
                <el-table-column prop="operate" label="操作" width="100">
                  <template v-slot="scope2">
                    <el-button type="danger" icon="el-tag-delete" @click="showDeleteClassCourseDialog(scope.row.id,scope2.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column prop="id" width="50"></el-table-column>
        <el-table-column prop="name" label="课程名" width="200">
        </el-table-column>
        <el-table-column prop="number" label="课程号" width="100">
        </el-table-column>
        <el-table-column prop="courseClass" label="类型" width="100">
        </el-table-column>
        <el-table-column prop="score" label="学分" width="100">
        </el-table-column>
        <el-table-column prop="time" label="学时" width="100">
        </el-table-column>
        <el-table-column prop="courseDep" label="学院" width="150">
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="180">
          <template v-slot="scope">
            <el-button type="warning" icon="el-tag-edit" size="small" @click="showEditCourseDialog(scope.row)">修改</el-button>
            <el-button type="danger" icon="el-tag-delete" size="small" @click="showDeleteCourseDialog(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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

    <!-- 添加课程对话框 -->
    <el-dialog title="添加课程" :visible.sync="addCourseDialogVisible" width="50%">
      <el-form :inline="true" :model="addCourseForm" :rules="addCourseFormRules" ref="addCourseFormRef" label-width="100px">
        <el-form-item label="课程名称:" prop="name" style="margin-left: 10px;">
          <el-input v-model="addCourseForm.name" style="width: 460px"></el-input>
        </el-form-item>
        <el-form-item label="课程号:" prop="number" style="margin-left: 10px;">
          <el-input v-model="addCourseForm.number" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="课程类型:" prop="courseClass" style="margin-left: 10px;width: 300px;">
          <el-select v-model="addCourseForm.courseClass" placeholder="请选择" style="width: 190px;">
            <el-option label="必修课" value="必修课"></el-option>
            <el-option label="选修课" value="选修课"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程属性:" prop="courseType" style="margin-left: 10px;">
          <el-input v-model="addCourseForm.courseType" style="width: 460px;"></el-input>
        </el-form-item>
        <el-form-item label="学分:" prop="score" style="margin-left: 10px;">
          <el-input v-model="addCourseForm.score" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="学时:" prop="time" style="margin-left: 10px;width: 300px">
          <el-input v-model="addCourseForm.time" style="width: 190px;"></el-input>
        </el-form-item>
        <el-form-item label="学院:" prop="courseDep" style="margin-left: 10px;">
          <template>
            <el-select v-model="addCourseForm.courseDep" placeholder="请选择" clearable style="width: 460px">
              <el-option v-for="item in departmentList" :key="item.id"
                :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddCourseDialog()">取 消</el-button>
        <el-button type="primary" @click="submitAddCourse()">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 修改课程对话框 -->
    <el-dialog title="修改课程" :visible.sync="editCourseDialogVisible" width="50%">
      <el-form :inline="true" :model="editCourseForm" :rules="addCourseFormRules" ref="editCourseFormRef" label-width="100px">
        <el-form-item label="课程名称:" prop="name" style="margin-left: 10px;">
          <el-input v-model="editCourseForm.name" style="width: 460px"></el-input>
        </el-form-item>
        <el-form-item label="课程号:" prop="number" style="margin-left: 10px;">
          <el-input v-model="editCourseForm.number" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="课程类型:" prop="courseClass" style="margin-left: 10px;width: 300px;">
          <el-select v-model="editCourseForm.courseClass" placeholder="请选择" style="width: 190px;">
            <el-option label="必修课" value="必修课"></el-option>
            <el-option label="选修课" value="选修课"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程属性:" prop="courseType" style="margin-left: 10px;">
          <el-input v-model="editCourseForm.courseType" style="width: 460px;"></el-input>
        </el-form-item>
        <el-form-item label="学分:" prop="score" style="margin-left: 10px;">
          <el-input v-model="editCourseForm.score" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="学时:" prop="time" style="margin-left: 10px;width: 300px">
          <el-input v-model="editCourseForm.time" style="width: 190px;"></el-input>
        </el-form-item>
        <el-form-item label="学院:" prop="courseDep" style="margin-left: 10px;">
          <template>
            <el-select v-model="editCourseForm.courseDep" placeholder="请选择" clearable style="width: 460px">
              <el-option v-for="item in departmentList" :key="item.id"
                :label="item.name" :value="item.name">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditCourseDialog()">取 消</el-button>
        <el-button type="primary" @click="submitEditCourse()">修 改</el-button>
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
      courseList: [],
      departmentList: [],
      searchForm: {
        str: '',
        courseClass: '',
        departmentId: ''
      },
      addCourseForm: {
        name: '',
        number: '',
        courseType: '',
        courseClass: '',
        courseDep: '',
        score: 4,
        time: 0,
      },
      editCourseForm: {},
      addCourseDialogVisible: false,
      editCourseDialogVisible: false,
      //添加课程表单的验证规则
      addCourseFormRules: {
        name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        number: [{ required: true, message: '请输入课程号', trigger: 'blur' }],
        courseType: [{ required: true, message: '请输入课程属性', trigger: 'blur' }],
        courseClass: [{ required: true, message: '请选择课程类型', trigger: 'blur' }],
        courseDep: [{ required: true, message: '请选择学院', trigger: 'blur' }],
        score: [{ required: true, message: '请输入课程学分', trigger: 'blur' },
                //小数的正则表达式
                { pattern: /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/ ,
                  message: '学分必须为数值', trigger: 'blur' }],
        time: [{ required: true, message: '请输入课程学时', trigger: 'blur' },
               { type: 'number', message: '学时必须为整数值', trigger: 'blur', transform: (value) => Number(value) }],
      }

    }
  },
  created() {
    this.getCourseList()
    this.getAllDepartmentList()
  },
  methods: {
    async getCourseList() {
      const result = await this.$http.get('/course-manager/courseManage/searchCourseWithNoTeacher?pageSize='+this.pageSize+'&startPage='+this.startPage+
      '&str='+this.searchForm.str+'&courseClass='+this.searchForm.courseClass+'&departmentId='+this.searchForm.departmentId)
        if (result.status!=200){
          return this.$message.error('获取班级对应的课程信息失败！')
        }
      this.courseList = result.data.data.list
      this.total = result.data.data.total
    },
    //获取学院列表
    async getAllDepartmentList() {
      const result = await this.$http.get('/course-manager/department/listAllDepartment')
      if (result.status != 200){
        return this.$message.error('获取学院列表失败！')
      }
      this.departmentList = result.data.data
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getCourseList()
    },
    handleCurrentChange(newPage) {
      this.startPage = newPage
      this.getCourseList()
    },
    //显示添加课程对话框
    showAddCourseDialog() {
      this.addCourseDialogVisible = true
    },
    //关闭添加课程对话框
    closeAddCourseDialog() {
      this.$refs.addCourseFormRef.resetFields()
      this.addCourseDialogVisible = false
    },
    //每次查询页面时，从第一页显示
    searchCourse(){
      this.startPage = 1
      this.getCourseList()
    },
    //提交添加课程操作
    submitAddCourse() {
      // 验证课程信息
      this.$refs.addCourseFormRef.validate(async valid => {
        //验证不通过直接返回
        if (!valid) return this.$message.error('请完整填写课程信息！')
        const result = await this.$http.post('/course-manager/courseManage/addCourse', this.addCourseForm)
        if (result.status!=200){
          return this.$message.error('添加课程信息失败！')
        }
        this.$message.success('添加课程信息成功！')
        this.$refs.addCourseFormRef.resetFields()
        this.addCourseDialogVisible = false
        this.getCourseList()
      })
    },
    showEditCourseDialog(course) {
      this.editCourseForm = course
      this.editCourseDialogVisible = true;
    },
    closeEditCourseDialog() {
      this.$refs.editCourseFormRef.resetFields()
      this.editCourseDialogVisible = false
    },
    submitEditCourse() {
      console.log(this.editCourseForm)
      // 验证课程信息
      this.$refs.editCourseFormRef.validate(async valid => {
        //验证不通过直接返回
        if (!valid) return this.$message.error('请完整填写课程信息！')
        const result = await this.$http.put('/course-manager/courseManage/updateCourse', this.editCourseForm)
        if (result.status!=200){
          return this.$message.error('修改课程信息失败！')
        }
        this.$message.success('修改课程信息成功！')
        this.$refs.editCourseFormRef.resetFields()
        this.editCourseDialogVisible = false
        this.getCourseList()
      })
    },
    async showDeleteCourseDialog(course) {
      const result = await this.$confirm('此操作将彻底删除课程:'+course.name+'，是否继续？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result!='confirm' ) {
        return this.$message.info('取消课程删除操作')
      }
      console.log(course)
      //提交删除请求
      const result2 = await this.$http.delete('/course-manager/courseManage/deleteCourse?id='+course.id)
      if (result2.status!=200){
        return this.$message.error('删除班级操作失败！')
      }
      this.$message.success('成功删除班级!')
      this.getCourseList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
