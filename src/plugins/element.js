import Vue from 'vue'
// 按需导入组件
import { Button,
         Form,
         FormItem,
         Input,
         Message
       } 
from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

//Message(弹框)有点不一样: 需要挂载到原型上
Vue.prototype.$message = Message
