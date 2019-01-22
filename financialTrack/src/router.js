import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home.vue'
import Navbar from '@/views/Navbar.vue'
import TransactionForm from '@/views/TransactionForm.vue'

Vue.use(Router)

export default new Router({
    mode:'history',
    routes: [
        {
            path:'/login',
            name:'login',
            components:{
              login:Login,
            }
        },
        {
            path:'/home',
            name:'home',
            components:{
              default:Home,
              navbar:Navbar,
            },
        },
        {
            path:'/transaction/:edit?',
            name:'transaction',
            components:{
              default:TransactionForm,
              navbar:Navbar,
            },
        }


      /*
    {
      path: '/',
      name: 'home',
      component: Home
    },
    */
    ]
})
