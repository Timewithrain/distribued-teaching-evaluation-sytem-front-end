<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/student-home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>教学评价</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <el-tabs :tab-position="tabPosition" >
        <!-- 查看评价 -->
        <el-tab-pane label="查看评价" name="search" style="margin-left: 30px;">
          <el-table class="evaluation-table" :data="summaryEvaluationList" style="width: 100%;margin-bottom: 20px;" row-key="id">
            <el-table-column type="expand">
              <!-- <template v-slot="scope"> -->
                <!-- 个人评价子表 -->
                <!-- <div>
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
              </template> -->
            </el-table-column>
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="course.name" label="课程名" width="220">
            </el-table-column>
            <el-table-column prop="course.number" label="课程号" width="120">
            </el-table-column>
            <el-table-column prop="course.grade" label="年级" width="120">
            </el-table-column>
            <el-table-column prop="course.department.name" label="学院" width="150">
            </el-table-column>
            <el-table-column prop="supervisorScore" label="督导评分" width="120">
            </el-table-column>
            <el-table-column prop="studentScore" label="学生评分" width="120">
            </el-table-column>
            <el-table-column prop="summaryScore" label="综合评分" width="120">
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSummarySizeChange"
            @current-change="handleSummaryCurrentChange"
            :current-page="this.summaryStartPage"
            :page-sizes="[3, 5, 10, 20]"
            :page-size="this.summaryPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.summaryTotal">
          </el-pagination>
        </el-tab-pane>

        <!-- 添加评价 -->
        <el-tab-pane label="添加评价" name="add" style="margin-left: 30px;">
          <el-table class="class-table" :data="courseList" style="width: 100%;margin-bottom: 20px;" row-key="id">
            <el-table-column type="index" label="序号" width="70"></el-table-column>
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
            <el-table-column prop="operate" label="操作" width="120">
              <template v-slot="scope">
                <el-button type="warning" icon="el-tag-edit" size="small" @click="showAddEvaluationDialog(scope.row)">评 价</el-button>
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
      </el-tabs>

    </el-card>

    <!-- 添加评价对话框 -->
    <el-dialog title="添加课程评价" :visible.sync="addEvaluationDialogVisible" width="65%">
      <el-form :inline="true" :model="addEvaluationForm" :rules="addEvaluationFormRules" ref="addEvaluationFormRef" label-width="100px">
        <el-table class="evaluate" :data="evaluationItemList" style="width: 100%;margin-bottom: 20px;" row-key="id">
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="content" label="评价标准" width="370">
          </el-table-column>
          <el-table-column prop="weight" label="评价权重" width="100">
          </el-table-column>
          <el-table-column prop="score" label="评价" width="250">
            <template v-slot="scope">
              <el-form-item :prop="'score' + (scope.$index+1)">
                <el-radio-group v-model="scoreData[scope.$index].data" @change="addScore(scope.$index)">
                  <el-radio :label="100">很符合</el-radio>
                  <el-radio :label="75">较符合</el-radio>
                  <el-radio :label="50">不确定</el-radio>
                  <el-radio :label="25">不符合</el-radio>
                </el-radio-group>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="建议(选填):" prop="advice" style="margin-left: 10px;">
          <el-input  v-model="addEvaluationForm.advice" type="textarea" :rows="3" :clearable="true" maxlength="500" show-word-limit style="width: 450px; resize: none;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddEvaluationDialog()">取 消</el-button>
        <el-button type="primary" @click="submitAddEvaluation()">添 加</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data() {
    return {
      //评价页面分页参数
      startPage: 1,
      pageSize: 5,
      total: 0,
      //总评页面分页参数
      summaryStartPage: 1,
      summaryPageSize: 5,
      summaryTotal: 0,
      //可评价的课程列表
      courseList: [],
      //评价标准列表
      evaluationItemList: [],
      summaryEvaluationList: [],
      //被评价的课程
      course: {},
      addEvaluationForm: {
        individualId: 0,
        roleId: 3,
        //评价者id
        fromId: 0,
        //被评价的教师id
        teacherId: 0,
        //被评价的课程id
        courseId: 0,
        score1: 0,
        score2: 0,
        score3: 0,
        score4: 0,
        score5: 0,
        score6: 0,
        //总分
        totalScore: 0,
        //建议
        advice: ''
      },
      //用于对v-model做动态绑定
      scoreData: [
        { data: 0 },
        { data: 0 },
        { data: 0 },
        { data: 0 },
        { data: 0 },
        { data: 0 }
      ],
      tabPosition: 'top',
      addEvaluationDialogVisible: false,
      addEvaluationFormRules: {
        score1: [ { type:"number" ,min: 10, max: 100, message: '请完整填写评价', trigger: 'blur' } ],
        score2: [ { type:"number" ,min: 10, max: 100, message: '请完整填写评价', trigger: 'blur' } ],
        score3: [ { type:"number" ,min: 10, max: 100, message: '请完整填写评价', trigger: 'blur' } ],
        score4: [ { type:"number" ,min: 10, max: 100, message: '请完整填写评价', trigger: 'blur' } ],
        score5: [ { type:"number" ,min: 10, max: 100, message: '请完整填写评价', trigger: 'blur' } ],
        score6: [ { type:"number" ,min: 10, max: 100, message: '请完整填写评价', trigger: 'blur' } ]
      },
    }
  },
  created() {
    this.getStudentInfo()
  },
  methods: {
    async getStudentInfo() {
      const result = await this.$http.get('/user-manager/student/getStudent')
      if (result.status != 200){
        return this.$message.error('获取个人信息失败！')
      }
      const s = result.data.data
      if (s) {
        this.student = s
        //根据学生信息获取对应的课程列表
        this.getCourseList()
        //根据学生信息获取对应的总评列表
        this.getSummaryEvaluationList()
      } else {
        //若无法获取学生信息则登陆超时，重新登陆
        window.sessionStorage.clear();
        const result = await this.$http.get('/user-manager/user/logout');
        if (result.status != 200){
          return this.$message.error('退出状态异常！');
        }
        this.$router.push('/login');
        this.$message.success('登陆超时，请重新登录');
      }
    },
    async getCourseList() {
      const result = await this.$http.get('/course-manager/courseManage/listCourseByClassId?pageSize='+this.pageSize+'&startPage='+this.startPage+'&classId='+this.student.aclass.id)
        if (result.status!=200){
          return this.$message.error('获取课程信息失败！')
        }
      this.courseList = result.data.data.list
      this.total = result.data.data.total
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getCourseList()
    },
    handleCurrentChange(newPage) {
      this.startPage = newPage
      this.getCourseList()
    },
    //获取班级总评价
    async getSummaryEvaluationList() {
      const result = await this.$http.get('/evaluation-manager/evaluation/listSummaryEvaluationByClassId?pageSize='+this.summaryPageSize+'&startPage='+this.summaryStartPage+'&classId='+this.student.aclass.id)
      if (result.status!=200){
        return this.$message.error('获取总评信息失败！')
      }
      console.log(result)
      this.summaryEvaluationList = result.data.data.list
      this.summaryTotal = result.data.data.total
      console.log(this.summaryEvaluationList)
    },
    handleSummarySizeChange(newSize) {
      this.summaryPageSize = newSize
      this.getSummaryEvaluationList()
    },
    handleSummaryCurrentChange(newPage) {
      this.summaryStartPage = newPage
      this.getSummaryEvaluationList()
    },
    //获取评价标准项
    async getEvaluationItemList() {
      const result = await this.$http.get('/evaluation-manager/evaluationItem/listItem?roleId='+this.student.roleId)
        if (result.status!=200){
          return this.$message.error('获取评价标准项失败！')
        }
      this.evaluationItemList = result.data.data
      console.log(this.evaluationItemList)
    },
    showAddEvaluationDialog(course) {
      this.getEvaluationItemList()
      this.course = course
      this.addEvaluationDialogVisible = true
    },
    //为评价项目添加选中的分数
    addScore(i) {
      this.addEvaluationForm['score'+(i+1)] = this.scoreData[i].data
      console.log(this.scoreData)
      console.log(this.addEvaluationForm)
    },
    //生成评价结果
    assembleEvaluation() {
      //计算评价分数
      this.addEvaluationForm.score1 =  this.addEvaluationForm.score1 * this.evaluationItemList[0].weight
      this.addEvaluationForm.score2 =  this.addEvaluationForm.score2 * this.evaluationItemList[1].weight
      this.addEvaluationForm.score3 =  this.addEvaluationForm.score3 * this.evaluationItemList[2].weight
      this.addEvaluationForm.score4 =  this.addEvaluationForm.score4 * this.evaluationItemList[3].weight
      this.addEvaluationForm.score5 =  this.addEvaluationForm.score5 * this.evaluationItemList[4].weight      
      this.addEvaluationForm.score6 =  this.addEvaluationForm.score6 * this.evaluationItemList[5].weight
      var totalScore = this.addEvaluationForm.score1 + this.addEvaluationForm.score2 + this.addEvaluationForm.score3 + 
                        this.addEvaluationForm.score4 + this.addEvaluationForm.score5 + this.addEvaluationForm.score6
      this.addEvaluationForm.totalScore = totalScore/6
      //获取信息
      this.addEvaluationForm.roleId = this.student.roleId
      this.addEvaluationForm.fromId = this.student.id
      this.addEvaluationForm.teacherId = this.course.teacher.id
      this.addEvaluationForm.courseId = this.course.id
      console.log(this.addEvaluationForm)
    },
    //提交评价结果
    submitAddEvaluation() {
      // 验证通过则提交评价结果
      this.$refs.addEvaluationFormRef.validate(async valid => {
        //验证不通过则直接返回
        if (!valid) return this.$message.error('请完整填写评价！')
        const result = await this.$confirm('确定提交评价结果吗？','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (result!='confirm' ) {
          return this.$message.info('取消提交操作')
        }
        //计算并生成评价
        this.assembleEvaluation()
        //提交修改信息
        const result2 = await this.$http.post('/evaluation-manager/evaluation/addStudentIndividualEvaluation', this.addEvaluationForm)
        if (result2.status!=200){
          return this.$message.error('提交评价失败！')
        }
        this.addEvaluationDialogVisible = false
        this.$message.success('成功提交评价！')
      })
    },
    closeAddEvaluationDialog() {
      this.course = {}
      this.addEvaluationForm.advice = ''
      this.addEvaluationDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>

.el-textarea .el-textarea__inner{ // 然后找到对应的类名，在这里将拉伸去掉即可
  resize: none;
}
</style>
