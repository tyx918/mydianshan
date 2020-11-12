<!--  -->
<template>
  <div class="home">
      <el-container class="home-contain">
          <!-- 头部区域 -->
        <el-header> 
            <div>
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button></el-header>
        <!--  页面主题区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px':'200px'">
                <div class="toggle-button" @click = "toggleCollapse" >|||</div>
                <!-- 侧边栏菜单区域  router表示开启路由模式,index为跳转地址-->
                <el-menu  background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
                          :unique-opened = "true" :collapse = "isCollapse" :collapse-transition = "false"
                          :router = "true" :default-active = "activePath">
                    <!-- 一级菜单 :表示动态绑定  index绑定的值必须为字符串：数字 + 字符 = 字符-->
                    <el-submenu :index = "menu.id+''" v-for = "(menu , index) in menuList" :key="menu.id"> 
                        <template slot="title">
                            <!-- 一级菜单文本区 -->
                            <!-- <i :class = "iconsObj[menu.id]"></i> -->
                            <i :class="iconsObj[menu.id]"></i>
                            <!-- 一级菜单的图标 -->
                            <span>{{menu.authName}}</span>
                        </template>
                        <!--二级菜单 -->
                        <el-menu-item :index = "'/' + item.path" v-for = "(item , index1) in menu.children" 
                                      :key="item.id" @click = "saveNavState('/' + item.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{item.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
      </el-container>
  </div>

</template>

<script>

import {getMenuList} from "network/home"

export default {
  name:'home',
  data () {
    return {
        menuList:[],
        iconsObj:{
            '125':'iconfont icon-ren',
            '103':'iconfont icon-tijikongjian',
            '101':'iconfont icon-shangpin',
            '102':'iconfont icon-danju-tianchong',
            '145':'iconfont icon-baobiao',
        },
        isCollapse: false,
        // 被激活的链接地址
        activePath: '',
    };
  },
  created() {
      this.getMenuList1();
      this.activePath = window.sessionStorage.getItem('activePath');
  },
  components: {},

  computed: {},

  mounted() {},

  methods: {
    /*   退出功能：
     *   1.清除token
     *   2.定向到login的路由
    */
      logout() {
          window.sessionStorage.clear();
          this.$router.push('/login');
      },
      //获取所有的菜单
      async getMenuList1() {
        const {data : res} = await getMenuList();
        if(res.meta.status!==200) return this.$message.error(res.meta.msg);
        this.menuList = res.data;
        //console.log("menuList的值",this.menuList);
      },
    //   点击按钮切换菜单的折叠与展开
      toggleCollapse() {
          this.isCollapse = !this.isCollapse;
      },
    /*  左侧菜单点击高亮:
     * 1. 将值保存到session中
     * 2. 组件被创建的时候就把值给取出来,动态赋值给default-active
     * 3. 在点击的时候就把active赋值过去
    */
    //   保存链接的激活状态
      saveNavState(activePath) {
          window.sessionStorage.setItem('activePath',activePath);
          this.activePath = activePath;
      }
  }
}

</script>
<style scoped lang = "less">
     .home {
         height: 100%;
     }
    .home-contain {
        height: 100%;
    }

    .el-header {
        display: flex;
        justify-content: space-between;
        background-color:#373d41;
        color: #fff;
        align-items: center;
        font-size: 20px;
        padding-left: 0;
    }

    .el-header div {
        display: flex;
        /* 纵向居中对齐 */
        align-items: center;
    }

    .el-aside {
        background-color: #333744;
        /* 由于el-menu的border引起了右边对不齐的情况
        * 去除其border即可
        */
        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #EAEDF1;
    }
    /* 这个指的是每个图标都共有的图标，在预先定义的数据里面  */
    .iconfont {
        margin-right: 10px;
    }

    .toggle-button {
        /* display: flex;
        align-items: center; */
        height: 26px;
        line-height: 26px;
        text-align: center;
        font-size: 14px;
        background-color:silver;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>