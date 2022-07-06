<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置标签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px;">
              <el-button size="small" type="primary" icon="el-icon-plus" @click="showDialog=true">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column prop="name" align="center" label="名称" width="240" />
              <el-table-column prop="description" align="center" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px;">
              <el-pagination :current-page="page.page" :page-size="page.pagesize" :total="page.total" layout="prev,pager,next" @current-change="changePage" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              :closable="false"
              show-icon
            />
            <el-form label-width="120px" style="margin-top:50px;">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled style="width:400px;" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px;" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" disabled style="width:400px;" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px;" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" disabled type="textarea" :rows="3" style="width:400px;" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置弹层组件 -->
    <el-dialog title="编辑部门" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" label-width="120px" :model="roleForm" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, updateRole, getRoleDetail, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [], // 承接数组
      page: {
        // 放置页码相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      },
      formData: { },
      showDialog: false,
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      roleForm: {
        name: '',
        description: ''
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage // 将当前页码赋值给当前的最新页码
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async deleteRole(id) {
      //  提示
      try {
        await this.$confirm('确定删除该角色')
        await deleteRole(id)
        this.getRoleList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true // 显示弹层
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        //  只有校验通过的情况下，才会执行await的下方内容
        // roleForm这个对象有id就是编辑，没有就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          // 新增业务
          await addRole(this.roleForm)
        }

        this.getRoleList()
        this.$message.success('编辑成功')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }

  }
}
</script>

<style>

</style>
