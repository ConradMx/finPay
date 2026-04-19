import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo'
import { Link, useLocalSearchParams } from 'expo-router'
import React, { Fragment, useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field'
const CELL_COUNT = 6;

const page = () => {
  const { identifier, signin } = useLocalSearchParams<{ identifier: string; signin: string }>()
  const [code, setCode] = useState('')
  const { signUp, setActive } = useSignUp()
  const { signIn } = useSignIn()
  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT })
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  })

  useEffect(() => {
    if (code.length === CELL_COUNT) {
      verifyEmailCode()
    }
  }, [code])

  const verifyEmailCode = async () => {
    try {
      if (signin === 'true') {
        // Login flow - verify sign-in with OTP
        const signInAny = signIn as any
        const result = await signInAny.attemptFirstFactor({
          strategy: 'email_code',
          code,
        })
        console.log('Sign-in verification result:', result)
        if (result.status === 'complete') {
          await setActive!({ session: result.createdSessionId })
        } else {
          Alert.alert('Error', 'Verification not complete. Please try again.')
        }
      } else {
        // Signup flow - verify email
        const signUpAny = signUp as any
        const result = await signUpAny.attemptEmailAddressVerification({ code })
        console.log('Sign-up verification result:', result)
        if (result.status === 'complete') {
          await setActive!({ session: result.createdSessionId })
        } else if (result.status === 'missing_requirements') {
          // If there are missing requirements, show user message with what's missing
          const missingFields = result.missingFields || []
          Alert.alert(
            'Additional Information Required',
            `Please provide: ${missingFields.join(', ')}`,
            [{ text: 'OK' }]
          )
        } else {
          Alert.alert('Error', 'Verification not complete. Please try again.')
        }
      }
    } catch (err) {
      console.log('error', JSON.stringify(err, null, 2))
      if (isClerkAPIResponseError(err)) {
        Alert.alert('Error', err.errors[0].message)
      }
    }
  }

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>Verification code</Text>
      <Text style={defaultStyles.descriptionText}>Code sent to {identifier}</Text>

      <CodeField
        ref={ref}
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Fragment key={index}>
            <View
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
          <Text style={defaultStyles.textLink}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginVertical: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 12,
  },
  cellRoot: {
    width: 45,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    textAlign: 'center',
    borderRadius: 8,
  },
  focusCell: {
    borderColor: '#000',
  },
  separator: {
    height: 2,
    width: 10,
    backgroundColor: Colors.gray,
    alignSelf: 'center',
  },
  cellText: {
    color: '#000',
    fontSize: 36,
    textAlign: 'center',
  },
})

export default page
