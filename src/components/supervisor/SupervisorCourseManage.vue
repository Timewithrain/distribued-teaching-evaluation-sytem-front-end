<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>课程管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <el-tabs :tab-position="tabPosition" v-model="activeName" @tab-click="handleClick">
        <!-- 查看并添加可督察的课程 -->
        <el-tab-pane label="所有课程" name="add" style="margin-left: 30px;">
          
          <el-row :gutter="20">
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
            <el-table-column type="expand">
              <template v-slot="scope">

                <!-- 课程子表 -->
                <div>
                  <el-table :data="scope.row.courseList" row-key="id">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column prop="name" label="课程名" width="180">
                    </el-table-column>
                    <el-table-column prop="number" label="课程号" width="90">
                    </el-table-column>
                    <el-table-column prop="teacher.name" label="教师" width="120">
                    </el-table-column>
                    <el-table-column prop="score" label="学分" width="100">
                    </el-table-column>
                    <el-table-column prop="courseClass" label="类型" width="100">
                    </el-table-column>
                    <el-table-column prop="operate" label="操作" width="100">
                      <template v-slot="scope2">
                        <el-button type="primary" icon="el-tag-delete" size="small" @click="addSuperviseCourseDialog(scope.row.id,scope2.row)">监督</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

              </template>
            </el-table-column>
            <el-table-column prop="id" width="50"></el-table-column>
            <el-table-column prop="name" label="专业名称" width="220">
            </el-table-column>
            <el-table-column prop="number" label="班级号" width="120">
            </el-table-column>
            <el-table-column prop="grade" label="年级" width="120">
            </el-table-column>
            <el-table-column prop="department.name" label="学院" width="150">
            </el-table-column>
            <el-table-column prop="operate" label="操作" width="170">
              <template v-slot="scope">
                <el-button type="primary" icon="el-tag-add" size="medium" @click="addSuperviseClassDialog(scope.row)">监 督</el-button>
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
            :total="this.total" style="text-align: center;">
          </el-pagination>

        </el-tab-pane>

        <!-- 已被的督察课程 -->
        <el-tab-pane label="督察课程" name="search" style="margin-left: 30px;">
          
          
          <el-table class="class-table" :data="courseList" style="width: 100%;margin-bottom: 20px;" row-key="tableKey">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="name" label="课程名" width="170">
            </el-table-column>
            <el-table-column prop="number" label="课程号" width="100">
            </el-table-column>
            <el-table-column prop="teacher.name" label="教师" width="100">
            </el-table-column>
            <el-table-column prop="aclass.name" label="班级" width="100">
            </el-table-column>
            <el-table-column prop="aclass.grade" label="年级" width="80">
            </el-table-column>
            <el-table-column prop="score" label="学分" width="70">
            </el-table-column>
            <el-table-column prop="courseDep" label="学院" width="150">
            </el-table-column>
            <el-table-column prop="operate" label="操作" width="120">
              <template v-slot="scope">
                <el-button type="warning" icon="el-tag-edit" size="small" @click="deleteCourseFromSupervised(scope.row)">取消督察</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleCourseSizeChange"
            @current-change="handleCourseCurrentChange"
            :current-page="this.courseStartPage"
            :page-sizes="[3, 5, 10, 20]"
            :page-size="this.coursePageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.courseTotal" style="text-align: center;">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>

    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      supervisor: {},
      //班级分页信息
      pageSize: 5,
      startPage: 1,
      total: 0,
      //课程分页信息
      coursePageSize: 5,
      courseStartPage: 1,
      courseTotal: 0,
      //督导监察的课程列表
      courseList: [],
      classList: [],
      gradeList: [],
      departmentList: [],
      //督导检查的所有课程的Id
      allSupervisedCourseIdList: [],
      //搜索框表单数据对象
      searchForm: {
        str: '',
        grade: '',
        departmentId: ''
      },
      searchCourseForm: {
        str: '',
        classId: ''
      },
      tabPosition: 'top',
      //保存选中的标签页，默认为课程添加页面
      activeName: 'add',
    }
  },
  created() {
    this.getSupervisorInfo()
    this.getClassList()
    this.getAllDepartmentList()
    this.getAllGradeList()
  },
  methods: {
    async getSupervisorInfo() {
      const result = await this.$http.get('/user-manager/supervisor/getSupervisor')
      if (result.status != 200){
        return this.$message.error('获取个人信息失败！')
      }
      const s = result.data.data
      if (s) {
        this.supervisor = s
      } else {
        //若无法获取督导信息则登陆超时，重新登陆
        window.sessionStorage.clear();
        const result = await this.$http.get('/user-manager/user/logout');
        if (result.status != 200){
          return this.$message.error('退出状态异常！');
        }
        this.$router.push('/login');
        this.$message.success('登陆超时，请重新登录');
      }
    },
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
    //获取学院数据
    async getAllDepartmentList() {
      const result = await this.$http.get('/course-manager/department/listAllDepartment')
      if (result.status != 200){
        return this.$message.error('获取学院列表失败！')
      }
      this.departmentList = result.data.data
    },
    //获取督导督察的课程列表
    async getCourseList() {
      const result = await this.$http.get('/course-manager/courseManage/searchCourseBySupervisorId?pageSize='+this.coursePageSize+'&startPage='+this.courseStartPage+
      '&supervisorId='+this.supervisor.id+'&classId='+this.searchCourseForm.classId+'&str='+this.searchCourseForm.str)
        if (result.status!=200){
          return this.$message.error('获取班级对应的课程信息失败！')
        }
      this.courseList = result.data.data.list
      this.courseTotal = result.data.data.total
      console.log(this.courseList)
    },
    //监听 coursePageSize改变
    handleCourseSizeChange(newSize) {
      this.coursePageSize = newSize
      this.getCourseList()
    },
    //监听 courseStartPage改变
    handleCourseCurrentChange(newPage) {
      this.courseStartPage = newPage
      this.getCourseList()
    },
    async getAllGradeList() {
      const result = await this.$http.get('/course-manager/class/listAllGrade')
        if (result.status!=200){
          return this.$message.error('获取教师信息失败！')
        }
      this.gradeList = result.data.data
    },
    //重新选中页面则重新加载相应信息
    handleClick(tab, event) {
      //若选中了查看评价页面则重新加载评价列表
      if (tab.label=='所有课程') {
        this.getClassList()
      } else {
        this.getCourseList()
      }
    },
    //将classId对应的班级的course添加入督察的课程列表
    async addSuperviseCourseDialog(classId,course) {
      const result = await this.$confirm('确定添加该课程为督察课程吗？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result!='confirm' ) {
        return this.$message.info('取消监督操作')
      }
      const result2 = await this.$http.get('/user-manager/supervisor/addCourse?supervisorId='+this.supervisor.id+'&classId='+classId+'&courseId='+ course.id)
      if (result2.status!=200){
        return this.$message.error('添加督察课程失败！')
      }
      this.$message.success('成功添加督察课程！')
    },
    //将班级的所有课程添加入督察的课程列表
    async addSuperviseClassDialog(aclass) {
      const result = await this.$confirm('确定添加该班级的所有课程吗？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result!='confirm' ) {
        return this.$message.info('取消监督操作')
      }
      const result2 = await this.$http.get('/user-manager/supervisor/addClass?supervisorId='+this.supervisor.id+'&classId='+aclass.id)
      if (result2.status!=200){
        return this.$message.error('添加督察班级失败！')
      }
      this.$message.success('成功添加督察班级！')
    },
    async deleteCourseFromSupervised(course) {
      console.log(course)
      const result = await this.$confirm('确定取消督察该课程吗？','提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result!='confirm' ) {
        return this.$message.info('取消操作')
      }
      const result2 = await this.$http.delete('/user-manager/supervisor/deleteCourse?supervisorId='+this.supervisor.id+'&classId='+course.classId+'&courseId='+ course.id)
      if (result2.status!=200){
        return this.$message.error('取消课程失败！')
      }
      this.getCourseList()
      this.$message.success('成功取消课程！')
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