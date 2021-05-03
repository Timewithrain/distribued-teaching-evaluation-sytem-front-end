<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-button type="primary" @click="showAddStudentDialog">添加学生</el-button>
        </el-col>

        <el-col :span="17" style="margin-left: 50px">
          <el-form :inline="true" :model="searchForm" ref="searchFormRef" class="demo-form-inline" style="width: 800px;">
            <el-form-item label="姓名">
              <el-input v-model="searchForm.str" placeholder="请输入姓名或学号" style="width: 170px" clearable></el-input>
            </el-form-item>
            <el-form-item label="学院">
              <el-select v-model="searchForm.departmentId" @change="selectChanged" placeholder="请选择" style="width: 200px" clearable>
                <el-option v-for="item in departmentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级"  ref="searchFormClassRef">
              <el-select v-model="searchForm.classId" placeholder="请选择" style="width: 200px" clearable>
                <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="学院和班级">
              <el-cascader v-model="searchForm.classId" :options="departmentList" :props="departmentAndClass"></el-cascader>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" plain @click="getStudentList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <el-table class="student-table" :data="studentList" style="width: 100%;margin-bottom: 20px;" row-key="id">
        <el-table-column prop="id" width="50"></el-table-column>
        <el-table-column prop="name" label="姓名" width="170">
        </el-table-column>
        <el-table-column prop="idNumber" label="学号" width="150">
        </el-table-column>
        <el-table-column prop="gender" :formatter="genderFormat" label="性别" width="70">
        </el-table-column>
        <el-table-column prop="entranceDate" type="datetime" :formatter="dateFormat" label="入学日期" width="120">
        </el-table-column>
        <el-table-column prop="score" label="学分" width="100">
        </el-table-column>
        <el-table-column prop="aclass.name" label="专业" width="150">
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="120">
          <template v-slot="scope">
            <el-button type="danger" icon="el-tag-delete" size="medium" @click="showDeleteStudentDialog(scope.row)">删除</el-button>
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

    <!-- 添加学生对话框 -->
    <el-dialog title="添加学生" :visible.sync="addStudentDialogVisible" width="50%">
      <el-form :inline="true" :model="addStudentForm" ref="addStudentFormRef" :rules="addStudentFormRules" label-width="100px">
        <el-form-item label="学生姓名:" prop="name" style="margin-left: 10px;">
          <el-input v-model="addStudentForm.name" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="学号:" prop="idNumber" style="margin-left: 10px;width: 300px;">
          <el-input v-model="addStudentForm.idNumber" style="width: 190px;"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="gender" style="margin-left: 10px;">
           <el-radio-group v-model="addStudentForm.gender" style="width: 150px;">
            <el-radio-button :label="item.value" :key="item.value" v-for="item in selectGender">{{item.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="籍贯:" prop="region" style="margin-left: 10px;width: 300px;">
          <el-input v-model="addStudentForm.region" style="width: 190px;"></el-input>
        </el-form-item>
        <el-form-item label="学分:" prop="score" style="margin-left: 10px;">
          <el-input v-model="addStudentForm.score" :disabled="true" style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item label="出生年月:" prop="birth" style="margin-left: 10px;width: 300px;">
          <el-date-picker v-model="addStudentForm.birth" type="date" placeholder="选择日期" style="width: 190px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="入学年月:" prop="entranceDate" style="margin-left: 10px;width: 300px;">
          <el-date-picker v-model="addStudentForm.entranceDate" type="date" placeholder="选择日期" style="width: 190px;"></el-date-picker>
        </el-form-item>
        <el-form-item label="学院:" prop="aclass.department.id" style="margin-left: 10px;">
          <el-select v-model="addStudentForm.aclass.department.id"  @change="addFormSelectChanged" placeholder="请选择" clearable style="width: 460px">
            <el-option v-for="item in departmentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级:" prop="aclass" ref="classRef" style="margin-left: 10px;">
          <el-select v-model="addStudentForm.aclass.id" placeholder="请选择" clearable style="width: 460px">
            <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddStudentDialog()">取 消</el-button>
        <el-button type="primary" @click="submitAddStudent()">添 加</el-button>
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
      studentList: [],
      classList: [],
      departmentList: [],
      addStudentDialogVisible: false,
      searchForm: {
        str: '',
        classId: '',
        departmentId: ''
      },
    //   departmentAndClass: {
    //     lazy: true,
    //     lazyLoad(node, resovle) {
    //       const result = await this.$http.get('/course-manager/class/listAllClassWithNoCourseByDepartmentId?departmentId='+node.id)
    //       if (result.status != 200){
    //           return this.$message.error('获取班级列表失败！')
    //       }
    //       const nodes = result.data.data
    //       resolve(nodes);
    //     }
    //   },
      addStudentForm: {
        name: '',
        idNumber: '',
        password: '',
        role: { id: 3, name: '学生' },
        gender: '',
        region: '',
        score: 0,
        birth: '',
        entranceDate: '',
        aclass: { 
          id: '',
          department: { id: '' } 
        }
      },
      addStudentFormRules: {
        name: [{ required: true, message: '请输入班级(专业)名称', trigger: 'blur' }],
        idNumber: [{ required: true, message: '请输入班号', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        region: [{ required: true, message: '请输入籍贯', trigger: 'blur' }],
        birth: [{ required: true, message: '请选择出生时间', trigger: 'blur' }],
        entranceDate: [{ required: true, message: '请选择入职日期', trigger: 'blur' }],
        department: [{ required: true, message: '请选择学院', trigger: 'blur' }],
        aclass: [{ required: true, message: '请选择班级', trigger: 'blur' }]
      },
      //添加教师中的性别选项按钮
      selectGender: [
        { label: "男", value: 0 },
        { label: "女", value: 1 }
      ]
    }
  },
  created() {
    this.getStudentList()
    this.getAllDepartmentList()
  },
  methods: {
    async getStudentList() {
      const result = await this.$http.get('/user-manager/admin/searchStudent?pageSize='+this.pageSize+'&startPage='+this.startPage+
      '&str='+this.searchForm.str+'&classId='+this.searchForm.classId+'&departmentId='+this.searchForm.departmentId)
        if (result.status!=200){
          return this.$message.error('获取学生信息失败！')
        }
      this.studentList = result.data.data.list
      this.total = result.data.data.total
    },
    async getAllClassList(departmentId) {
      const result = await this.$http.get('/course-manager/class/listAllClassWithNoCourseByDepartmentId?departmentId='+departmentId)
      if (result.status != 200){
        return this.$message.error('获取班级列表失败！')
      }
      this.classList = result.data.data
    },
    async getAllDepartmentList() {
      const result = await this.$http.get('/course-manager/department/listAllDepartment')
      if (result.status != 200){
        return this.$message.error('获取学院列表失败！')
      }
      this.departmentList = result.data.data
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getStudentList()
    },
    handleCurrentChange(newPage) {
      this.startPage = newPage
      this.getStudentList()
    },
    //搜索框选中的学院改变时调用此方法重新加载对应学院的classList
    selectChanged(value) {
      console.log(this.searchForm.departmentId!='')
      if (this.searchForm.departmentId!='') {
        this.getAllClassList(this.searchForm.departmentId)
      }
      //当选择的学院改变时，清空班级选项框
      this.$refs.searchFormRef.model.classId=''
    },
    //添加学生对话框中选中的学院改变时，加载对应的classList
    addFormSelectChanged(value) {
      if (this.addStudentForm.aclass.department.id!='') {
        this.getAllClassList(this.addStudentForm.aclass.department.id)
      }
      //当选择的学院改变时，清空班级选项框
      this.addStudentForm.aclass.id=''
    },
    //性别信息格式化
    genderFormat(row){
      var dT=new Date(row.entranceDate);//row 表示一行数据, dateTime 表示要格式化的字段名称
      return row.gender == 0 ? '男' : '女'
    },
    //日期信息格式化
    dateFormat(row){
      var dT=new Date(row.entranceDate);//row 表示一行数据, dateTime 表示要格式化的字段名称
      return dT.getFullYear()+"-"+(dT.getMonth()+1)+"-"+dT.getDate();
    },
    showAddStudentDialog() {
      this.addStudentDialogVisible = true
    },
    submitAddStudent() {
      // 验证通过则提交学生信息
      this.$refs.addStudentFormRef.validate(async valid => {
        //验证不通过则直接返回
        if (!valid) return 
        const result = await this.$http.post('/user-manager/admin/addStudent', this.addStudentForm)
        if (result.status!=200){
          return this.$message.error('添加学生信息失败！')
        }
        this.$message.success('添加学生信息成功！')
        this.$refs.addStudentFormRef.resetFields()
        this.addStudentForm.aclass.department.id = ''
        this.addStudentForm.aclass.id = ''
        this.addStudentDialogVisible = false
        this.getStudentList()
      })
    },
    closeAddStudentDialog() {
      this.addStudentDialogVisible = false
      this.$refs.addStudentFormRef.resetFields()
      this.addStudentForm.aclass.department.id = ''
      this.addStudentForm.aclass.id = ''
    },
    async showDeleteStudentDialog(student) {
      const result = await this.$confirm('此操作将彻底删除学号为：'+student.number+'学生的信息，是否继续？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result!='confirm' ) {
        return this.$message.info('取消删除学生操作')
      }
      //提交删除请求
      const result2 = await this.$http.delete('/user-manager/admin/deleteStudent?id='+student.id)
      if (result2.status!=200){
        return this.$message.error('删除学生操作失败！')
      }
      this.$message.success('成功删除学生!')
      this.getStudentList()
    }
  }
}
</script>

<style scoped>

</style>