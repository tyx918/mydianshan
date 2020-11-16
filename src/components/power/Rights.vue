<!--  -->
<template>
  <div>
      <!-- 面包屑导航 -->
    <el-breadcrumb>
        <!-- 跳转到相应的地址 -->
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-table :data="rightsList" style="width: 100%"  border stripe>
            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column prop="authName" label="权限名称" width="180">
            </el-table-column>
            <el-table-column prop="path" label="路径" width="180">
            </el-table-column>
            <el-table-column prop="level" label="权限等级">
                <template slot-scope = "scope">
                    <!-- 必须用.row来获取所有的值 -->
                    <el-tag v-if = "scope.row.level === '0'">一级权限</el-tag>
                    <el-tag type = "success" v-else-if= "scope.row.level === '1'">二级权限</el-tag>
                    <el-tag type = "warning" v-else= "scope.row.level === '2'">三级权限</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "network/compoApi/rights"

export default {
  name:'rights',
  data () {
    return {
        // 所有的权限列表
        rightsList: [],
    };
  },

  created() {
       this.getRightsList();
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
      async getRightsList() {
        const { data:res } = await getRightsList('rights/list');
        if(res.meta.status !== 200) return this.$message.error('请求权限列表失败');
        this.rightsList = res.data;
        console.log(this.rightsList);
      }
  }
}

</script>
<style scoped>
</style>