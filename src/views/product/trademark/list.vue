<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px" @click="showAdd">添加</el-button>

    <el-table
      stripe
      border
      v-loading="loading"
      :data="trademarks">

      <el-table-column
      align="center"
      label="序号"
      type="index"
      width="80">
      </el-table-column>

      <el-table-column prop="tmName" label="品牌名称"></el-table-column>

      <el-table-column
        label="品牌LOGO">
          <!--
              scope是包含$index和row属性的对象
              $index: 当前行的下标
              row：当前行的数据对象:trademark对象
           -->
           <template slot-scope="{row}">
              <img :src="row.logoUrl" alt="logo" width="100px" height="60px">
           </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button size="small" icon="el-icon-edit" type="warning" @click="showUpdate(row)">修改</el-button>
          <el-button size="small" icon="el-icon-delete" type="danger" @click="showDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="getTrademarks"
      :current-page="page"
      :page-size="limit"
      :page-size="[3, 6, 9, 12]"
      :page-size="limit"
      layout=" prev, page, next, jumper, ->, sizes, total"
      :total="total"
      style="text-align: center;margin-top: 20px"
      >
    </el-pagination>

    <el-dialog :title="form.id ? '更新' : '添加'" :visible.sync="isShowDialog">
      <el-form :model="form" :rules="rules" ref="trademarkForm" style="width: 80%">
        <el-form-item label="品牌名称" :label-width="formLobelWidth" prop="tmName">
          <el-input v-model="form.tmName" autocomplete="off" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="formLobelWidth" prop="logoUrl">
          <el-upload
          :show-file-list="false"
          class="avatar-uploader"
          action="/dev-api/admin/product/fileUpload"
          :on-success="handleLogoSuccess"
          :before-upload="beforeLogoUpload">
          <img v-if="form.logoUrl" :src="from.logoUrl" class="avatar"/>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="isShowDialog = false">取 消</el-button>
          <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'TrademarkList',

    data() {
      return {
        trademarks: [], //当前页的品牌列表
        total: 0, //总数据的量
        page: 1, //当前页码
        limit: 3, //每页最多数量
        loading: false, //是否正在加载中
        isShowDialog: false, //是否显示对话框
        form: {
          tmName: '',  //品牌名称
          logoUrl: '', // logo图片的url
        },
        formLabelWidth:'100px', //from 项左侧标题的宽度

        // 指定验证规则：声明式校检
        rules: {
          tmName: [
            { required: true, message: '请输入品牌名称', trigger: 'change' }, // 输入改变时触发检查
            { min: 2, max:10, message:'长度在 2 到 10 个字符', trigger: 'blur'} // 失去焦点时触发检查
          ],
          logoUrl: [
            { required: true, message: '请上传LOGO图片'}
          ]
        }
      }
    },

    mounted () {
      // 异步获取第一页的数据显示
      this.getTrademarks()
    },

    methods: {
      async getTrademarks (page=1){
        this.page = page
        this.loading = true //发请求前显示loading
        // 发请求
        if (result.code===200) {
          const {records, total} = result.data
          // 更新数据
          this.trademarks = records
          this.total = total
        } else {
          this.$message({ // 请求失败提示
            type:'error',
            message: result.message || '获取品牌列表失败'
          })
        }
      },

      /*
        每页记录数改变的回调
      */

     handleSizeChange (pageSize) {
       // 更新limit
       this.limit = pageSize
       // 重新获取第一页
       this.getTrademarks()
     },
     /*
      显示添加的dialog
      */
     showAdd () {
       // 指定空数据的对象，避免显示前面指定的数据
       this.form = {
         tmName: '',
         logoUrl: '',
       }
       // 显示dialog
       this.isShowDialog = true

        // 此时界面还没有更新，Dialog组件对象还没哟产生 ===> Form组件对象也没有 ==> 直接清除会报错
        // this.$refs.trademarkForm.clearValidate()
        // 等待界面更新之后，才去清除所有字段的错误提示
        this.$nextTick(() => {
          this.$refs.trademarkFrom.clearValidate()
        })
     },
     /*
        显示更新的dialog
     */
    showUpdate (trademark) {
      // 指定要显示的dialog中的品牌数据
      // this.from = tramemark  // 导致列表数据发生变化，列表会自定更新
      this.from = {...trademark}  // 不再是同一个对象，改变from中得tmName,列表中的数据不会也改变
      // 显示dialog
      this.isShowDialog = true
    },

    /*
      显示删除的确认框，确定后删除
    */
    showDelete (trademark) {
      this.$confirm(`确定删除 ${trademark.tmName} 吗？`,'提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(async () => { //点击确定的回调
        //异步请求删除此品牌
        const result = await this.$API.trademark.remove(trademak.id)
        if (result.code===200) {
          this.$message({
            type:'success',
            message:'删除成功'
          })
          // 重新获取第一页数据显示
          // this.getTrademarks(1)
          // 重新获取当前页或者上一页数据显示
          // 删除的是最后页且只有一条数据
          this.getTrademarks(this.trademarks.length===1 ? this.page-1 : this.page)
        } else {
          this.$message({
            type:'error',
            message:'删除失败'
          })
        }
      }).catch(() => { //点击取消的回调
        this.$message({
          type:'info',
          message:'已取消删除'
        })
      })
    },

    /*
      上传logo图片成功的回调函数
      res: response  本质对应的是result, 也就是响应体数据
    */
    handleLogoSuccess(res,file) {
      console.log('handleLogoSuccess',res)
      this.from.logoUrl = res.data

      //清除logoUrl字段所对应的错误提示
      this.$refs.trademarkFrom.clearValidate('logoUrl')
    },

      /*
        在准备发送上传logo图片请求前的回调函数
        如果返回值是false，不提交请求
        作用：用来限制图片文件类型及文件大小
        需求：只能是Jpg/png图片，小于500k
      */
      beforeLogoUpload(file) {
        const isJPG = ['image/jpeg','image/png'].includes(file.type) //是否是jpg/png图片
        const isLt2M = file.size / 1024 < 500   // 小于500k

        // 如果不满足，做相应提示
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式！')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }

        // 只有满足才返回true
        return jsJPG && isLt2M
      },

      /*
        异步更新/添加品牌
      */
     addOrUpdateTrademark () {
       // 进行统一的表单校检
       this.$refs['trademarkFrom'].validate(async (valid) => {
         if (valid) { // 校检通过，发异步ajax请求处理
            const {from} = this
            // 注意：如果from中有id，就是要更新，否则是要添加
            let result
            if (form.id) {
              // 发更新新请求
              result = await this.$API.trademark.updata(this.from)
            } else {
              // 发送加请求
              result = await this.$API.trademark.add(this.from)
            }

            if (result.code===200) {
              // 提示添加成功
              this.$message({
                type:'success',
                message:`${form.id ? '更新' : '添加'}品牌成功`
              })
              // 如果是添加：重新获取第一页分页列表
              // 如果是更新，重新获取当前页的分页列表
              this.getTrademarks(form.id ? this.page : 1)
              // 隐藏对话框
              this.isShowDialog = false
            } else {
              this.$message({
                type:'error',
                message:`${form.id ? '更新' : '添加'}品牌失败`
              })
            }
         }
       })
     }
    }
  }
</script>

<style>
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
