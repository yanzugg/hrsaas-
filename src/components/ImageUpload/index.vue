<template>
  <div>
    <!-- 给action一个#号，就不会报错了 -->
    <!-- file-list是上传的文件列表 可以绑定到上传组件上，让上传组件来显示 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :file-list="fileList"
      :class="{disabled:fileComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="图片预览" :visible.sync="showDialog">
      <img :src="imgUrl" alt="" style="width:100%">
    </el-dialog>
    <el-progress v-if="showPercent" style="width:180px" :percentage="percent" />
  </div>

</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云cos包
const cos = new COS({
  SecretId: 'AKIDPdbIitoSpwmLtCFwRfeMozEH3YmkRr0u',
  SecretKey: 'f4B1g4B0Zrsb3E8l9H9k48vRgdJiqhHa'
})
export default {
  data() {
    return {
      percent: 0,
      imgUrl: '',
      showPercent: false,
      showDialog: false,
      fileList: [],
      currentFileUid: null // 记录当前正在上传的uid
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览事件
    preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file是要删除的文件
    // fileList是删过之后的文件
    handleRemove(file, fileList) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid) // 将当前的删除文件排除在外
      // this.fileList = fileList
    },
    changeFile(file, fileList) {
      // file是当前的文件，fileList是当前的最新数组this.fileList
      // console.log(file)
      // console.log(fileList)
      // 如果当前fileList中没有该文件的话，就往里进行追加
      this.fileList = fileList.map(item => item)
      // 这里为何暂时不成功 ？ 因为现在还没有上传 所以第二次进来的数据 一定是个空
      // 如果完成了上传动作，第一次进入和第二次的fileList长度都是1 应该有数据
    },
    beforeUpload(file) {
      // 检查图片格式
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查图片大小
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.showPercent = true
      // 已经确定当前上传的就是当前的file
      this.currentFileUid = file.uid
      return true
    },
    // 进行上传操作
    upload(params) {
      if (params.file) {
        cos.putObject({
          Bucket: 'zengjiahang-1302410251', // 存储桶
          Region: 'ap-guangzhou', // 地域
          Key: params.file.name, // 文件名
          StorageClass: 'STANDARD', // 上传的模式类型，直接默认标准模式
          Body: params.file, // 要上传的文件对象
          onProgress: params => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          // console.log(err || data)
          // data中有一个statusCode ===200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
          // 此时说明文件上传成功  要获取成功的返回地址
          // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
          // 目前虽然是一张图片，但是注意 我们的fileList是一个数组
          // 需要知道上传成功的是哪一张
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存 => 图片有大有小 => 上传速度有快有慢 =>要根据有没有upload这个标记来决定是否去保存
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
