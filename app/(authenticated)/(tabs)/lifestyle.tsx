import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import Colors from '@/constants/Colors';
import { useBalanceStore } from '@/store/balanceStore';

const BACKEND_URL = 'https://21a4e1dc751a.ngrok-free.app' // Replace with your actual URL
const PAYSTACK_EMAIL = 'awodun42@gmail.com';
const SUBSCRIPTION_PLAN_CODE = 'PLN_lwqro2fu125wdqa'; // Replace with your actual Paystack plan code

const Lifestyle = () => {
  const [amount, setAmount] = useState('');
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [payAction, setPayAction] = useState('');

  const { balance, runTransaction } = useBalanceStore();

  const lifestyleActions = [
    { icon: 'fast-food-outline', label: 'Order Food' },
    { icon: 'car-outline', label: 'Book Ride' },
    { icon: 'phone-portrait-outline', label: 'Buy Airtime' },
    { icon: 'tv-outline', label: 'Pay TV Bills' },
    { icon: 'repeat-outline', label: 'Subscribe Plan' },
  ];

  const handleActionPress = (action: { label: string }) => {
    if (action.label === 'Buy Airtime' || action.label === 'Subscribe Plan') {
      setPayAction(action.label);
      setShowAmountInput(true);
    } else {
      Alert.alert(action.label, 'This feature is coming soon!');
    }
  };

  const handleAmountSubmit = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount.');
      return;
    }

    //Define the payload shape correctly
    interface PaystackPayload {
      email: string;
      amount?: number;
      plan?: string;
    }

    let endpoint = '';
    let payload: PaystackPayload = { email: PAYSTACK_EMAIL };

    if (payAction === 'Subscribe Plan') {
      endpoint = '/api/paystack/subscribe';
      payload.plan = SUBSCRIPTION_PLAN_CODE;
    } else {
      endpoint = '/api/paystack/payment';
      payload.amount = amt * 100; // kobo
    }

    try {
      console.log(`[${payAction}] Sending request to: ${BACKEND_URL}${endpoint}`);
      console.log('Payload:', payload);

      //Enhanced fetch with timeout and better headers
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'User-Agent': 'MyFinTechApp/1.0',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      //Debug: Log the raw response
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      console.log('Response status:', response.status);

      // Try to parse JSON
      const data = JSON.parse(responseText);
      console.log(`[${payAction}] Paystack response:`, data);

      if (data.url) {
        setCheckoutUrl(data.url);
        setShowAmountInput(false);
        setShowWebView(true);
      } else {
        Alert.alert('Error', 'Unable to initialize payment');
      }
    } catch (err: any) {
      console.warn(`[${payAction}] Error:`, err);

      //Better error handling
      if (err.name === 'AbortError') {
        Alert.alert('Timeout Error', 'Request took too long. Please try again.');
      } else if (err.message.includes('Network request failed')) {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', 'Failed to process payment. Please try again.');
      }
    }
  };

  const handlePaymentSuccess = () => {
    const amt = parseFloat(amount);
    runTransaction({
      id: Math.random().toString(),
      amount: -amt,
      date: new Date(),
      title: payAction,
    });

    Alert.alert('Payment Successful', `₦${amt} ${payAction}`);
    setAmount('');
    setShowWebView(false);
  };

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={{ padding: 24 }}
    >
      <Text style={styles.header}>Lifestyle & Perks</Text>

      <View style={styles.summaryCard}>
        <Ionicons name="gift-outline" size={40} color={Colors.primary} />
        <Text style={styles.summaryTitle}>Cashback & Rewards</Text>
        <Text style={styles.summaryText}>
          Get up to 5% cashback on select lifestyle purchases every month!
        </Text>
      </View>

      <Text style={styles.sectionHeader}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        {lifestyleActions.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.actionBtn}
            onPress={() => handleActionPress(action)}
          >
            <Ionicons name={action.icon as any} size={28} color={Colors.primary} />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionHeader}>Tips for a Smarter Lifestyle</Text>
      <View style={styles.tipBox}>
        <Text style={styles.tipText}>
          • Track your spending to save more each month.{'\n'}
          • Use rewards for everyday purchases.{'\n'}
          • Explore new ways to earn with our Learn & Earn program.
        </Text>
      </View>

      {/*Amount Entry */}
      <Modal visible={showAmountInput} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Amount</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Amount (₦)"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowAmountInput(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAmountSubmit}>
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/*WebView Modal */}
      <Modal visible={showWebView}>
        <WebView
          source={{ uri: checkoutUrl }}
          onNavigationStateChange={(navState) => {
            if (navState.url.includes('callback') || navState.url.includes('success')) {
              handlePaymentSuccess();
            }
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('[WebView Error]', nativeEvent);
            Alert.alert('Payment Failed', nativeEvent.description);
            setShowWebView(false);
          }}
        />
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 24
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center'
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
    marginTop: 10
  },
  summaryText: {
    color: Colors.gray,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray,
    marginBottom: 14
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginBottom: 32,
    justifyContent: 'space-between'
  },
  actionBtn: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 14,
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    elevation: 2
  },
  actionLabel: {
    marginTop: 8,
    color: Colors.dark,
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center'
  },
  tipBox: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24
  },
  tipText: {
    color: Colors.dark,
    fontSize: 15,
    lineHeight: 22
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: 300
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16, marginBottom: 16
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16
  },
  cancelText: {
    color: Colors.gray,
    fontSize: 16
  },
  continueText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16
  },
});

export default Lifestyle;