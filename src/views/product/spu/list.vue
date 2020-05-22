<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelector @categoryChange="handleCategoryChange"></CategorySelector>
    </el-card>
    <el-card>
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button type="primary"  icon="el-icon-plus" style="margin-bottom: 20px">添加SPU</el-button>
      <el-table
        v-loading="loading"
        :data="spuList"
        border
        stripe>
        <!-- 序号列 -->
        <el-table-column
          label="序号"
          type="index"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column label="SPU名称" prop="spuName">
        </el-table-column>
        <el-table-column label="SPU描述" prop="description">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row, $index}">
            <hint-button title="添加SKU" type="primary" icon="el-icon-plus" size="mini"></hint-button>
            <hint-button title="修改SPU" type="primary" icon="el-icon-edit" size="mini"></hint-button>
            <hint-button title="查看所有SKU" type="info" icon="el-icon-info" size="mini"></hint-button>
            <hint-button title="删除SPU" type="danger" icon="el-icon-delete" size="mini"></hint-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        style="text-align: center; margin-top: 20px;"
        :current-page="page"
        :page-sizes="[3, 6, 9, 12]"
        :page-size="limit"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
      />
    </div>
    </el-card>
  </div>
</template>

<script>
import SpuForm from '../components/SpuForm'
import SkuForm from '../components/SkuForm'
export default {
  name: 'SpuList',

  data () {
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',

      loading: false,
      spuList:[],
      page: 1,
      limit: 3,
      total: 0,

      isShowSpuForm: false, // 是否显示spuFrom界面
      isShowSkuForm: false, // 是否显示skuFrom界面
    }
  },
  methods: {
    /*
      选择新的分类的监听回调
    */
   handleCategoryChange ({categoryId, level}) {
    if (level===1) {
      this.category1Id = categoryId
      this.category2Id = ''
      this.categorydId = ''
      this.spuList = [],
      this.total = 0
    } else if (level===2) {
      this.category2Id = categoryId
      this.category3Id = ''
      this.spuList = [],
      this.total = 0
    } else {
      this.category3Id = categoryId
      // 请求获取分页列表数据
      this.getSpuList()
    }
   },

   /*
    请求指定页码的列表数据 (spuList, total)
   */
    async getSpuList (page=1) {
      this.page = page
      const {limit, category3Id} = this
      const result = await this.$API.spu.getList (page, limit, category3Id)
      if (result.code===200) {
        const {resords, total} = result.data
        this.spuList = resords
        this.total = total
      }
    },

    /*
      当每页数量发生改变时的监听回调
    */
   handleCategoryChange (pageSize) {
     this.limmit = pageSize
     this.getSpuList(1)
   }
  },

  components: {
    SpuForm,
    SkuForm
  }
}
</script>
