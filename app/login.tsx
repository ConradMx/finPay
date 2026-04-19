import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn } = useSignIn()
  const router = useRouter()

  const validatePassword = (pwd: string) => {
    // Minimum 8 characters
    return pwd.length >= 8
  }

  const onSignIn = async () => {
    // Validate password meets minimum requirements
    if (!validatePassword(password)) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters.')
      return
    }

    try {
      const signInAny = signIn as any
      // Create sign-in session with credentials
      const result = await signInAny.create({
        identifier: email.trim(),
        password,
      })

      // Prepare email verification
      await signInAny.prepareFirstFactor({
        strategy: 'email_code',
      })

      // Navigate to OTP verification
      router.push({ pathname: '/verify/[identifier]', params: { identifier: email.trim(), signin: 'true' } })
    } catch (err: any) {
      console.log('error', JSON.stringify(err, null, 2))
      if (isClerkAPIResponseError(err)) {
        const errorMsg = err.errors[0].message
        if (errorMsg?.includes('email_address is not a valid parameter')) {
          Alert.alert(
            'Email Authentication Not Enabled',
            'Please enable email authentication in your Clerk Dashboard at https://dashboard.clerk.com under User Authentication → Email, Phone, Username.'
          )
        } else {
          Alert.alert('Error', errorMsg)
        }
      } else {
        Alert.alert('Error', 'Unable to sign in. Please check your credentials.')
      }
    }
  }

  const isFormValid = email.trim() !== '' && password !== ''

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={73}>
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome back</Text>
        <Text style={defaultStyles.descriptionText}>Enter the email and password for your account.</Text>

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

        <TouchableOpacity
          style={[defaultStyles.pillButton, isFormValid ? styles.enabled : styles.disabled, { marginBottom: 20 }]}
          onPress={onSignIn}
          disabled={!isFormValid}
        >
          <Text style={defaultStyles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <Link href={'/signup'} replace asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>Don’t have an account? Sign up</Text>
          </TouchableOpacity>
        </Link>
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
export default login
