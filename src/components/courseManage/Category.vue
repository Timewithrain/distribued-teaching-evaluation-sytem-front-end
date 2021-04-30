<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主内容区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-button type="primary" @click="showAddClassDialog">添加班级</el-button>
        </el-col>
        <el-col :span="17" style="margin-left: 80px">
          <!-- 搜索栏 -->
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" style="width: 780px;">
            <el-form-item label="专业">
              <el-input v-model="searchForm.str" placeholder="请输入专业名"></el-input>
            </el-form-item>
            <el-form-item label="年级">
              <el-select v-model="searchForm.grade" placeholder="请选择" style="width: 120px" clearable>
                <el-option v-for="item in gradeList" :key="item"
                  :label="item" :value="item">
                </el-option>
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
              <el-button type="primary" plain @click="getClassList">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      
      <el-table class="class-table" :data="classList" style="width: 100%;margin-bottom: 20px;" row-key="id">
      <!-- <el-table :data="classList" style="width: 100%;margin-bottom: 20px;" row-key="id"
        :tree-props="{children: 'courseList', hasChildren: 'true'}"> -->
        <el-table-column type="expand">
          <template v-slot="scope">

            <!-- 新课程子表 -->
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
        </el-table-column>
        <el-table-column prop="id" width="50"></el-table-column>
        <el-table-column prop="name" label="名称" width="220">
        </el-table-column>
        <el-table-column prop="number" label="班级号" width="120">
        </el-table-column>
        <el-table-column prop="grade" label="年级" width="120">
        </el-table-column>
        <el-table-column prop="department.name" label="学院" width="150">
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="270">
          <template v-slot="scope">
            <el-button type="primary" icon="el-tag-add" size="small" @click="showAddClassCourseDialog(scope.row)">添加课程</el-button>
            <el-button type="warning" icon="el-tag-edit" size="small" @click="showEditClassDialog(scope.row)">修改</el-button>
            <el-button type="danger" icon="el-tag-delete" size="small" @click="showDeleteClassDialog(scope.row.id)">删除</el-button>
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

    <!-- 添加班级对话框 -->
    <el-dialog
      title="添加班级"
      :visible.sync="addClassDialogVisible" width="50%">
      <el-form :model="addClassForm" :rules="addClassFormRules" ref="addClassFormRef" label-width="100px">
        <el-form-item label="班级名称:" prop="name">
          <el-input v-model="addClassForm.name"></el-input>
        </el-form-item>
        <el-form-item label="年级:" prop="grade">
          <el-input v-model="addClassForm.grade"></el-input>
        </el-form-item>
        <el-form-item label="班号:" prop="number">
          <el-input v-model="addClassForm.number"></el-input>
        </el-form-item>
        <el-form-item label="学院:" prop="department">
          <template>
            <el-select v-model="addClassForm.department.id" placeholder="请选择" clearable>
              <el-option v-for="item in departmentList" :key="item.id"
                :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addClassDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddClass">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改班级对话框 -->
    <el-dialog title="修改班级" :visible.sync="editClassDialogVisible" width="50%">
      <el-form :model="editClassForm" :rules="addClassFormRules" ref="editClassFormRef" label-width="100px">
        <el-form-item label="班级名称:" prop="name">
          <el-input v-model="editClassForm.name"></el-input>
        </el-form-item>
        <el-form-item label="年级:" prop="grade">
          <el-input v-model="editClassForm.grade"></el-input>
        </el-form-item>
        <el-form-item label="班号:" prop="number">
          <el-input v-model="editClassForm.number"></el-input>
        </el-form-item>
        <el-form-item label="学院:" prop="department">
          <template>
            <el-select v-model="editClassForm.department.id" placeholder="请选择" clearable>
              <el-option v-for="item in departmentList" :key="item.id"
                :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditClassDialog()">取 消</el-button>
        <el-button type="primary" @click="submitEditClass()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加班级课程对话框 -->
    <el-dialog title="添加课程" :visible.sync="addClassCourseDialogVisible" width="70%">
      <el-form :model="editClassForm" ref="editClassFormRef" inline>
        <el-form-item label="班级信息:" style="width: 300px; margin-left: 50px">
          <el-tag effect="plain">{{classInfo}}</el-tag>
          <!-- <el-input v-model="classInfo" :disabled="true"></el-input> -->
        </el-form-item>
        <el-form-item label="学院:" prop="department"  style="width: 300px">
          <el-tag type="warning" effect="plain">{{editClassForm.department.name}}</el-tag>
        </el-form-item>
        <el-form-item label="课程:"  style="width: 750px; margin-left: 50px">
          
          <el-tag type="success" effect="plain">{{course.name}}</el-tag>
          <!-- 课程查询表格 -->
          <template>
            <!-- 课程列表 -->
            <el-table :data="courseList" style="width: 700px">
              <el-table-column label="课程名" prop="name">
              </el-table-column>
              <el-table-column label="课程号" prop="number" width="100">
              </el-table-column>
              <el-table-column label="类型" prop="courseClass" width="100">
              </el-table-column>
              <el-table-column label="学院" prop="courseDep">
              </el-table-column>
              <el-table-column align="right" width="220">
                <template slot="header">
                  <!-- <el-input v-model="search" size="mini" placeholder="搜索课程"/> -->
                  <el-input v-model="searchCourseField">
                    <template slot="append">
                      <el-button icon="el-icon-search" @click="searchCourse()"></el-button>
                    </template>
                  </el-input>
                </template>
                <template v-slot="scopeCourse">
                  <el-button size="mini" @click="addCourse(scopeCourse.row)">添加课程</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 课程列表分页 -->
            <el-pagination @current-change="handleCourseCurrentChange"
              :current-page="this.courseStartPage" :page-size="this.coursePageSize"
              layout="total, prev, pager, next" :total="this.courseTotal"
              style="text-align: center">
            </el-pagination>
          </template>

        </el-form-item>

        <el-form-item label="教师:"  style="width: 750px; margin-left: 50px">
          <!-- 教师显示框 -->
          <el-tag type="success" aria-placeholder=" " effect="plain" style="width: 180px">{{teacher.name}}</el-tag>
          <!-- 教师查询搜索框 -->
          <el-select v-model="teacher" value-key="id" filterable remote reserve-keyword loading-text 
            placeholder="请输入教师姓名" :remote-method="searchTeacher" style="width: 500px; margin-left: 20px">
            <el-option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.department.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
          
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddClassCourseDialog()">取 消</el-button>
        <el-button type="primary" @click="submitAddClassCourse()">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
