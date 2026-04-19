import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { signUp } = useSignUp()

  const validatePassword = (pwd: string) => {
    // Minimum 8 characters
    return pwd.length >= 8
  }

  const onSignup = async () => {
    // Validate password meets minimum requirements
    if (!validatePassword(password)) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters.')
      return
    }

    try {
      const signUpAny = signUp as any
      await signUpAny.create({
        emailAddress: email.trim(),
        password,
      })
      await signUpAny.prepareEmailAddressVerification()

      router.push({ pathname: '/verify/[identifier]', params: { identifier: email.trim(), signup: 'true' } })
    } catch (error: any) {
      console.error('Error signing up:', error)
      Alert.alert('Sign up failed', error?.message || 'Please make sure your email and password are valid.')
    }
  }

  const isFormValid = email.trim() !== '' && password !== ''

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={73}>
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's get started!</Text>
        <Text style={defaultStyles.descriptionText}>Enter your email and password. We'll send a verification code to your email.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.gray}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.gray}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Link href={'/login'} replace asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </Link>

        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={[defaultStyles.pillButton, isFormValid ? styles.enabled : styles.disabled, { marginBottom: 20 }]}
          onPress={onSignup}
          disabled={!isFormValid}
        >
          <Text style={defaultStyles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginBottom: 16,
  },
  enabled: {
    backgroundColor: Colors.primary,
  },
  disabled: {
    backgroundColor: Colors.primaryMuted,
  },
})
export default signup
