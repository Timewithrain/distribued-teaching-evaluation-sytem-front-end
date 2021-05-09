<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>评价查看</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table class="evaluation-table" :data="summaryEvaluationList" style="width: 100%;margin-bottom: 20px;" row-key="id">
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- 评价子表 -->
            <div>
              <el-table :data="scope.row.supervisorEvaluationList.concat(scope.row.studentEvaluationList)" row-key="id">
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column prop="advice" label="建议" width="600">
                </el-table-column>
                <el-table-column prop="roleId" label="角色" width="60">
                  <template v-slot="scope2">
                    {{scope2.row.roleId=='3' ? '学生' : '督导'}}
                  </template>
                </el-table-column>
                <el-table-column prop="totalScore" label="评分" width="80">
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="course.name" label="课程名" width="170">
        </el-table-column>
        <el-table-column prop="course.aclass.name" label="班级" width="90">
        </el-table-column>
        <el-table-column prop="course.teacher.name" label="教师" width="120">
        </el-table-column>
        <el-table-column prop="course.courseDep" label="学院" width="150">
        </el-table-column>
        <el-table-column prop="supervisorScore" label="督导评分" width="100">
          <template v-slot="supervisorScope">
            {{supervisorScope.row.supervisorScore==0 ? '暂无评价' : supervisorScope.row.supervisorScore.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column prop="studentScore" label="学生评分" width="100">
          <template v-slot="studentScope">
            {{studentScope.row.studentScore==0 ? '暂无评价' : studentScope.row.studentScore.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column prop="summaryScore" label="综合评分" width="100">
          <template v-slot="summaryScope">
            {{summaryScope.row.summaryScore==0 ? '暂无评价' : summaryScope.row.summaryScore.toFixed(2)}}
          </template>
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
      
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //总评页面分页参数
      summaryStartPage: 1,
      summaryPageSize: 5,
      summaryTotal: 0,
      //总评列表
      summaryEvaluationList: []
    }
  },
  created() {
    this.getSummaryEvaluationList()
  },
  methods: {
    async getSummaryEvaluationList() {
      const result = await this.$http.get('/evaluation-manager/evaluation/listSummaryEvaluation?pageSize='+this.summaryPageSize+'&startPage='+this.summaryStartPage)
      if (result.status!=200){
        return this.$message.error('获取总评信息失败！')
      }
      console.log(result)
      this.summaryEvaluationList = result.data.data.list
      this.summaryTotal = result.data.data.total
    },
    handleSummarySizeChange(newSize) {
      this.summaryPageSize = newSize
      this.getSummaryEvaluationList()
    },
    handleSummaryCurrentChange(newPage) {
      this.summaryStartPage = newPage
      this.getSummaryEvaluationList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-textarea .el-textarea__inner{ // 然后找到对应的类名，在这里将拉伸去掉即可
  resize: none;
}
</style>