export default {
  data (){
    return {
      //班级分页信息
      pageSize: 5,
      startPage: 1,
      total: 0,
      //课程分页信息
      coursePageSize: 5,
      courseStartPage: 1,
      courseTotal: 0,
      //课程搜索栏
      searchCourseField: '',
      class: {},
      course: {},
      teacher: {},
      classInfo: '',
      classList: [],
      gradeList: [],
      departmentList: [],
      courseList: [],
      teacherList: [],
      addClassDialogVisible: false,
      editClassDialogVisible: false,
      addClassCourseDialogVisible: false,
      //搜索框表单数据对象
      searchForm: {
        str: '',
        grade: '',
        departmentId: ''
      },
      //添加班级的表单数据对象
      addClassForm: {
        //将要添加的班级名称、年级、班号、学院
        name: '',
        grade: '2017',
        number: '1',
        department: {}
      },
      editClassForm: {
        name: '',
        grade: '',
        number: '',
        department: {}
      },
      //添加班级表单的验证规则
      addClassFormRules: {
        name: [{ required: true, message: '请输入班级(专业)名称', trigger: 'blur' }],
        grade: [{ required: true, message: '请输入年级', trigger: 'blur' }],
        number: [{ required: true, message: '请输入班号', trigger: 'blur' }],
        department: [{ required: true, message: '请输入学院名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getClassList()
    this.getAllDepartmentList()
    this.getAllGradeList()
  },
  methods: {
    //获取班级数据
    async getClassList() {
      const result = await this.$http.get('/course-manager/class/searchClass?pageSize='+this.pageSize+'&startPage='+this.startPage+
      '&str='+this.searchForm.str+'&grade='+this.searchForm.grade+'&departmentId='+this.searchForm.departmentId)
      if (result.status != 200){
        return this.$message.error('获取课程列表失败！')
      }
      this.classList = result.data.data.list
      this.total = result.data.data.total
    },
    //获取学院数据
    async getAllDepartmentList() {
      const result = await this.$http.get('/course-manager/department/listAllDepartment')
      if (result.status != 200){
        return this.$message.error('获取学院列表失败！')
      }
      this.departmentList = result.data.data
    },
    //根据当前选中的班级获取其尚未选修的课程列表
    async getCourseList() {
      const result = await this.$http.get('/course-manager/courseManage/searchCourseNotSelected?pageSize='+this.coursePageSize+'&startPage='+this.courseStartPage+
      '&classId='+this.editClassForm.id+'&str='+this.searchCourseField)
        if (result.status!=200){
          return this.$message.error('获取班级对应的课程信息失败！')
        }
      this.courseList = result.data.data.list
      this.courseTotal = result.data.data.total
    },
    async getAllTeacherList() {
      const result = await this.$http.get('/user-manager/admin/listAllTeacher')
        if (result.status!=200){
          return this.$message.error('获取教师信息失败！')
        }
      this.teacherList = result.data.data
    },
    async getAllGradeList() {
      const result = await this.$http.get('/course-manager/class/listAllGrade')
        if (result.status!=200){
          return this.$message.error('获取教师信息失败！')
        }
      this.gradeList = result.data.data
    },
    //监听 pageSize改变
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getClassList()
    },
    //监听 startPage改变
    handleCurrentChange(newPage) {
      this.startPage = newPage
      this.getClassList()
    },
    //监听 课程分页courseStartPage改变
    handleCourseCurrentChange(newPage) {
      this.courseStartPage = newPage
      this.getCourseList()
    },
    //显示添加课程对话框
    showAddClassDialog() {
      this.addClassDialogVisible = true
      //添加班级信息前先获取学院信息
      this.getAllDepartmentList()
    },
    submitAddClass(){
      // 验证通过则提交班级信息
      this.$refs.addClassFormRef.validate(async valid => {
        //验证不通过则直接返回
        if (!valid) return 
        const result = await this.$http.post('/course-manager/class/addClass', this.addClassForm)
        if (result.status!=200){
          return this.$message.error('添加班级信息失败！')
        }
        this.$message.success('添加班级信息成功！')
        this.$refs.addClassFormRef.resetFields()
        this.addClassForm.department = {}
        this.addClassDialogVisible = false
        this.getClassList()
      })
    },
    showEditClassDialog(aClass){
      this.editClassForm = aClass
      this.editClassDialogVisible = true
      
    },
    closeEditClassDialog() {
      this.$refs.editClassFormRef.resetFields()
      this.editClassForm.department = {}
      this.editClassDialogVisible = false
    },
    async submitEditClass() {
      //确认
      const result = await this.$confirm('此操作将修改班级号为'+this.editClassForm.id+'的班级，是否继续？','提示', {
        confirmButtonText: '修改',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result!='confirm' ) {
        return this.$message.info('取消修改班级操作')
      }

      // 验证通过则提交班级信息
      this.$refs.editClassFormRef.validate(async valid => {
        //验证不通过则直接返回
        if (!valid) return 
        const result = await this.$http.put('/course-manager/class/updateClass', this.editClassForm)
        if (result.status!=200){
          return this.$message.error('修改班级信息失败！')
        }
      })
      this.$message.success('修改班级信息成功！')
      this.$refs.editClassFormRef.resetFields()
      this.editClassForm.department = {}
      this.editClassDialogVisible = false
      this.getClassList()
    },
    //展示删除班级对话框(级联删除class_course中的课程映射)
    async showDeleteClassDialog(classId){
      const result = await this.$confirm('此操作将彻底删除班级号为'+classId+'的班级，是否继续？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result!='confirm' ) {
        return this.$message.info('取消班级删除操作')
      }
      console.log(classId)
      //提交删除请求
      const result2 = await this.$http.delete('/course-manager/class/deleteClass?classId='+classId)
      if (result2.status!=200){
        return this.$message.error('删除班级操作失败！')
      }
      this.$message.success('成功删除班级!')
      this.getClassList()
    },
    //展示添加班级-课程对话框
    async showAddClassCourseDialog(aClass) {
      this.editClassForm = aClass
      this.course = {name: '请从下表中选择'}
      this.teacher = {name: '请在输入框中选择'}
      this.classInfo = this.editClassForm.name + ' ' + this.editClassForm.grade + '-' + this.editClassForm.number + '班'
      this.getCourseList()
      this.getAllTeacherList()
      this.addClassCourseDialogVisible = true
    },
    async searchCourse(){
      console.log('search course  invoked:'+this.searchCourseField)
      this.coursePageSize = 5
      this.courseStartPage = 1
      const result = await this.$http.get('/course-manager/courseManage/searchCourseNotSelected?pageSize='+this.coursePageSize+'&startPage='+this.courseStartPage+
      '&classId='+this.editClassForm.id+'&str='+this.searchCourseField)
        if (result.status!=200){
          return this.$message.error('获取课程信息失败！')
        }
      this.courseList = result.data.data.list
      this.courseTotal = result.data.data.total
    },
    //选择并添加课程
    addCourse(course) {
      this.course = course
    },
    async searchTeacher(query) {
      const result = await this.$http.get('/user-manager/admin/searchAllTeacher?str='+query)
      if (result.status!=200){
        return this.$message.error('获取教师信息失败！')
      }
      console.log(result)
      this.teacherList = result.data.data
    },
    //提交添加班级课程方法
    async submitAddClassCourse() {  
      // console.log('班级:'+this.editClassForm.name+' '+this.editClassForm.number+',课程:'+this.course.name+',教师:'+this.teacher.name)
      //确认
      const result = await this.$confirm('此操作将为班级号为'+this.editClassForm.id+'的班级添加课程:'+this.course.name+'，是否继续？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result!='confirm' ) {
        return this.$message.info('取消添加课程操作')
      }
      //检测参数不为空
      if (!this.editClassForm.id ||
          !this.course.id ||
          !this.teacher.id ) {
        return this.$message.error('请完整填写课程和教师信息！')
      }

      //提交
      const result2 = await this.$http.get('/course-manager/class/addClassCourse?classId='+this.editClassForm.id+'&courseId='+this.course.id+'&teacherId='+this.teacher.id)
      if (result2.status!=200){
        return this.$message.error('为该课程添加班级操作失败！')
      }
      this.addClassCourseDialogVisible = false
      this.getClassList()
      this.$message.success('成功为该班级添加课程！')
    },
    closeAddClassCourseDialog() { 
      this.$refs.editClassFormRef.resetFields()
      this.addClassCourseDialogVisible = false
    },
    //展示删除班级对应课程对话框的方法
    async showDeleteClassCourseDialog(classId,course){
      const result = await this.$confirm('此操作将删除班级号为'+classId+'的班级的'+course.name+'课程，是否继续？','提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result!='confirm' ) {
        return this.$message.info('取消课程删除操作')
      }
      console.log(classId+','+course.id)
      //提交删除请求
      const result2 = await this.$http.delete('/course-manager/class/deleteClassCourse?classId='+classId+'&courseId='+course.id)
      if (result2.status!=200){
        return this.$message.error('删除课程操作失败！')
      }
      this.$message.success('成功删除课程!')
      this.getClassList()
    }
  }
}
</script>

<style lang="less" scoped>
  .el-select {
    width: 100%;
  }

  .class-tablle {
    //通过母class进行子class的样式覆盖
    .el-table__expanded-cell {
      padding: 0px 40px !important;
    }
  }
  

</style>
