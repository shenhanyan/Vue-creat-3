<template>
  <!-- 查询结果 -->
  <el-form :inline="true" :model="cFrom" class="demo-form-inline">
    <!-- 一级分类 -->
    <el-form-item label="一级分类">
      <el-select v-model="cFrom.category1Id" placeholder="选择一级分类" @change="handleChange1">
        <el-option :label="c.name" :value="c.id" v-for="c in category1List" :key="c.id"></el-option>
      </el-select>
    </el-form-item>

    <!-- 二级分类 -->
    <el-form-item label="二级分类">
      <el-select v-model="cFrom.category2Id" placeholder="选择二级分类" @change="handleChange2">
        <el-option :label="c.name" :value="c.id" v-for="c in category2List" :key="c.id"></el-option>
      </el-select>
    </el-form-item>

    <!-- 二级分类 -->
    <el-form-item label="三级分类">
      <el-select v-model="cFrom.category3Id" placeholder="选择三级分类" @change="handleChange3">
        <el-option :label="c.name" :value="c.id" v-for="c in category3List" :key="c.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "CategorySelector",

  data() {
    return {
      cFrom: {
        category1Id: "",
        category2Id: "",
        category3Id: ""
      },
      category1List: [], //一级分类列表
      category2List: [], //二级分类列表
      category3List: [] //三级分类列表
    };
  },

  mounted() {
    this.getCategory1List();
  },

  methods: {
    /*
     获取一级列表显示
     */
    async getCategory1List() {
      const result = await this.$API.category.getCategorys1();
      this.category1List = result.data;
    },
    /*
    处理选中一级分类项的监听回调 ==> 获取二级分类列表显示
     */
    async handleChange1(category1Id) {
      // 重置二级与三级分类相关数据
      this.cFrom.category2Id = ''
      this.cFrom.category3Id = ''
      this.category1List = [];
      this.category2List = [];

      // 分发事件，通知父组件
      this.$emit("categoryChange", { categoryId: category1Id, level: 1 });

      // 获取二级列表
      const result = await this.$API.category.getCategorys2(category1Id);
      this.category2List = result.data;
    },

    /*
      处理选中二级分类项的监听回调 ==> 获取三级分类列表显示
    */

    async handleChange2(category2Id) {
      // 重置三级列表相关数据
      this.cFrom.category3Id = ''
      this.category3List = []

      // 分发事件，通知父组件
      this.$emit("categoryChange", { categoryId: category2Id, level: 2 });

      // 异步获取三级列表数据
      const result = await this.$API.category.getCategorys3(category2Id);
      this.category3List = result.data;
    },
    /*
      处理选中三级分类项的监听回调
    */
    handleChange3(category3Id) {
      this.$emit("categoryChange", { categoryId: category3Id, level: 3 });
    }
  }
};
</script>

