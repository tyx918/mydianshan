<!--  -->
<template>
  <div>
      <!-- 面包屑导航区 -->
    <el-breadcrumb>
        <!-- 跳转到相应的地址 -->
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            </el-col>
        </el-row>

        <!-- 表格 -->
        <tree-table :data = "cartList" :columns = "columns"  class="tree_table"
                    :selection-type = "false" :expand-type = "false" show-index 
                    index-text = "#" border :show-row-hover = "false">
            <!-- 是否有效 -->
            <template slot="isOk" slot-scope="scope">
                <i class="el-icon-circle-check" style="color:lightgreen" v-if="scope.row.cat_delete === false"></i>
                <i class="el-icon-circle-close" style="color:red"  v-else></i>
            </template>
            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
                <el-tag size = "mini" v-if = "scope.row.cat_level === 0">一级</el-tag>
                <el-tag size = "mini" v-else-if = "scope.row.cat_level === 1" type = "success">二级</el-tag>
                <el-tag size = "mini" v-else = "scope.row.cat_level === 2" type = "warning">三级</el-tag>
            </template>
            <!-- 操作 -->
            <template slot="opt" slot-scope="scope">
               <el-button type="primary" size = "mini" icon = "el-icon-edit">编辑</el-button>
               <el-button type="danger"  size = "mini" icon = "el-icon-delete">删除</el-button>
            </template>
        </tree-table>

        <!-- 分页区 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querInfo.pagenum"
                       :page-sizes="[3, 5, 10, 15]" :page-size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
    </el-card>  
    <!-- 添加分类的对话框  -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%"
               @close = "addCateDialogClosed">
        <!-- 添加分类的表单 -->
        <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" 
                 label-width="100px" >
            <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级名称：" prop="cat_name">
                <!-- options指定数据源 -->
                <el-cascader v-model="selectedKeys" :options="parentCateList" @change="parentCateChange"
                             :props="cascaderProps" clearable >    
                </el-cascader>
            </el-form-item>
        </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false" >取 消</el-button>
            <el-button type="primary"  @click="addCate">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>

import {
    getCateData,
    getParentCateList,
    addCateData,
}
from "network/compoApi/cate"

export default {
  name:'cate',
  data () {
    return {
        // 商品分类的数据列表
        cartList:[],
        // 查询条件
        querInfo:{
            type: 3,
            pagenum: 1,
            pagesize: 5,
        },
        // 总数据条数
        total:0,
        // 为table指定列的定义
        columns:[
            {
                label: '分类名称',
                prop: 'cat_name',
            },
            {
               label: '是否有效',

               type: 'template',
               template: 'isOk'
            },
            {
               label: '排序',
               type: 'template',
               template: 'order'
            },
            {
               label: '操作',
               type: 'template',
               template: 'opt'
            }
        ],
        // 控制添加分类对话框的显示与隐藏
        addCateDialogVisible:false,
        // 添加分类的表单对象
        addCateForm:{
            cat_name: '',
            cat_pid: 0,
            cat_level: 0,
        },
        addCateFormRules:{
            cat_name: [
                { required: true,message: '请输入分类名称',trigger: 'blur' }
            ],
        },
        parentCateList: [],
        cascaderProps: {
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
            children: 'children',
            checkStrictly: true,
        },
        selectedKeys: [],
    };
  },

  created(){
      this.getCateList();
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {
    async getCateList() {
        const { data:res } = await getCateData('categories',this.querInfo);
        if(res.meta.status !== 200) return this.$message.error("获取商品分类失败");
        this.cartList = res.data.result;
        this.total = res.data.total;
    },
    handleSizeChange(newSize) {
        this.querInfo.pagesize = newSize;
        this.getCateList();
    },
    handleCurrentChange(newPage) {
        this.querInfo.pagenum = newPage;
        this.getCateList();
    },
    showAddCateDialog() {
        this.getParentCateList();
        this.addCateDialogVisible = true;
    },
    async getParentCateList() {
        const { data:res } = await getParentCateList('categories',{type:2});
        if(res.meta.status!==200) return this.$message.error("获取父级分类数据失败");
        this.parentCateList = res.data;
    },
    parentCateChange() {
        if(this.selectedKeys.length > 0) {
            //父级分类的id
            this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
            this.addCateForm.cat_level = this.selectedKeys.length;
        }else {
            this.addCateForm.cat_pid = 0;
            this.addCateForm.cat_level = 0;
        }
    },
    addCate() {
        this.$refs.addCateFormRef.validate(async valid => {
            if(!valid) return
            const { data:res } = await addCateData('categories',this.addCateForm);
            if(res.meta.status !== 201) return this.$message.error('添加商品分类失败')
            this.$message.success('添加商品分类成功');
            this.getCateList();
            this.addCateDialogVisible = false;
        })
    },
    addCateDialogClosed() {
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
    }
  }
}

</script>
<style scoped>
    .tree_table {
        margin-top: 20px;
    }

    .el-cascader {
        width: 100%;
    }
</style>