import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { defaultStyles } from '@/constants/Styles'
import Colors from '@/constants/Colors'
import { Link, useRouter } from 'expo-router'
import { defineAnimation } from 'react-native-reanimated'
import { useSignUp } from '@clerk/clerk-expo'

const signup = () => {
  const [countryCode, setCountryCode] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 80 : 0;
  const router = useRouter()
  const { signUp } = useSignUp()

  const onSignup = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    try {
      await signUp!.create({
        phoneNumber: fullPhoneNumber,
      });
      signUp!.preparePhoneNumberVerification();

      router.push({ pathname: '/verify/[phone]', params: { phone: fullPhoneNumber } });
    } catch (error) {
      console.error('Error signing up:', error);
    }
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={73}>
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's get started!</Text>
        <Text style={defaultStyles.descriptionText}>Enter your phone number. we will send you a confirmation code there</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Country code"
            placeholderTextColor={Colors.gray}
            value={countryCode}
          />

          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Mobile number"
            keyboardType="numeric"
            placeholderTextColor={Colors.gray}
            value={phoneNumber}
            onChangeText={setPhoneNumber}

          />
        </View>
        <Link href={'/login'} replace asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>Already have an account? Log in </Text>
          </TouchableOpacity>
        </Link>


        <View style={{ flex: 1 }} />
        <TouchableOpacity style={[defaultStyles.pillButton,
        phoneNumber !== '' ? styles.enabled : styles.disabled,
        { marginBottom: 20 },
        ]} onPress={onSignup}>
          <Text style={defaultStyles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
    flexDirection: "row",
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginRight: 10
  },
  enabled: {
    backgroundColor: Colors.primary
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },

})
export default signup