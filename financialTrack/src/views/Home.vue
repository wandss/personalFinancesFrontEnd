<template>
  <div class="container">
    <main-menu :show="showMenu" @close="showMenu=!showMenu"
     :menuItems="mainMenu" @click="mainMenuSelection($event)"
     title="Transactions Dates"
     />
    <div class="row">
      <div class="col">
        <transition name="iconify">
          <base-button cssClass="btn-white"
           @click="showMenu=!showMenu"
           icon="fa fa-calendar-alt"
          >
              Dates
          </base-button>
        </transition>
        <transition name="iconify">
          <base-button cssClass="btn-info"
           @click="totalPannel=!totalPannel"
           icon="fa fa-book" v-if="!totalPannel"
          >
              Summary
          </base-button>
        </transition>
        <transition name="iconify">
          <base-button cssClass="btn-dark"
           @click="chartCard=!chartCard"
           icon="fa fa-chart-pie" v-if="!chartCard"
          >
              Chart
          </base-button>
        </transition>
        <transition name="iconify">
          <base-button cssClass="btn-primary"
           @click="pannel=!pannel"
           icon="fa fa-money-bill" v-if="!pannel"
          >
              Transactions
          </base-button>
        </transition>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <card header="Totals" @close="totalPannel=false" :show="totalPannel"
          cssClass="info" :hasCloseBtn="true">
          <div slot="content">
              <grid :gridData="summary" />
          </div>
        </card>
        <div v-if="!$store.state.smallScreen">
          <card header="This Month Chart" @close="chartCard=false" :show="chartCard"
           :hasCloseBtn="true" cssClass="dark">
            <div slot="content" class="row">
              <div class="col"></div>
              <div class="col-12">
                <base-button cssClass="btn btn-outline-secondary btn-sm"
                @click="pieChartLegends=!pieChartLegends">
                    Toggle Legends
                </base-button>
                <pie-chart title="" :chartData="pieChart" :showLegend="pieChartLegends"
                legendPosition='left' />
              </div>
              <div class="col"></div>
            </div>
          </card>
        </div>
        <div v-else style="height:100vh, position:absolute">
          <modal title="Chart" :show="chartCard" @click="chartCard=false"
          modalSize="modal-lg">
            <div slot="body">
              <pie-chart title="" :chartData="pieChart" :showLegend="pieChartLegends"
              legendPosition='bottom' />
            </div>
          </modal>
        </div>
        <card :header="transactionCardHeader" @close="pannel=false" :show="pannel"
          cssClass="primary" :hasCloseBtn="true">
          <div slot="content">
            <base-button cssClass="btn-primary" icon="fa fa-plus"
             @click="$router.push({name:'transaction'})"   >
              New
            </base-button>
            <grid v-if="gridData.length>0" :gridData="gridData" :gridConfig="gridConfig"
             :hasSearchField="true" :actions="gridActions"
             @click="handleGridClick"
            />
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
import BaseButton from '@/components/baseButton.vue';
import Card from "@/components/card.vue";
import Grid from "@/components/Grid.vue";
import MainMenu from '@/views/MainMenu.vue';
import PieChart from '@/components/charts/PieChart.vue';
import Modal from '@/components/Modal.vue';

