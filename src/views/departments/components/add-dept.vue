<template>
  <!-- 放置弹层组件 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据，label-width设置标题的宽度 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username " />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-50个字符" type="textarea" :row="3" />
      </el-form-item>
    </el-form>
    <!-- 确定和消息 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
    // value是部门名称，要去和同级部门下的部门去比较，有没有相同的 有相同的不能过 /不相同的可以过
      const { depts } = await getDepartments()
      // 去找同级部门下，有没有和value相同的数据
      // 找到同级部门的所有的子部门
      let isRepeat = false
      if (this.formData.id) {
        // 有id就是编辑模式
        // 编辑的数据 在数据库里有 同级部门下 我的名字不能和其他同级部门的名字重复
        // 首先要找到我的同级部门 this.formData.id就是我当前的id 我的pid是this.formData.pid
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 没有id就是新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      // 如果isRepeat为true，表示找到了一样的名字
      isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式下
        // 要求是不能有一样的code
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value)
      }
      // 要求编码 和所有的部门编码都不能重复 由于历史数据可能没有code，这里加一个强制性条件

      isRepeat ? callback(new Error(`组织架构下已经存在这个${value}编码了`)) : callback()
    }
    return {
      // 定义表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      // 校验规则
      rules: {
        name: [{ required: true, trigger: 'blur', message: '部门名称不能为空' },
          { min: 1, max: 50, trigger: 'blur', message: '部门名称长度在1-50个字符' }, {
            trigger: 'blur',
            validator: checkNameRepeat
          }],
        code: [{ required: true, trigger: 'blur', message: '部门编码不能为空' },
          { min: 1, max: 50, trigger: 'blur', message: '部门编码长度在1-50个字符' },
          { trigger: 'blue', validator: checkCodeRepeat }],
        manager: [{ required: true, trigger: 'blur', message: '部门负责人不能为空' }],
        introduce: [{ required: true, trigger: 'blur', message: '部门介绍不能为空' },
          { min: 1, max: 300, trigger: 'blur', message: '部门介绍在1-300个字符' }]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门  '
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 获取详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    },
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          if (this.formData.id) {
            await updateDepartments(this.formData)
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          this.$emit('addDepts') // 触发自定义事件
          this.$emit('update:showDialog', false)
        }
      })
    },
    btnCancel() {
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$refs.deptForm.resetFields()
      this.$emit('update:showDialog', false)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
