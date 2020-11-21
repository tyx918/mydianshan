<!--  -->
<template>
  <div>
      <!-- 面包屑导航区 -->
    <el-breadcrumb>
        <!-- 跳转到相应的地址 -->
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <el-alert title="注意！允许三级分类设置相关参数" type = "warning" 
                  :closable = "false" show-icon>
        </el-alert>
        <el-row class="cat_opt">
            <el-col>
                <span>选择商品分类:  </span>
                <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps" 
                             @change="handleChange"  >
                </el-cascader>
            </el-col>
        </el-row>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
            <!-- 动态参数表格 -->
            <el-button type = "primary" size="mini" :disabled = "isBtnDisabled"
            @click="addDialogVisible = true">添加参数</el-button>
            <el-table :data = "manyTableData" border stripe>
                <!-- 展开行 -->
                <el-table-column type = "expand">
                    <template slot-scope="scope">
                        <!-- 循环渲染Tag标签 -->
                        <el-tag closable v-for = "(item,i) in scope.row.attr_vals" :key="i" @close = "handleClose(i,scope.row)">
                            {{ item }}
                        </el-tag>
                        <!-- 输入的文本框  -->
                        <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                                  size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                        </el-input>
                        <!-- 添加的按钮 -->
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                    </template>
                </el-table-column>
                <el-table-column type = "index"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type = "primary" icon = "el-icon-edit" size = "mini"  @click="showEditDialog(scope.row.attr_id)">
                            编辑
                        </el-button>
                        <el-button type = "danger" icon = "el-icon-delete" size = "mini" @click="removeParams(scope.row.attr_id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
            <el-button type = "primary" size="mini" :disabled = "isBtnDisabled"
                       @click="addDialogVisible = true"> 添加属性</el-button>
           <el-table :data = "onlyTableData" border stripe>
                <el-table-column type = "expand">
                    <template slot-scope="scope">
                        <!-- 循环渲染Tag标签 -->
                        <el-tag closable v-for = "(item,i) in scope.row.attr_vals" :key="i" @close = "handleClose(i,scope.row)">
                            {{ item }}
                        </el-tag>
                        <!-- 输入的文本框  -->
                        <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                                  size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                        </el-input>
                        <!-- 添加的按钮 -->
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                    </template>
                </el-table-column>
                <el-table-column type = "index"></el-table-column>
                <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type = "primary" icon = "el-icon-edit" size = "mini"
                                   @click="showEditDialog(scope.row.attr_id)">
                            编辑
                        </el-button>
                        <el-button type = "danger" icon = "el-icon-delete" size = "mini"
                        @click="removeParams(scope.row.attr_id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        </el-tabs>
    </el-card>


    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close = "addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
    </el-dialog>

    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close = "editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'params',
  data () {
    return {
        cateList: [],
        cateProps:{
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
            children: 'children',
            checkStrictly: false,
        },
        selectedCateKeys:[],
        activeName: 'many',
        manyTableData: [],
        onlyTableData: [],
        addDialogVisible: false,
        addForm:{
            attr_name: ''
        },
        addFormRules:{
            attr_name:[{ required: true, message: '请输入参数',trigger: 'blur' }]
        },
        editDialogVisible:false,
        editForm: {},
        editFormRules: {
             attr_name:[{ required: true, message: '请输入参数',trigger: 'blur' }]
        },
    };
  },

  components: {},

  computed: {
      isBtnDisabled() {
          if(this.selectedCateKeys.length !== 3) {
              return true;
          }
          return false;
      },
      cateId() {
          if(this.selectedCateKeys.length ===3 ) {
              return this.selectedCateKeys[2];
          }
          return null;
      },
      titleText() {
          if(this.activeName === 'many') {
              return '动态参数'
          } else {
              return '静态属性'
          }
      }
  },


  created() {
      this.getCateList();
  },

  methods: {
    //   获取商品
     async getCateList() {
        const { data: res} =  await this.$http.get('categories');
        if(res.meta.status !== 200) return this.$message.error('获取失败');
        this.cateList = res.data;
        console.log(this.cateList);
     },

    async getParams() {
         //  console.log(this.selectedCateKeys);
        const { data:res } = await this.$http.get(`categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } });
        if(res.meta.status !== 200)  return this.$message.error('获取参数列表失败');
        
        res.data.forEach(ele => {
            ele.attr_vals = ele.attr_vals?ele.attr_vals.split(' '):[];
            // 控制文本框的显示与隐藏
            ele.inputVisible = false;
            ele.inputValue = '';
        });
        console.log(res.data)
        
        if(this.activeName === 'many') {
            this.manyTableData = res.data;
        }else {
            this.onlyTableData = res.data;
        }
    },

    handleChange() {
        this.getParams();
        this.manyTableData = [];
        this.onlyTableData = [];
     },
     handleTabClick() {
         this.getParams();
     },
     addDialogClosed() {
         this.$refs.addFormRef.resetFields()
     },
    addParams() {
         this.$refs.addFormRef.validate(async valid => {
             if(!valid) return
             const { data:res } = await this.$http.post(`categories/${this.cateId}/attributes`,
             {
                 attr_name: this.addForm.attr_name,
                 attr_sel: this.activeName
             })
             if(res.meta.status !== 200) this.$message.error('创建失败');
             this.$message.success("创建成功");
             this.addDialogVisible = false;
             this.getParams();
         })
     },
     async showEditDialog(attr_id) {
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
            params: { attr_sel: this.activeName }
        });
        if(res.meta.status !== 200) {
            return this.$message.error("请求失败");
        }
        this.editForm = res.data;
        
        this.editDialogVisible = true;
     },
     editDialogClosed() {
         this.$refs.editFormRef.resetFields()
     },
    editParams() {
       
    },
    async removeParams(attr_id) {
        const confirmResult = await this.$confirm('此操作将永久删除该文件，是否继续？','提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).catch(err => err);
        // 用户取消删除操作
        if(confirmResult !== 'confirm') {
            return this.$message.info('已取消删除')
        }

        // 删除的业务逻辑
        const { data:res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`);
        console.log("删除：",res)
        if(res.meta.status !== 200) {
            return  this.$message.error('删除参数失败');
        }
        this.$message.success('删除参数成功!');
        this.getParams();
    },
    handleInputConfirm() {
        console.log('ok');
    },
    showInput(row) {
        row.inputVisible = true;
        // 让文本框自动获得焦点
        // $nextTick:当页面上元素重新渲染之后，才会调用回调函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    handleInputConfirm(row) {
        console.log(row.inputValue);
        if(row.inputValue.trim().length === 0) {
            console.log('++++');
            row.inputValue = '';
            row.inputVisible = false;
            return;
        }
        console.log('----');
        // 输入内容做后续处理
        row.attr_vals.push(row.inputValue.trim());
        row.inputValue = '';
        row.inputVisible = false;
        this.saveAttrVals(row);
    },

    async saveAttrVals(row) {
        // 需要发起请求保存操作
        const { data:res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(' '),
        });
        if(res.meta.status !== 200) return this.$message.error('修改参数须失败');
        this.$message.success('修改参数成功');
    },

    // 删除对应的参数和选项
    handleClose(i,row) {
        row.attr_vals.splice(i,1);
        this.saveAttrVals(row);
    }
  }
}

</script>
<style scoped>
    .cat_opt {
        margin:15px 0;
    }
    
    .input-new-tag {
        width: 120px;
    }
</style>