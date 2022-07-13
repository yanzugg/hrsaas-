<template>
  <el-dropdown trigger="click" @command="changeLanguage">
    <div>
      <svg-icon icon-class="language" style="color:#fff;font-size:20px" />

    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="this.$i18n.locale==='zh'" command="zh">中文</el-dropdown-item>
      <el-dropdown-item :disabled="this.$i18n.locale==='en'" command="en">En</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import Cookie from 'js-cookie'
export default {
  components: {
  },
  props: {
  },
  data() {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    changeLanguage(type) {
      // 设置的类型   先写入到cookie
      Cookie.set('language', type) // 写入cookie缓存
      // 改变当前的多语言
      this.$i18n.locale = type // 将当前的多语言类型改成对应的类型
      this.$message.success('切换成功')
    }
  }
}
</script>
<style lang="less" scoped>

</style>
