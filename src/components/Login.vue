<!-- Login -->
<template>
  <div id = "login">
      <div class="login_box">
          <!-- 头像区域 -->
          <div class="avatar_box">
              <img src="~assets/logo.png" alt="">
          </div>
          <!-- 登录页面用表单来做 表单区域 -->
          <el-form ref = "loginFormRef" :model = "loginForm" label-width="0" class="login_form" :rules = "loginFormRules">
              <!-- 用户名 -->
            <el-form-item prop = "username">
                <el-input v-model = "loginForm.username" prefix-icon="iconfont icon-ren"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop = "password">
                <el-input v-model = "loginForm.password" type = "password" prefix-icon="iconfont icon-suo"></el-input>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item class = "btns">
                <el-button type="primary" enabled @click = "login">登录</el-button>
                <el-button type="info" enabled @click = " resetLoginForm">重置</el-button>
            </el-form-item>
          </el-form>
      </div>
  </div>
</template>

<script>

import { getLoginData, } from "network/compoApi/login"

export default {
  name: 'login',
  data () {
    return {
        //登录信息
        loginForm:{
            username:'admin',
            password:'123456',
        },
        // 表单的验证规则对象
        loginFormRules :{
            // 验证用户名是否合法
            username:[            
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            //验证密码是否合法
            password:[
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 15, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ]
        }

    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    //   getLoginData() {
    //     getLoginData().then(res => {
    //       //数组的解构
    //       console.log(res);
    //       return  res;
    //    }).catch(err => {
    //       console.log(err);
    //    })
    //   },
    //   点击重置按钮
      resetLoginForm(){
        //   通过打印this可以查看其this指向以及其中的属性和方法
        //   console.log(this);
          this.$refs.loginFormRef.resetFields();//重置表单
      },
    //   表单登录之前的预验证
    //await必须存在于async修饰的函数中
      login() {
          //预验证
          this.$refs.loginFormRef.validate(async validate => {
              if(!validate) return;
              const {data : res} = await getLoginData('/login',this.loginForm); //返回一个promise
              if(res.meta.status !== 200) return this.$message.error("登录失败");;
              this.$message.success("登录成功");
              console.log(res);
              //将token保存到Storage,
              window.sessionStorage.setItem("token",res.data.token);
              //路由转到/home页面
              this.$router.push("/home");
          })
      },
  }
}

</script>
<style scoped >
    #login {
        margin: auto auto;
        font-size: 14px;
        text-align: center;
        height: 100%;
        background-color: rosybrown;
    }

    .login_box {
        /* 将盒子放到页面的中间 */
        position: relative;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 500px;
        height: 340px;
        border-radius: 8px;
        background-color: #fff;
    }

    .avatar_box {
        /* 利用定位实现盒子居中 */
        position: absolute;
        /* 父盒子 */
        left: 50%;
        /* 根据自身盒子*/
        transform: translate(-50%,-50%);
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 5px;
        box-shadow: 0 0 10px #ddd;
        background-color: #eee;
    }

    .avatar_box img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }

    .login_form {
        position: absolute;
        bottom:0;
        width: 100%;
        padding: 0 20px;
        /* 不包含padding和border */
        box-sizing: border-box;
    }

</style>