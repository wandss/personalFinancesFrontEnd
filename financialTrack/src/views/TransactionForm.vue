<!--TODO:Create Button in baseSelect component -->
<template>
    <div class="container">
      <modal-confirm :show="showModalConfirm" @close="showModalConfirm=false"
       message="Are you sure?" title="Confirm:" @getConfirmation="deleteTransaction"
      />
      <form @submit.prevent="createTransaction" id="main_form" ref="main_form">
        <div class="row">
          <div class="col">
            <card :title="(isEditing?'Update ':'Create ') +'Transaction'"
             :show="true" :hasFooter="true">
              <div slot="content">
                <alert :show="alert.show" :hasCloseBtn="true"
                 :cssClass="alert.cssClass"
                 @close="alert.show=false" :title="alert.title">
                    <span v-html="alert.content"></span>
                </alert>
                <div class="row" >
                  <div class="col">
                    <base-select leftLabel="Expense Type"
                     :options="expenseTypesList" :selected="expenseType"
                     optionName="label" v-model="selectedExpenseType"
                     :appendedButtons="expenseTypeButtons"
                     />
                    <transition name="rotate">
                      <div class="col" v-if="addExpenseType">
                        <form class="form-group"
                         @submit.prevent="handleExpenseType(expenseTypeAction)"
                         id="expenseTypeForm">
                          <base-input placeholder="Expense Type" type="text"
                           v-model="newExpenseType" size="sm"
                           :prependedButtons="addExpenseTypeInputButtons"/>
                        </form>
                      </div>
                    </transition>
                    <base-select leftLabel="Operation Type"
                     :options="operationTypesList"
                     :selected="operationType"
                     optionName="label" v-model="selectedOperationType" />
                  </div>
                </div>
                  <base-input v-for="field in formFields" :key="field.id"
                   :type="field.type"
                   :label="field.label"
                   :placeholder="field.label"
                   v-model="field.value"
                   :value="field.value"
                   />
            </div>

            <div slot="footer" v-if="formFields" >
                <base-button v-if="isEditing"
                 :cssClass="isEditing?'btn-warning':'btn-success'"
                 @click="updateTransaction"
                 icon="fa fa-save" type="button"
                >
                    Update
                </base-button>
                <base-button v-else
                 :cssClass="isEditing?'btn-warning':'btn-success'"
                 icon="fa fa-save" type="submit"
                >
                    Save
                </base-button>
                <base-button cssClass="btn-secondary"
                 icon="fa fa-arrow-left" @click="$router.go(-1)"
                 type="button"
                >
                    Back
                </base-button>
                <base-button cssClass="btn-danger" v-if="isEditing"
                 icon="fa fa-trash" @click="showModalConfirm=true"
                 type="button"
                >
                    Delete
                </base-button>
              </div>
            </card>
          </div>
        </div>
      </form>
    </div>
</template>
<script>
import Alert from '@/components/Alert.vue';
import AlertModel from '@/utils/alertModel';
import BaseButton from "@/components/baseButton.vue";
import BaseInput from '@/components/baseInput.vue';
import BaseSelect from '@/components/baseSelect.vue';
import Card from "@/components/card.vue";
import ModalConfirm from '@/components/ModalConfirm';

