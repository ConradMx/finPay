import Colors from '@/constants/Colors'
import { useBalanceStore } from '@/store/balanceStore'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const transfers = () => {
  const { balance, runTransaction, transactions } = useBalanceStore();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const onSend = () => {
    const amt = parseFloat(amount);
    if (!recipient || isNaN(amt) || amt <= 0) {
      Alert.alert('Error', 'Enter a valid recipient and amount');
      return;
    }
    if (amt > balance()) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }
    runTransaction({
      id: Math.random().toString(),
      amount: -amt,
      date: new Date(),
      title: `Transfer to ${recipient}`,
    });
    setAmount('');
    setRecipient('');
    Alert.alert('Success', `Sent ₦${amt} to ${recipient}`);
  };

  return (
    <ScrollView style={{ backgroundColor: Colors.background }} contentContainerStyle={{ padding: 24, flexGrow: 1 }}>
      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceValue}>₦{balance()}</Text>
      </View>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Recipient"
          placeholderTextColor={Colors.gray}
          value={recipient}
          onChangeText={setRecipient}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          placeholderTextColor={Colors.gray}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={onSend}>
          <Ionicons name="send" size={20} color="#fff" />
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionHeader}>Recent Transfers</Text>
      <View style={styles.transactions}>
        {transactions.filter(t => t.amount < 0).length === 0 && (
          <Text style={{ color: Colors.gray, padding: 14 }}>No transfers yet</Text>
        )}
        {transactions.filter(t => t.amount < 0).map((t) => (
          <View key={t.id} style={styles.transactionRow}>
            <Ionicons name="arrow-up" size={20} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '500' }}>{t.title}</Text>
              <Text style={{ color: Colors.gray, fontSize: 12 }}>{new Date(t.date).toLocaleString()}</Text>
            </View>
            <Text style={{ color: Colors.primary }}>₦{Math.abs(t.amount)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  balanceBox: {
    alignItems: 'center',
    marginBottom: 32,
  },
  balanceLabel: {
    color: Colors.gray,
    fontSize: 16,
  },
  balanceValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.dark,
    marginTop: 8,
  },
  inputBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: 16,
    fontSize: 18,
    color: Colors.dark,
  },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 14,
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray,
    marginBottom: 10,
  },
  transactions: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    gap: 16,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});

export default transfers