import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, FlatList, SafeAreaView } from 'react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const dummyCard = {
  number: '**** **** **** 1234',
  name: 'Conrad Sun',
  expiry: '12/28',
  cvv: '***',
  status: 'Active',
  brand: 'VISA',
};

const dummyTransactions = [
  { id: '1', merchant: 'Netflix', amount: -3500, date: '2025-08-01' },
  { id: '2', merchant: 'Jumia', amount: -12000, date: '2025-07-30' },
  { id: '3', merchant: 'Wallet Top-up', amount: 20000, date: '2025-07-28' },
];

const CardScreen = () => {
  const [showCVV, setShowCVV] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Card Display */}
      <View style={styles.card}>
        <Text style={styles.cardBrand}>{dummyCard.brand}</Text>
        <Text style={styles.cardNumber}>{dummyCard.number}</Text>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Name</Text>
          <Text style={styles.cardLabel}>Expiry</Text>
          <Text style={styles.cardLabel}>CVV</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardValue}>{dummyCard.name}</Text>
          <Text style={styles.cardValue}>{dummyCard.expiry}</Text>
          <TouchableOpacity onPress={() => setShowCVV(v => !v)}>
            <Text style={styles.cardValue}>{showCVV ? '123' : dummyCard.cvv}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.cardStatus, { color: isFrozen ? Colors.gray : Colors.primary }]}>
          {isFrozen ? 'Frozen' : dummyCard.status}
        </Text>
      </View>

      {/* Card Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="snow-outline" size={20} color={Colors.primary} />
          <Text style={styles.actionText}>Freeze Card</Text>
          <Switch value={isFrozen} onValueChange={setIsFrozen} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="key-outline" size={20} color={Colors.primary} />
          <Text style={styles.actionText}>Change PIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="alert-circle-outline" size={20} color={Colors.primary} />
          <Text style={styles.actionText}>Report Lost/Stolen</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <Text style={styles.sectionHeader}>Recent Card Transactions</Text>
      <FlatList
        data={dummyTransactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.txRow}>
            <Ionicons
              name={item.amount > 0 ? 'arrow-down' : 'arrow-up'}
              size={20}
              color={item.amount > 0 ? Colors.background : Colors.gray}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '500' }}>{item.merchant}</Text>
              <Text style={{ color: Colors.gray, fontSize: 12 }}>{item.date}</Text>
            </View>
            <Text style={{ color: item.amount > 0 ? Colors.background : Colors.gray }}>
              {item.amount > 0 ? '+' : '-'}₦{Math.abs(item.amount)}
            </Text>
          </View>
        )}
        style={styles.txList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24 },
  card: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardBrand: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  cardNumber: { color: '#fff', fontSize: 24, letterSpacing: 2, marginBottom: 12 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  cardLabel: { color: '#fff', fontSize: 12, opacity: 0.7 },
  cardValue: { color: '#fff', fontWeight: '500', fontSize: 16 },
  cardStatus: { marginTop: 10, fontWeight: 'bold', fontSize: 16 },
  actions: { marginBottom: 24 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  actionText: { flex: 1, color: Colors.dark, fontWeight: '500', fontSize: 16 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: Colors.gray, marginBottom: 10 },
  txList: { backgroundColor: '#fff', borderRadius: 12, padding: 10 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 },
});

export default CardScreen;