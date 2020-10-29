import React from 'react'
import { Modal , StyleSheet , View , Text , TouchableOpacity } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RNCamera } from 'react-native-camera'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const QRCodeModal = ({modalVisible , setModalVisible , setQrCode})=>{
    const onSuccess = (e)=>{
      setQrCode(e.data)
    }

    return (
        <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
        }}
         >

                <QRCodeScanner
                    onRead={(e)=>onSuccess(e)}
                    flashMode={RNCamera.Constants.FlashMode.torch}
                    topContent={
                      <Text style={styles.centerText}>
                       
                      </Text>
                    }
                    bottomContent={
                      <TouchableOpacity style={styles.buttonTouchable} onPress={()=>setModalVisible(false)}>
                        <Text style={styles.buttonText}><FontAwesome5 style={styles.buttonText} name="times-circle"/> Close</Text>
                      </TouchableOpacity>
                    }
                  ></QRCodeScanner>

        </Modal>
    )
}

const styles = StyleSheet.create({
 centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }

})

export default QRCodeModal