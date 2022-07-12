<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width:120px" @change="dataChange">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width:120px;margin-left: 10px;" @change="dataChange">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </el-row>
    <!-- 放置日历组件 -->
    <el-calendar v-model="currentDate">
      <!-- <template slot="dateCell"> -->
      <template v-slot:dateCell="{data,date}">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>
<script>
export default {
  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  components: {
  },
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      yearList: [],
      currentYear: null, // 当前年份
      currentMonth: null,
      currentDate: null
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    // 获取当前的年份
    this.currentYear = this.startDate.getFullYear() // 得到当前的年份
    this.currentMonth = this.startDate.getMonth() + 1
    // 快速生成数组的方法
    this.yearList = Array.from(Array(11), (v, i) => this.currentYear + i - 5)
    this.dataChange()
  },
  mounted() {
  },
  methods: {
    dataChange() {
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`)
    },
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>
<style  scoped>
 /deep/ .el-calendar-day {
  height:  auto;
 }
 /deep/ .el-calendar-table__row td,/deep/ .el-calendar-table tr td:first-child,  /deep/ .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 /deep/ .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 /deep/ .el-calendar__header {
   display: none
 }
</style>
