import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const lifestyleActions = [
  { icon: 'fast-food-outline', label: 'Order Food' },
  { icon: 'car-outline', label: 'Book Ride' },
  { icon: 'phone-portrait-outline', label: 'Buy Airtime' },
  { icon: 'tv-outline', label: 'Pay TV Bills' },
  { icon: 'school-outline', label: 'Learn & Earn' },
];

const lifestyle = () => {
  return (
    <ScrollView style={{ backgroundColor: Colors.background }} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.header}>Lifestyle & Perks</Text>
      <View style={styles.summaryCard}>
        <Ionicons name="gift-outline" size={40} color={Colors.primary} style={{ marginBottom: 10 }} />
        <Text style={styles.summaryTitle}>Cashback & Rewards</Text>
        <Text style={styles.summaryText}>Get up to 5% cashback on select lifestyle purchases every month!</Text>
      </View>
      <Text style={styles.sectionHeader}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        {lifestyleActions.map((action, idx) => (
          <TouchableOpacity key={action.label} style={styles.actionBtn} onPress={() => {}}>
            <Ionicons name={action.icon} size={28} color={Colors.primary} />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.sectionHeader}>Tips for a Smarter Lifestyle</Text>
      <View style={styles.tipBox}>
        <Text style={styles.tipText}>• Track your spending to save more each month.{'\n'}• Use rewards for everyday purchases.{'\n'}• Explore new ways to earn with our Learn & Earn program.</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: 6,
  },
  summaryText: {
    color: Colors.gray,
    fontSize: 15,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray,
    marginBottom: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginBottom: 32,
    justifyContent: 'space-between',
  },
  actionBtn: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 14,
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  actionLabel: {
    marginTop: 8,
    color: Colors.dark,
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },
  tipBox: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tipText: {
    color: Colors.dark,
    fontSize: 15,
    lineHeight: 22,
  },
});

export default lifestyle