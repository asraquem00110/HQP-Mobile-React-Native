import axios from 'axios'
export const getInfo = (qrcode)=>{
    return new Promise((resolve,reject)=>{
        axios.post("https://hqp-backend-00110.herokuapp.com/api/mobile/getQrCodeInformation",{qrcode: qrcode}).then((res)=>{
                    resolve(res)
                }).catch((err)=>{
                    reject(err)
                })
    })
}