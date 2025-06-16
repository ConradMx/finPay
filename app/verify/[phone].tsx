import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native'
import React, { useEffect, useState, Fragment } from 'react'
import { Link, useLocalSearchParams } from 'expo-router'
import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo'
import { defaultStyles } from '@/constants/Styles'
import { runOnJS } from 'react-native-reanimated'
import { registerSensor } from 'react-native-reanimated/lib/typescript/core'
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Colors from '@/constants/Colors'
const CELL_COUNT = 6;

const page = () => {
const {phone, signin} = useLocalSearchParams<{phone: string, signin: string }>()
const [code, setCode] = useState ('');
const {signIn} = useSignIn();
const {signUp, setActive} = useSignUp()
 const ref = useBlurOnFulfill({value: code, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });


useEffect(() => {
  if (code.length === 6) {
  
    // verify the code
if (signin === 'true') {
  verifySignIn();
} else {
  veriftCode();
}

  }

}, [code]);



const veriftCode = async () => {
  try {
    const result = await signUp!.attemptPhoneNumberVerification({
      code,
    });
     console.log('Verification result:', result);
    if (result.status === 'complete') {
      await setActive!({ session: result.createdSessionId });
      // Optionally navigate to home or dashboard here
    } else {
      Alert.alert('Error', 'Verification not complete. Please try again.');
    }
  } catch (err) {
    console.log('error', JSON.stringify(err, null, 2));
    if (isClerkAPIResponseError(err)) {
      Alert.alert('Error', err.errors[0].message);
    }
  }
}



const verifySignIn = async () => {
    try {
    await signIn!.attemptFirstFactor({
      strategy: 'phone_code',
      code,
    });
await setActive! ({ session: signIn!.createdSessionId})

  } catch (err) {
    console.log('error', JSON.stringify(err,null,2));
    if(isClerkAPIResponseError(err)) {
      Alert.alert('Error', err.errors[0].message)
    }
  }
}



  return (
    <View style={defaultStyles.container}>
      <Text style={ defaultStyles.header}> 6-digital code</Text>
  
      <Text style={defaultStyles.descriptionText}> Code sent to {phone} unless you already have an account</Text>
   
   <CodeField
        ref={ref}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (


        <Fragment key={index}>
          <View
            key={index}
            style={[styles.cellRoot, isFocused ? styles.focusCell : null]}
            onLayout={getCellOnLayoutHandler(index)}
          >
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
          {index === 2 ? <View key={`separator-${index}`} style={styles.separator} /> : null}
        </Fragment>
        )}
      />


     <Link href={'/login'} replace asChild>
         <TouchableOpacity>
           <Text style={defaultStyles.textLink}>Already have an account? Log in </Text>
         </TouchableOpacity>
         </Link>
    </View> 
  )
}

const styles = StyleSheet.create({

codeFieldRoot: {
  marginVertical: 20,
marginLeft:'auto',
marginRight:'auto',
gap:12,


},
  cellRoot: {
    width: 45,
    height: 60,
justifyContent:'center',
alignItems:'center',
    backgroundColor: Colors.lightGray,
    textAlign: 'center',
    borderRadius:8,
  },
  focusCell: {
    borderColor: '#000',
  },
separator:{
height:2,
width:10,
backgroundColor: Colors.gray,
alignSelf:'center',

},

cellText:{
  color: '#000',
  fontSize:36,
  textAlign:'center'
}
})
 
export default page