export default {
  name:'Home',
  components:{Card, Grid, BaseButton, MainMenu, PieChart, Modal},
  data(){
    return{
      pannel:true,
      chartCard:false,
      totalPannel:false,
      showMenu:false,
      transactionCardHeader:'Transactions',
      gridData:[],
      gridConfig:[
        {id:'id',colName:'id', hidden:true},
        {id:'info',colName:'Info', hidden:true},
        {id:'parcels',colName:'Info', hidden:true},
        {id:'expense',colName:'Info', hidden:true},
        {id:'operation_type',colName:'Info', hidden:true},
        {id:'operation_type_label',colName:'Operation Type', hidden:false},
        {id:'expense_label',colName:'Expense', hidden:true},
        {id:'amount',colName:'Value', hidden:false},
        {id:'dt_transaction',colName:'Date', hidden:false},
        {id:'estabelecimento',colName:'Establishment', hidden:false},
      ],
      gridActions:[
        {title:'Edit', icon:'fa fa-edit', event:function edit(){}},
      ],
      pieChartLegends:true,
      mainMenu:[],
      /*
      accordion:[
        {title:'First', hiddenContent:'first content', isHidden:true},
        {title:'Second', hiddenContent:'second content', isHidden:true},
        {title:'Third', hiddenContent:'third content', isHidden:true},
      ]
      */
    }
  },
  computed:{
    pieChart(){
      /*Reduce data displayed in grid and creates a array with objects
        to be ploted in chart.*/
      /*
      let sampleData=[
          {linguagem:'Python', points:120,},
          {linguagem:'Javascript', points:500,},
          {linguagem:'Lua',points:14,},
      ]
      */
      let pieChart = []
      if(this.gridData[0]){
        let chartData = this.gridData.reduce((acc , item)=>{
          if(!acc[item.expense_label]){
              acc[item.expense_label] = Number(item.amount)
          }
          else{
              acc[item.expense_label] += Number(item.amount)
          }
          return acc;
        }, {})

        Object.keys(chartData).forEach(key=>{
            pieChart.push({'label':key, 'value':chartData[key].toFixed(2)})
        })

      }
      return pieChart
    },
    summary(){
      let total = [];
      if(this.gridData[0]){
        /*
        console.log(this.gridData.reduce((acc, item)=>
          acc+= Number(item.amount),0))
          */
        const expense = this.gridData.filter(
          item=>item.operation_type===1).reduce((
            acc, item)=>
              acc + Number(item.amount), 0)

        const credit = this.gridData.filter(
          item=>item.operation_type===2).reduce((
            acc, item)=>
              acc + Number(item.amount), 0)
        const rowColor = credit - expense>1?"#c4eacbd1":"#eac4c4d1"

        total = [{Credits:credit, Expenses:expense, Total: credit-expense, rowColor:rowColor}]
      }
      return total
    },
  },
  created(){
    if(!this.$store.state.transactionDate.year){
      /*Creates date case store is empty and persit to store*/
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth()+1
      this.$store.commit('setTransactionDate',
        {year:year, month:month})
    }

    this.$store.commit('setTransaction', null)
    this.getMainMenu()
    this.getTransactions()
  },
  methods:{
    mainMenuSelection(item){
      //returns from Back end month Number
      const year = Object.keys(item)[0]
      const month = this.$moment().month(item[year]).format('M')

      this.$store.commit('setTransactionDate',{year:year, month:month})
      this.showMenu = false
      this.getTransactions()

    },
    getMainMenu(){
      /*Retrieves data to create the navigation menu
       *based on transaction create dates.
      */
      this.$http.get(this.$urls.frontend.mainMenu)
        .then(resp=>this.mainMenu.push(resp.data))
        .catch(error=>console.log(error.response))
    },
    getTransactions(){
      this.$store.commit('setShowLoader',true)
      const year = this.$store.state.transactionDate.year
      const month = this.$store.state.transactionDate.month

      this.$http.get(this.$urls.transactions.transactions+'year/'
        +year+'/month/'+month)
        .then(resp=>{
          this.gridData = resp.data
          this.gridData.map(item=>
            item.dt_transaction = new Date(item.dt_transaction).toLocaleString())
          this.transactionCardHeader = ("Transactions: "+
              this.$moment.months(month-1) +' '+ year.toString())
          this.$store.commit('setShowLoader', false)
          this.chartCard = resp.data.length>0
          this.totalPanel = resp.data.length>0
          if(this.$store.state.smallScreen){
            this.smallScreenHanlder()
          }
        })
        .catch(error=>{
          if(error.response.status === 401){
            this.$router.push({name:'login'})
          }
          this.$store.commit('setShowLoader', false)
        })
    },
    handleGridClick(event, data){
      this.$store.commit('setTransaction', data)
      this.$router.push({path:'/transaction/edit'})
    },
    smallScreenHanlder(){
      //Configures some data to best display app based on viewport size
      this.chartCard = false;
      this.totalPannel = false;
      this.pieChartLegends = false;
    },
  }
}
</script>
<style scoped>
.container{
  padding-top:2rem;
}
.iconify-enter-active, .iconify-leave-active{
  transition:all ease-in-out .4s;
}
.iconify-enter, .iconify-leave-to{
  opacity:0;
  transform:rotateY(90deg) scale(3);
}
.grid{
  overflow:scroll;
}
</style>
