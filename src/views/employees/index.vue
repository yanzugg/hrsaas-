<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <template v-slot:before>
          <span>共{{ page.total }}条记录</span>
        </template>

        <!-- 右侧显示按钮 -->
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button :disabled="checkPermission('PONIT-USER-ADD')" size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table v-loading="loading" border="" :data="list">
          <el-table-column label="序号" type="index" sortable="" />
          <el-table-column label="姓名" prop="username" sortable="" />
          <el-table-column label="头像" align="center">
            <template v-slot="{row}">
              <img v-imagerror="require('@/assets/common/head.jpg')" :src="row.staffPhoto" alt="" style="border-radius: 50%; width: 100px; height: 100px; padding: 10px" @click="showQrCode(row.staffPhoto)">
            </template>
          </el-table-column>
          <el-table-column label="工号" prop="workNumber" sortable="" />
          <el-table-column :formatter="formatEmployment" label="聘用形式" prop="formOfEmployment" sortable="" />
          <el-table-column label="部门" prop="departmentName" sortable="" />
          <!-- 作用域插槽来做过滤器 -->
          <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
            <!-- <template slot-scope="obj"></template> -->
            <template v-slot="{row}">
              <!-- 将时间进行格式化 -->
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" prop="enableState" sortable="">
            <template v-slot="{row}">
              <el-switch :value="row.enableState===1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <!-- <template v-slot="{row}"> -->
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 放置分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height:60px;">
          <el-pagination :page-size="page.size" :total="page.total" layout="prev, pager, next" @current-change="changePage" />
        </el-row>
      </el-card>
    </div>
    <!-- 放置组件弹层 -->
    <!-- sync修饰符是子组件去改变父组件的数据的一个语法糖 -->
    <AddEmployee :show-dialog.sync="showDialog" />
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>

    <!-- 放置分配组件 -->
    <AssignRole ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import { export_json_to_excel } from '@/vendor/Export2Excel'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role.vue'

export default {
  components: { AddEmployee, AssignRole },
  data() {
    return {
      loading: false,
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      list: [],
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: null
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee(id) {
      try {
        await this.$confirm('是否删除该员工')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 导出excel
      import ('@/vendor/Export2Excel').then(async excel => {
        //  excel是引入文件的导出对象
        // 导出header从哪来
        // data从哪来
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows) // 返回的data就是要导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工资料表',
          multiHeader,
          merges
        })
        // excel.export.json_to_excel({
        //  header:['姓名','工资']
        // data:[['张三'，'3000']]
        // fileName:'员工工资表'
        // })
        //  要转化 数据结构 还要和表头的顺序对应上
        // 要求转出的标题是中文
      })
    },
    // 将表头数据和数据进行对应
    formatJson(headers, rows) {
      return rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' && headers[key] === 'correctionTime') {
            //  格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    showQrCode(url) {
      // url存在的情况下才弹出层
      if (url) {
        this.showCodeDialog = true
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
        })
      } else {
        this.$message.warning('该用户没有头像')
      }
    },
    async editRole(id) {
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(id)
      //  弹出层
      this.showRoleDialog = true
    }
  }
}
</script>

<style>

</style>
