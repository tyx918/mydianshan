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
        <el-card>
            <!-- 添加角色列表区 -->
            <el-row>
                <el-col>
                    <el-button type = "primary">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="rolesList" style="width: 100%"  border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class = "['bdbottom',index === 0 ? 'bdtop': '']" v-for = "(content,index) in scope.row.children" 
                                :key = "content.id" class = "vcenter" >
                            <el-col :span = "5">
                                <el-tag closable @close = "removeRightId(scope.row,content.id)">{{content.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span = "19">
                                <el-row  :class = "[index1 === 0?'':'bdtop']" v-for = "(content1,index1) in content.children" 
                                         :key = "content1.id" class = "vcenter">
                                    <el-col :span = "6">
                                        <el-tag type = "success" closable @close = "removeRightId(scope.row,content1.id)">{{content1.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span = "18">
                                        <el-tag type = "warning" v-for = "(content2,index2) in content1.children" 
                                                :key = "content2.id" closable @close = "removeRightId(scope.row,content2.id)">
                                            {{ content2.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="roleName" label="角色名称" width="180">
                </el-table-column>
                <el-table-column prop="roleDesc" label="角色描述" width="180">
                </el-table-column>
                <el-table-column  label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size = "mini" icon = "el-icon-edit">编辑</el-button>
                        <el-button type="danger"  size = "mini" icon = "el-icon-delete">删除</el-button>
                        <el-button type="warning" size = "mini" icon = "el-icon-setting" @click = "showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close = "setRightDialogClosed">
            <!-- 树形空间 -->
            <el-tree :data="rightsList" show-checkbox :props="treeProps" node-key = "id" default-expand-all 
                     :default-checked-keys = "defKeys" ref = "treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>    
    </div>
</template>

<script>

import { getRolesList,deleteRolesRight,getRolesData,authRoles } from "network/compoApi/roles"

export default {
  name:'roles',
  data () {
    return {
        // 所有角色列表数据
        rolesList:[],
        //控制对话权限对话框的显示与隐藏
        setRightDialogVisible:false,
        // 所有权限数据
        rightsList:[],
        // 树形控件
        treeProps:{
            label:'authName',
            children:'children'
        },
        // 默认选中数组
        defKeys: [],
        // 当前即将分配权限的角色id
        roleId: ''
    };
  },

  created() {
      this.getRolesList()
  },

  components: {

  },

  computed: {

  },

  mounted() {

  },

  methods: {
    //   获取角色列表
      async getRolesList() {
          const { data:res } = await getRolesList('roles');
          if(res.meta.status !== 200) return this.$message.error('请求权限列表失败');
          this.rolesList = res.data;
          console.log(res.data);
      },

      async removeRightId(role,rightId) {
        //   弹框用户是否删除,confirm的返回值是promise
        const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch((err) => err);
        if(confirmRes !== "confirm") {
            return this.$message.info("取消了用户删除");
        }
        const { data: res } = await deleteRolesRight(`roles/${role.id}/rights/${rightId}`);
        if(res.meta.status !== 200) {
            return this.$message.error("删除数据失败");
        }
        role.children = res.data;
        //this.getRolesList();//重新获取列表,会出现表格重新合上的问题
      },
    //   展示分配权限的对话框
      async showSetRightDialog(role) {
        this.roleId = role.id;
        //   获取所有权限数据
        const { data:res } = await getRolesData(`rights/tree`);
        if(res.meta.status !== 200) return this.$message.error('获取权限列表数据失败');
        // 获取到的权限数据保存到数组中
        this.rightsList = res.data;
        //console.log(this.rightsList);
        this.getLeafKeys(role,this.defKeys);
        this.setRightDialogVisible = true;
      },
    //  通过递归的形式获取角色下所有三级权限的id 
      getLeafKeys(node , arr) {
          if(!node.children) {
              return arr.push(node.id)
          }
          node.children.forEach(item => {
              this.getLeafKeys(item,arr);
          });
      },
    //   关闭设置权限对话框
      setRightDialogClosed() {
        //   将存储的id清空，防止id重复累加
          this.defKeys = [];
      },
    //   分配权限的函数
      async allotRights() {
          const keys = [...this.$refs.treeRef.
                        getCheckedKeys(),
                        ...this.$refs.treeRef.
                        getHalfCheckedKeys()];
          const idStr = keys.join(',');
          const { data:res } = await authRoles(`roles/${this.roleId}/rights`,{ rids:idStr });
          console.log(res);
          if(res.meta.status !== 200) {return this.$message.error('授权用户权限失败');}
          this.$message.success('成功');
          this.getRolesList();
          this.setRightDialogVisible = false;
      }
  }
}

</script>
<style scoped>
    .el-tag {
        margin:  0 10px 0 0;
    }

    .el-row {
        padding: 5px 0;
    }
    /* 垂直居中 */
    .vcenter {
        display: flex;
        align-items: center;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee
    }
</style>