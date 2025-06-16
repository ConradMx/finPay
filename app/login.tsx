import { View,
     Text, 
     StyleSheet,
     TextInput, 
     TouchableOpacity,
      KeyboardAvoidingView,
       Platform, 
       Alert} 
       from 'react-native'
import React, { useState } from 'react'
import { defaultStyles } from '@/constants/Styles'
import Colors from '@/constants/Colors'
import { Link, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo'

enum SignInType {
  Phone,
  Email,
  Google,
  Apple,
}


const login = () => {
const [countryCode, setCountryCode] = useState  ('+1')
const [phoneNumber, setPhoneNumber] = useState ('')
const keyboardVerticalOffset= Platform.OS === 'ios' ? 80 : 0; 
const {signIn} = useSignIn();

const onSignIn = async (type: SignInType) => {
  if (type === SignInType.Phone) {

try {
  const fullPhoneNumber = `${countryCode}${phoneNumber}`;

  const {supportedFirstFactors} = await signIn!.create ({
identifier: fullPhoneNumber,
  }) ;
  if (!supportedFirstFactors) {
        throw new Error('No supported first factors found');
      }
  const firstPhoneFactor: any = supportedFirstFactors.find ((factor: any) => {
return factor.strategy === 'phone_code';
  });
const {phoneNumberId}= firstPhoneFactor;

await signIn!.prepareFirstFactor ({
  strategy:'phone_code',
  phoneNumberId,
});
router.push ({pathname: '/verify/[phone]', params: {phone: fullPhoneNumber, signin: 'true'} });

} catch (err) {
  console.log('error', JSON.stringify(err, null, 2));
  if (isClerkAPIResponseError(err)) {
if (err.errors[0].code === 'form_identifier_not_found')
  Alert.alert('Error', err.errors[0].message)
  }
}

  }
};

  return ( 
    <KeyboardAvoidingView style={{flex:1}} behavior='padding' keyboardVerticalOffset={73}>
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>Welcome back</Text>
      <Text style={defaultStyles.descriptionText}>Enter your phone number associated with your account</Text>
      <View style={styles.inputContainer}>
   <TextInput
        style={styles.input}
        placeholder="Country code"
        placeholderTextColor={Colors.gray}
        value={countryCode} 
        />
 
        <TextInput
        style={[styles.input, {flex:1}]}
        placeholder="Mobile number"
        keyboardType="numeric"
        placeholderTextColor={Colors.gray}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
     
        />
      </View>
   



<TouchableOpacity style={[defaultStyles.pillButton, 
    phoneNumber !=='' ? styles.enabled : styles.disabled, 
    { marginBottom:20}, 
     ]}
      onPress={() => onSignIn (SignInType.Phone)}>
        <Text style={defaultStyles.buttonText}>Continue</Text>
</TouchableOpacity>

<View style={{flexDirection:'row', alignItems:'center', gap:16}}>
    <View style={{flex:1, height:StyleSheet.hairlineWidth, backgroundColor:Colors.gray}}>
    </View>
    
<Text style={{color: Colors.gray, fontSize:20}}>or</Text>

    <View style={{flex:1, height:StyleSheet.hairlineWidth, backgroundColor:Colors.gray}}>

    </View>

</View>
<TouchableOpacity
onPress = {() => onSignIn(SignInType.Email)}
style={[defaultStyles.pillButton, {gap:16, 
  flexDirection:'row',
  backgroundColor:'#fff',
    marginTop:20
  }]}>
<Ionicons name='mail' size={24} color={'#000'}/>
<Text style={[defaultStyles.buttonText, {color: "#000"} ]}>Continue with email</Text>
</TouchableOpacity>

<TouchableOpacity
onPress = {() => onSignIn(SignInType.Google)}
style={[defaultStyles.pillButton, {gap:16, 
  flexDirection:'row',
  backgroundColor:'#fff',
    marginTop:20
  }]}>
<Ionicons name='logo-google' size={24} color={'#000'}/>
<Text style={[defaultStyles.buttonText, {color: "#000"} ]}>Continue with email</Text>
</TouchableOpacity>


<TouchableOpacity
onPress = {() => onSignIn(SignInType.Apple)}
style={[defaultStyles.pillButton, {gap:16, 
  flexDirection:'row',
  backgroundColor:'#fff',
  marginTop:20
  }]}>
<Ionicons name='logo-apple' size={24} color={'#000'}/>
<Text style={[defaultStyles.buttonText, {color: "#000"} ]}>Continue with email</Text>
</TouchableOpacity>
    </View>
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
inputContainer:{
    marginVertical:40,
    flexDirection:"row",    
},
input:{
backgroundColor: Colors. lightGray,
padding:20,
borderRadius:16,
fontSize:20,
marginRight:10
},
enabled:{
backgroundColor: Colors.primary
},
disabled:{
backgroundColor:Colors.primaryMuted,
},
    
})
export default login