export default{
  name:'TransactionForm',
  components:{Card, BaseButton, BaseInput, BaseSelect, Alert, ModalConfirm},
  data(){
    return{
      addExpenseType:false,
      newExpenseType:'',
      expenseTypeAction:'',
      selectedExpenseType:'',
      expenseType:'',
      operationType:'',
      expenseTypesList:[],
      expenseTypeButtons:[
        {name:'New', cssClass:'primary', icon:'fa fa-plus',
         event:()=>this.handleExpenseType('new'), type:'button',
        },
        {name:'Edit', cssClass:'warning', icon:'fa fa-edit',
         event:()=>this.handleExpenseType('edit'), type:'button',
        }
      ],
      selectedOperationType:'',
      operationTypesList:[],
      alert: new AlertModel(),
      formFields:null,
      isEditing:false,
      expenseTypeIdToUpdate:'',
      showModalConfirm:false,
    }
  },
  mounted(){
    if(this.$route.params.edit === 'edit' &&
      !this.$store.state.transaction){

      this.$router.push({name:'home'})
    }
    this.$store.commit('setShowLoader', true)

    this.getTransactionForm();
    this.getExpenseTypes();
    this.getOperationTypes();
  },
  computed:{
    addExpenseTypeInputButtons(){
      return[
        {name:'Save', cssClass:"success", icon:'fa fa-save',
          event:()=>this.createUpdateExpenseType()
        },
        {name:'Delete', cssClass:"danger", icon:'fa fa-trash',
          event:()=>this.deleteExpenseType(),
          disabled:this.expenseTypeIdToUpdate?false:true,
        },
      ]
    }
  },
  watch:{
    selectedExpenseType(){
      if(this.expenseTypeIdToUpdate.length !== 0){
        //If is ExpenseType, is been updatede,  whenever
        //base-select, is change, newExpenseType, must also be updated.

        this.newExpenseType = this.expenseTypesList.find(item=>
          item.id.toString() === this.selectedExpenseType.toString()).label
      }
    }
  },
  methods:{
    handleExpenseType(action){
      this.expenseTypeAction = action
      if(action === 'new'){
        if(!(this.newExpenseType.length !==0 && this.addExpenseType)){
            this.addExpenseType = !this.addExpenseType
        }
        this.expenseTypeIdToUpdate = ''
        this.newExpenseType = ''
      }
      else{
        this.updateExpenseTypeField()
      }
    },
    getExpenseTypes(){
      this.$http.get(this.$urls.transactions.expenseTypes)
        .then(resp=>{
            this.expenseTypesList = resp.data
        })
        .catch(error=>{
          if(error.response.status === 401){
            this.$router.push({name:'login'})
          }
          console.log(error.response.data)
        })
      //options retrieves metadata. Use this to create form?
      /*
      this.$http.options(this.$urls.transactions.expenseTypes)
        .then(()=>{
            //console.log(resp.data.POST.label)
        })
        */
    },
    getOperationTypes(){
      this.$http.get(this.$urls.transactions.operationTypes)
        .then(resp=>{
          this.operationTypesList=resp.data
          this.$store.commit('setShowLoader', false)
        })
        .catch(error=>{
          this.$store.commit('setShowLoader', false)
          console.log(error.response)
        })
    },
    getTransactionForm(){
      //Creates form by inspecting backend's model.
      //Removes fields that are read only
      this.$http.options(this.$urls.transactions.transactions)
      .then(resp=>{
        let formFields = resp.data.actions.POST
        delete(formFields.operation_type)
        delete(formFields.expense)
        Object.keys(formFields).forEach(key=>{
          if(formFields[key].read_only){
            delete(formFields[key])
          }
        })
        this.formFields = formFields

        if(this.$route.params.edit !== undefined){
          this.fillForm()
        }
      })
      .catch(error=>{
        if(error.response.status === 401){
          this.$router.push({name:'login'})
        }
        console.log(error.response)
      })
    },
    createUpdateExpenseType(e){
      const data = {label:this.newExpenseType}
      if(this.expenseTypeIdToUpdate.length!==0){
        //Triggers an update on expense type.
        const id = this.expenseTypeIdToUpdate;
        this.$http.put(this.$urls.transactions.expenseTypes+id, data)
          .then(()=>{
            this.getExpenseTypes();
            this.addExpenseType = false;
            this.selectedExpenseType='';
            this.expenseTypeIdToUpdate = '';
            this.newExpenseType = '';
          })
          .catch(error=>{
            if(error.response.status === 401){
              this.$router.push({name:'login'})
            }
            console.log(error.response)
          })
      }
      else{
        //Creates a new expense type.
        this.$http.post(this.$urls.transactions.expenseTypes, data)
          .then(()=>{
            this.getExpenseTypes();
            this.addExpenseType = false;
          })
          .catch(error => {
            if(error.response.status === 401){
              this.$router.push({name:'login'})
            }
            this.alert.show = true;
            this.alert.content= error.response.data
            this.alert.title = "Attention!"
            this.alert.cssClass = "danger"
          })
        this.newExpenseType = '';
      }
      if(e!==undefined){
        e.target.reset()
      }
    },
    updateExpenseTypeField(){
      //Show field to update an expense type.
      //Sets selectedExpenseTypeValue
      if(this.selectedExpenseType.length === 0){
        this.alert.show = true
        this.alert.cssClass = 'warning'
        this.alert.title = 'Attention!'
        this.alert.content = 'Select an <b>"Expense Type"</b> on the\
            list, first.'
      }
      else{
        this.addExpenseType = !this.addExpenseType
        this.newExpenseType = this.expenseTypesList.find(item=>
            item.id.toString()===this.selectedExpenseType.toString()).label
        this.expenseTypeIdToUpdate = this.selectedExpenseType
      }
    },
    createTransaction(){

      let data = this.getFormData()

      data.dt_transaction = this.createDateObject(
        data.dt_transaction)

      this.$http.post(this.$urls.transactions.transactions, data)
        .then(()=>{
          this.getTransactionForm();
          this.getExpenseTypes();
          this.getOperationTypes();
          this.selectedExpenseType = ''
          this.selectedOperationType = ''
          this.$refs.main_form.reset()
        })
        .catch(error=>{

          if(error.response.status === 401){
            this.$router.push({name:'login'})
          }
          this.alert.show = true;
          this.alert.content = error.response.data.detail !== undefined?
              error.response.data.detail:error.response.data
          this.alert.title = "Attention!"
          this.alert.cssClass = "danger"
        })

    },
    updateTransaction(){
      const id = this.$store.state.transaction.id
      let data = this.getFormData();

      data.dt_transaction = this.createDateObject(
        data.dt_transaction)

      this.$http.put(this.$urls.transactions.transactions+id, data)
        .then(()=>{
          //TODO:Add updated value to store?
          this.$router.push({name:'home'})
        })
        .catch(error=>{
          if(error.response.status === 401){
            this.$router.push({name:'login'})
          }
          this.alert.show = true;
          this.alert.content = error.response.data.detail !== undefined?
              error.response.data.detail:error.response.data
          this.alert.title = "Attention!"
          this.alert.cssClass = "danger"
        })
    },
    fillForm(){
      this.isEditing = true
      let formData = this.$store.state.transaction
      this.expenseType = formData.expense_label
      this.operationType = formData.operation_type_label

      this.selectedExpenseType = formData.expense
      this.selectedOperationType = formData.operation_type

      Object.keys(formData).forEach(label=>{
        if(this.formFields[label]){
          if(formData[label]){
            if(this.formFields[label].type === 'datetime'){
              const date =  this.$moment(
                  formData[label]).format('DD/MM/YYYY')
              this.$set(this.formFields[label], 'value', date)
            }
            else{
              this.$set(this.formFields[label], 'value',
                formData[label])
            }
          }
        }
      })
    },
    getFormData(){
      let data = {}

      Object.keys(this.formFields).forEach(label=>{
        if(label === 'parcels' &&
          this.formFields[label].value === undefined){
          data[label] = 0;
        }
        else{
          data[label] = this.formFields[label].value
        }
      })
      data['expense'] = this.selectedExpenseType
      data['operation_type'] = this.selectedOperationType

      return data
    },
    deleteTransaction(response){
      if(response){
        //Triggers backend deletion
        const id = this.$store.state.transaction.id

        this.$http.delete(this.$urls.transactions.transactions+id)
          .then(resp=>console.log(resp.data))
          .catch(error=>console.log(error.response))

        this.$router.push({name:'home'})
      }
      this.showModalConfirm = false
    },
    deleteExpenseType(){
      const id = this.expenseTypeIdToUpdate
      this.$http.delete( this.$urls.transactions.expenseTypes+id)
        .then(()=>{
          const index = this.expenseTypesList.map(item=>
            item.id.toString()).indexOf(id)
          this.expenseTypesList.splice(index, 1)
        })
        .catch(error=>{
          if(error.response.status === 401){
            this.$router.push({name:'login'})
          }
          console.log(error.response.data)
          this.alert.show = true;
          this.alert.cssClass = 'danger';
          this.alert.title = 'Attention!';
          this.alert.content = 'Item could not be removed'
        })
    },
    createDateObject(date){
      if(!date){
        date = this.$moment().toJSON()
      }
      else{
        date = this.$moment(date, 'DD/MM/YYYY').toJSON()
      }
      return date
    },
  }
}
</script>
<style scoped>
.container{
    padding-top:2rem;
}
.rotate-enter-active, .rotate-leave-active{
    transition:all .5s
}
.rotate-enter, .rotate-leave-to{
    transform:rotateX(90deg);
    opacity:0;
}
#expenseTypeForm{
    margin:0;
    padding:0;
}
#main_form{
    margin:0;

}
</style>
