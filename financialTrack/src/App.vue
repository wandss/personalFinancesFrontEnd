<!--TODO:
  Show Logged User Name at navbar
  Fill First panel with totals at Home view. "Credit - debit"
  Map error responses on form to enlight respective fields.

  Enables enter to update Transaction

  Check chartjs legend options and canvas overflow
    Opt01: Pass height and width = 100% as prop
    to pieChart. When small screen these vules must be 100%


  Associate operation type and users?
  Add verbose name to model fields

  When there's no previous saved expense and operation types,
    select keeps with "Loading"...
  Set line color based on Credit or Debit operation in grid.

  Moves all ajax calls to store.js??(this allows,
      to bind data returned from backend directly
      to store.js)

  Show success message after creating new item??

  Handles datetime fields for mobile devices.
      opt01:detect small screen and instead using
      date validateion, uses browser's date field
      opt02: detect small screen, do not use
      date validation, validate date with moment
      with format DDMMYYYY??

  Create multiselection in grid to allow multi deletion
      Checkbox: Select All

  Look for datepicker libs

  Make Autocomplete for some form fields:
      Estabelecimento and info

  Add More Charts
  Download google fonts
  Create "Model" to base button like Alert?
  Store behaviour from panels at Home view
-->
<template>
  <div>
    <router-view name="login"/>
    <router-view name="navbar" />
    <div class="container-fluid">
      <loader />
      <router-view />
    </div>
  </div>
</template>

<script>
import Loader from '@/components/Loader'
export default{
  name:'App',
  components:{Loader},
  created(){
    /*Case there's no token in storage, sends user to login view*/

    this.$store.commit('setSmallScreen', window.innerWidth)
    if(!window.localStorage.getItem('token')){
      this.$router.push({name:'login'})
    }
    else{
      this.$http.defaults.headers.common['Authorization']='JWT '+
          window.localStorage.getItem('token')
      this.$router.push({name:'home'})
    }
    this.$store.commit('setShowLoader', false)
  },
}
</script>
<style>
@import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
@import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';

</style>
