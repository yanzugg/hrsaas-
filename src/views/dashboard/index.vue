<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <PageTools :show-before="true">
      <!-- 插槽除了slot = "name" 还有v-slot:"name" -->
      <!-- slot='名称' v-slot:'名称' -->
      <template v-slot:before>
        <span>我爱你</span>
      </template>
      <template v-slot:after>
        <el-button type="primary">导入excel</el-button>
      </template>
    </PageTools>
    <ImageUpload />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  components: {

  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
