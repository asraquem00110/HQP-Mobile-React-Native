
export const calculateAge = (Bday)=>{

    var datenow = new Date()
    var yearnow = datenow.getFullYear()
    var monthnow = datenow.getMonth()
    var daynow = datenow.getDate()

    var bdate = new Date(Bday)
    var year = bdate.getFullYear()
    var month = bdate.getMonth()
    var day = bdate.getDate()

    let age

    if((monthnow < month)){
        age =  (yearnow-year) - 1
    }else if(monthnow == month){
        if(daynow < day){
            age = (yearnow-year) - 1
        }else{
            age = (yearnow-year)
        }
    }else{
        age = (yearnow-year)
    }
    return age

}
