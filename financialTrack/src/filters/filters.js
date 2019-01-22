export const formatDate = function(value){
    if(value){
        if(!isNaN(new Date(value).getFullYear())){
            console.log('YAY DATE')
            console.log(value)
            value = new Date(value).toLocaleDateString()
            console.log(value)
        }
    }
    return value
}
