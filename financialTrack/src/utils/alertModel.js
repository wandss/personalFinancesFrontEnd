export default class AlertModel{
    constructor(show=false, title='', cssClass='success', hasCloseBtn=true,
                content=''){
        this.show = show
        this.title = title
        this.cssClass = cssClass
        this.hasCloseBbtn = hasCloseBtn
        this.content = content
    }
    error(message){
      this.show = true
      this.title = 'Ooops!'
      this.cssClass = 'danger'
      this.hasCloseBtn = true
      this.content = message
    }
}
