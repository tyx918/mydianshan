<!--  -->
<template>
  <div>
      <!-- 面包屑导航区 -->
    <el-breadcrumb>
        <!-- 跳转到相应的地址 -->
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 会出现一个卡片样的视图-->
    <el-card class="box-card">
        <!-- layout布局：1列分为24份
           el-row表示行，gutter表示每列的间隔
           :span:表示每列占的多少列
        -->
        <el-row :gutter = "20">
            <el-col :span = "8">
                <el-input placeholder="请输入内容" :clearable = "true" @clear = "getUserList" v-model="queryInfo.query">
                    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
            <el-col :span = "4">
                 <el-button type="success" @click="addDialogVisible = true">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 用户列表区 -->
        <el-table :data = "userList" border stripe>
            <!-- 添加索引列 -->
          <el-table-column type = "index"></el-table-column>
          <el-table-column label="姓名" prop="username"  width="180"></el-table-column>
          <el-table-column label="邮箱" prop="email"     width="180"></el-table-column>
          <el-table-column label="电话" prop="mobile"    width="180"></el-table-column>
          <el-table-column label="角色" prop="role_name" width="180"></el-table-column>
          <el-table-column label="状态" width="180">
              <!-- 通过作用插槽接收父组件的数据,并且会覆盖 prop(可以删除) -->
              <template slot-scope="scope">
                  <el-switch v-model = "scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
              </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-tooltip content="修改信息" placement="top"  :enterable = "false">
                    <!-- 修改按钮 -->
                    <el-button type="primary" icon="el-icon-edit" @click = "showEditDialog(scope.row.id)" size = "mini" ></el-button>
                </el-tooltip>
                <el-tooltip content="删除操作" placement="top" :enterable = "false">
                    <!-- 删除按钮 -->
                    <el-button type="danger" icon="el-icon-delete" size = "mini" @click="removeUserById(scope.row.id)"></el-button>
                </el-tooltip>
                <el-tooltip content="分配角色" placement="top" :enterable = "false">
                    <!-- 分配角色按钮 -->
                    <el-button type="warning" icon="el-icon-setting" size = "mini" 
                               @click="setRole(scope.row)"></el-button> 
                </el-tooltip> 
              </template>
          </el-table-column>
        </el-table>
        <!-- 分页区 -->
        <el-pagination
            @size-change = "handleSizeChange"
            @current-change = "handleCurrentChange"
            :current-page = "queryInfo.pagenum"
            :page-sizes = "[1, 2, 5, 10]"
            :page-size = "queryInfo.pagesize"
            layout = "total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主题区 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
            
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click ="addDialogVisible  = false">取 消</el-button>
            <el-button type="primary" @click="addUser" >确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @click="editDialogClosed">
        <!-- 内容主题区 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item> 
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" ></el-input>
          </el-form-item> 
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile" ></el-input>
          </el-form-item>  
        </el-form>           
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click ="editDialogVisible  = false">取 消</el-button>
            <el-button type="primary"  @click="editUserInfo">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色" :visible.sync="setRoleDialogVisible" width="50%">
      <div>
          <p>当前的用户：{{userInfo.username}}</p>
          <p>当前的用户：{{userInfo.role_name}}</p>
          <p>分配新角色:
             <el-select v-model="selectedRoleId" placeholder="请选择">
                <el-option v-for="item in rolesList" :key="item.id"
                           :label="item.roleName"  :value="item.id">
                </el-option>
             </el-select>   
          </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { 
         getUserData,
         putUserState,
         putUserData,
         changeUserData,
         putChangeUserData,
         deleteUser,
         getAllUser,
         allotRole,
        } 
from "network/compoApi/user"
import LoginVue from '../Login.vue'

