<!-- TODO treat login errors-->
<template>
  <div class="container-fluid" id="login">
    <div class="col"></div>
    <div class="col">
      <form @submit.prevent="login">
        <div class="form-group">
          <base-input type="text" v-model="username"
           placeholder="Login" />
        </div>
        <div class="form-group">
          <base-input type="password" v-model="passwd"
           leftText="texto"
           placeholder="Password"
          />
        </div>
        <alert v-bind="alert" :hasCloseButton="true"
         @close="alert.show=false">
            {{alert.content}}
        </alert>
        <base-button cssClass="btn-dark btn-block">
          Login
        </base-button>
      </form>
    </div>
    <div class="col">
    </div>
  </div>
</template>
<script>
import alertModel from '@/utils/alertModel';
import BaseInput from '@/components/baseInput';
import BaseButton from '@/components/baseButton';
import Alert from '@/components/Alert';

export default{
  name:'Login',
  components:{BaseInput, BaseButton, Alert},
  data(){
    return{
      username:'',
      passwd:'',
      alert:new alertModel(),
    }
  },
  methods:{
    login(){
      /*Authenticates user, retrieves token and saves it
        to local storage, then goes to home view*/
      this.$store.commit('setShowLoader', true)
      const data = {username:this.username, password:this.passwd}
      this.$http.post(this.$urls.auth.login, data )
        .then(resp=>{
          this.$store.commit('setIsAuthenticated', true)
          this.$http.defaults.headers.common['Authorization']='JWT '+
            resp.data.token
          window.localStorage.setItem('token', resp.data.token)
          this.$router.push({name:'home'})
          this.$store.commit('setShowLoader', false)
        })
        .catch(error=>{
          this.username = ''
          this.passwd = ''
          this.alert.error(error.response.data)
          this.$store.commit('setShowLoader', false)
        })
    }
  }
}
</script>
<style>
form{
  margin-top:20vh;
  margin-left:2%;
}
#login{
  margin-left:0;
  padding-left:0;
  position:absolute;
  height:100%;
  width:100%;
  background:center fixed;
  /*background-image:url("../assets/images/login_bk.jpg");*/
  background-image:linear-gradient(140deg, #345 5%, #1f84db 35%,
      #1fc8db 51%, #2cb5e8 75%);
  background-repeat:no-repeat;
  background-size:cover;
}
</style>
