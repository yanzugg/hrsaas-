<template>
  <div>
    <svg-icon icon-class="fullscreen" style="color:#fff; width: 20px; height: 20px" @click="changeScreen" />
  </div>
</template>
<script>
import ScreenFull from 'screenfull'
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
    changeScreen() {
      if (!ScreenFull.isEnabled) {
        this.$message.warning('全屏不可用')
        return
      }
      ScreenFull.toggle()
    }
  }
}
</script>
<style lang="less" scoped>

</style>