export default {
  name:'users',
  data () {
    var checkEmail = (rule,value,cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            
        if(regEmail.test(value)) {
            return cb;
        }
        cb(new Error('请输入合法的邮箱'))
    }
    // 
    var checkMobile = (rule,value,cb) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if(regMobile.test(value)) {
            return cb()
        }
        
        cb(new Error('请输入合法的手机号'))
    }

    return {
        queryInfo: {
            query: '',
            // 当前的页数
            pagenum: 1,
           // 每页多少条数据
            pagesize: 2,
        },
        userList: [],
        total: 0,
        // 控制用户对话框的显示与隐藏
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
            username: '',
            password: '',
            email: '',
            mobile: '',
        },
        addFormRules: {
            username: [
                { required: true, message: '请输入用户名',trigger: 'blur' },
                { min: 3, max: 10,message: '用户名的长度在3~10个字符之间',trigger: 'blur'}
            ],
            password: [
                { required: true, message: '请输入密码',trigger: 'blur' },
                { min: 6, max: 15,message: '密码的长度在6~15个字符之间',trigger: 'blur'}
            ], 
            email: [
                { required: true, message: '请输入邮箱',trigger: 'blur' },
                { min: 10, max: 15,message: '邮箱的长度在10~15个字符之间',trigger: 'blur'},
                //{ validator: checkEmail , trigger: 'blur'} 
            ], 
            mobile: [
                { required: true, message: '请输入手机',trigger: 'blur' },
                { min: 11, max: 11,message: '手机的长度11',trigger: 'blur'},
                //{ validator: checkMobile , trigger: 'blur'}
            ],          
        },
        // 修改用户框的布尔值
        editDialogVisible: false,
        // 保存用户信息
        editForm: {},
        editFormRules:{
            email:[
                { required: true, message: '请输入邮箱',trigger: 'blur' },
                //{ validator: checkEmail , trigger: 'blur'} 
            ],
            mobile:[
                { required: true, message: '请输入用户手机',trigger: 'blur' },
                //{ validator: checkEmail , trigger: 'blur'} 
            ]
        },
        //控制分配角色对话框的显示与隐藏
        setRoleDialogVisible:false,
        //需要被分配角色的用户信息
        userInfo:{},
        // 所有角色数据列表
        rolesList: [],
        // 已选中的角色ID值
        selectedRoleId:'',
    };
  },

  created() {
      this.getUserList();
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
      async getUserList() {
        const {data:res} = await getUserData('/users',this.queryInfo);
        if(res.meta.status !==200 ) return this.$message.error("获取用户列表失败");
        this.userList = res.data.users;
        this.total = res.data.total;
      },

      //监听pagesize改变事件   
      handleSizeChange(newSize) {
          this.queryInfo.pagesize = newSize;
          this.getUserList();//重新获取数据
      },

      // 监听当前页码改变  
      handleCurrentChange(newPage) {
           this.queryInfo.pagenum = newPage;
           this.getUserList();//重新获取数据
      },          
    //   监听开关状态的改变
      async userStateChange(userInfo){
        const { data:res }  =  await putUserState(`users/${userInfo.id}/state/${userInfo.mg_state}`,userInfo);//向数据库发送修改请求
        if(res.meta.status !== 200) {
            userInfo.mg_state = !userInfo.mg_state;
            return this.$message.error('更新用户数据失败');
        }
        this.$message.success('更新用户状态成功');
      },
      addDialogClosed() {
          this.$refs.addFormRef.resetFields();
      },
      addUser() {
          console.log("----");
          this.$refs.addFormRef.validate(async valid => {
              if(!valid)  return;
            //   发起网络清求
              const { data:res }= await putUserData('users',this.addForm);
              if(res.meta.status !== 201) {
                  this.$message.error("添加用户失败");
            }
            this.addDialogVisible = false;
            this.getUserList();
          })
      },
    //   展示用户修改的对话框
     async showEditDialog(id) {
          console.log(`user/${id}`);
          const { data:res } =  await changeUserData(`users/${id}`);
          console.log(res);
          if(res.meta.status !== 200)  return this.$message.error("查询用户信息失败");
          this.editForm = res.data;
          this.editDialogVisible = true;
      },
    //   监听修改用户对话框的关闭事件
      editDialogClosed() {
          console.log("closed");
          this.$refs.editFormRef.resetFields()
      },
      editUserInfo() {
          this.$refs.editFormRef.validate(async valid => {
              if(!valid) return;
            //   发起修改用户信息请求
              const { data:res } = await putChangeUserData('users/' + this.editForm.id,{
                  email: this.editForm.email,
                  mobile: this.editForm.mobile
              });
              if(res.meta.status !== 200) {
                  return this.$message.error('修改用户信息失败');
              }
              //关闭对话框
              this.editDialogVisible = false;
              //刷新用户列表
              this.getUserList()
              //提示修改成功
              this.$message.success('修改用户信息成功')
          }) 
      },
    //   根据id删除用户
      async removeUserById(id) {
        //   询问用户是否删除数据
        const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'}).catch(err => err)
        if(confirmResult != 'confirm') {
            return this.$message.info('已经取消删除');
        }
        const { data : res } = await deleteUser(`users/${id}`);
        if(res.meta.status !== 200) {
            return this.$message.error('删除用户信息失败');
        }
        this.$message.success('删除用户成功');
        this.getUserList();
      },
      async setRole(userInfo) {
          this.userInfo = userInfo;

        //  在展示对话框之前，获取所有角色列表
          const { data:res } = await getAllUser('roles');
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error("获取角色列表失败");
          this.rolesList = res.data;

          this.setRoleDialogVisible = true;
      },
      async saveRoleInfo() {
          if(!this.selectedRoleId) {
              return this.$message.error('请分配角色');
          }
          const { data:res } = await allotRole(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId});
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error("更新角色失败");
          this.$message.success("更新角色成功");
          this.getUserList();
          this.setRoleDialogVisible = false;
      }
  }
}

</script>
<style scoped lang = "less">

</style>