const baseUrl = '/api/v1';
const urls = {
  auth:{
    login:baseUrl+'/auth/',
    customLogin:baseUrl+'/token/',
  },
  frontend:{
    mainMenu:baseUrl+'/frontend/mainmenu/',
    appData:baseUrl+'/frontend/appdata/',
  },
  transactions:{
    transactions:baseUrl+'/transactions/',
    expenseTypes:baseUrl+'/transactions/expensetypes/',
    operationTypes:baseUrl+'/transactions/operationtypes/',
  },
}

export default urls;
