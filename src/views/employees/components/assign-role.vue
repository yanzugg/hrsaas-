<template>
  <el-dialog title="分配角色" :visible="showRoleDialog">
    <!-- 多选框组 -->
    <el-checkbox-group v-model="roleIds">
      <!-- 循环的选项 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <!-- 定义footer插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  components: {
  },
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      // 用户的id，当前要处理哪个用户
      type: String,
      default: null
      // required: true // 要求必须传该id
    }
  },
  data() {
    return {
      list: [], // 负责存储当前所有的角色id
      roleIds: [] // 这个数组负责存储当前用户所拥有的角色id
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    // 获取所有的角色
    this.getRoleList()
  },
  mounted() {
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.list = rows
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      // this.$emit('update:showRoleDialog', false)
      this.$parent.showRoleDialog = false
    },
    btnCancel() {
      this.roleIds = [] // 重置数组
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
