/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Qrcodemodal from './screens/qrcodemodal'
import {getInfo} from './api/data'
import {calculateAge} from './api/helper'

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const App: () => React$Node = () => {
  const [cameraref,setCameraref] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [household,setHousehold] = useState({
      no: '',
      family: '',
      address: '',
      barangay: '',
      members: [],
  })
  const [isvalid,setIsvalid] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(100).then(()=>{
    setIsvalid(null)  
    setHousehold({
        no: '',
        family: '',
        address: '',
        barangay: '',
        members: [],
    })
      setRefreshing(false)
    });
  }, [])

  const Header = () => {
    return <>
      <View style={styles.header}>
          <Text style={{color: "white",fontWeight: "bold", fontSize: 18,flex:1}}>HQP CHECKER</Text>
          <Image style={{height: "100%",flexBasis: 70}} source={require('./assets/images/mylogo.png')}/>
      </View>
    </>
  }
  
  const ScanButton = ()=>{
    return <>
     <TouchableOpacity style={styles.scanbtn} onPress={()=>openScanner()}>
            <Text style={{color: "white",fontWeight: "bold", fontSize: 18}}><FontAwesome5 style={{color: "white",fontWeight: "bold", fontSize: 18}} name={'qrcode'} /> SCAN QR CODE</Text>          
      </TouchableOpacity>
    </>
  }


  const MemberComponent = ({member})=>{
    return <>
        <View style={styles.memberbox}>
              <View style={styles.memberboximage}>
                  <Image style={{width: "100%" , height: 95}} source={require('./assets/images/default.png')}/>
              </View>
              <View style={styles.memberboxdetails}>
                  <Text style={{textAlign: "center",backgroundColor: colorsCustom.primary, width: "100%", fontWeight: "bold", color: "white"}}>Informations</Text>
                  <Text style={{color: colorsCustom.primary}}>Name: <Text style={{color: "dimgray"}}>{member.fname}</Text></Text>
                  <Text style={{color: colorsCustom.primary}}>Gender: <Text style={{color: "dimgray"}}>{member.gender}</Text></Text>
                  <Text style={{color: colorsCustom.primary}}>Age: <Text style={{color: "dimgray"}}>{calculateAge(member.Bday)}</Text></Text>
              </View>
        </View>
    </>
  }

  const openScanner = async ()=>{
    setModalVisible(true)
  }

  const setQrCode = (qrcode)=> {
    // Linking.openURL(e.data).catch(err =>
    //   console.error('An error occured', err)
    // );
    getInfo(qrcode)
    .then((res)=>{
      console.log(res)
      if(res.data.data.length > 0){
          let hdata = res.data.data[0]
          setHousehold((householdval)=>{
            householdval.no = hdata.Address.householdNo
            householdval.family = hdata.family
            householdval.address = `${hdata.Address.address} , ${hdata.Address.Street.street}`
            householdval.barangay = hdata.Address.Barangay.barangay
            householdval.members = hdata.Members
            return {...householdval}
          })
          setIsvalid(true)
      }else{
        setHousehold((householdval)=>{
          householdval.no = "N/A"
          householdval.family =  "N/A"
          householdval.address =  "N/A"
          householdval.barangay =  "N/A"
          householdval.members = []
          return {...householdval}
        })
        setIsvalid(false)
      }
    })
    .catch(err=>console.log(err))
    setModalVisible(false)
  };

  
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Qrcodemodal modalVisible={modalVisible} setModalVisible={(value)=> setModalVisible(value)} setQrCode={(qrcode)=>setQrCode(qrcode)}></Qrcodemodal>
      <SafeAreaView style={styles.container}>
        <Header/>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          >

              <View style={styles.mainbody}>
                  <View style={styles.box}>
                      <View style={{flex: 1 ,flexDirection: "row",}}>
                          <Text style={{...styles.title, marginBottom: 20}}>PASS INFORMATION </Text>
                          {
                            isvalid == null ? <Text></Text> 
                            : isvalid 
                            ? <Text style={{position: "absolute",right: 0, padding: 6,backgroundColor: "#21924B", top: -8, color: "white", borderRadius: 20}}><FontAwesome5 name="check-circle"/> Valid</Text> 
                            : <Text style={{position: "absolute",right: 0, padding: 6,backgroundColor: "#880101", top: -8, color: "white", borderRadius: 20}}><FontAwesome5 name="times-circle"/> Invalid</Text> 
                          }
                          
                      </View>
                      <Text style={styles.value}>HouseHold No: {household.no}</Text>
                      <Text style={styles.value}>Family Name: {household.family}</Text>
                      <Text style={styles.value}>Address: {household.address}</Text>
                      <Text style={styles.value}>Barangay: {household.barangay}</Text>
                  </View>

                  <Text style={{...styles.title, marginBottom: 10, marginTop: 10,marginLeft: 1}}>Household Members *</Text>
                  {
                    household.members.map((member,index)=>{
                      return <>
                          <MemberComponent member={member}></MemberComponent>
                      </>
                    })
                  }

                  {
                    household.members.length > 0 ? <Text></Text> : <Text style={{color: "maroon"}}>No Available Data</Text>
                  }

                </View>
        </ScrollView>
       <ScanButton></ScanButton>
      </SafeAreaView>
    </>
  );
};

const colorsCustom = {
  primary: "#41A3E5"
}

const memberstyle = {
  memberbox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F8F2F2",
    padding: 10,
    marginBottom: 10,
  },
  memberboximage: {
    flexBasis: "30%",
    backgroundColor: "red"
  },
  memberboxdetails: {
    flexGrow: 1,
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    display: "flex",
  }
}



const styles = StyleSheet.create({
  ...memberstyle,
  scrollView: { 
    backgroundColor: "white",
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingLeft: 20,
    paddingRight: 20,
    flexBasis: 60,
    alignItems: "center",
    backgroundColor: colorsCustom.primary,
    display: "flex",
    flexDirection: "row"
  },
  mainbody: {
    flex: 1,
    padding: 20,
  },
  box: {
      borderColor: "#707070",
      borderWidth: 1,
      borderRadius: 10,
      padding: 20,
  },
  title: {
    fontWeight: "bold",
    color: colorsCustom.primary,
  },
  value: {
    marginBottom: 5,
    fontSize: 16,
    color: "#707070"
  },  
  scanbtn: {
   
    backgroundColor: colorsCustom.primary,
    width: "100%",
    flexBasis: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }

});

export default App;
