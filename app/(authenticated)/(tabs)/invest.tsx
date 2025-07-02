import Colors from '@/constants/Colors';
import { Currency } from '@/interfaces/crypto';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const invest = () => {
  // Fetch top currencies (cryptos) from your API
  const { data: currencies, isLoading } = useQuery({
    queryKey: ['invest-listings'],
    queryFn: () => fetch('/api/listings').then(res => res.json()),
  });

  const onInvest = (currency: Currency) => {
    Alert.alert('Invest', `You have invested in ${currency.name} (${currency.symbol})!`);
  };

  return (
    <ScrollView style={{ backgroundColor: Colors.background }} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.header}>Top Investment Options</Text>
      {isLoading && <Text>Loading...</Text>}
      {currencies && currencies.length > 0 && currencies.slice(0, 10).map((currency: Currency) => (
        <View key={currency.id} style={styles.card}>
          <Image source={{ uri: `https://s2.coinmarketcap.com/static/img/coins/64x64/${currency.id}.png` }} style={styles.logo} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{currency.name}</Text>
            <Text style={styles.symbol}>{currency.symbol}</Text>
          </View>
          <TouchableOpacity style={styles.investBtn} onPress={() => onInvest(currency)}>
            <Ionicons name="trending-up" size={18} color="#fff" />
            <Text style={styles.investBtnText}>Invest</Text>
          </TouchableOpacity>
        </View>
      ))}
      {!isLoading && (!currencies || currencies.length === 0) && (
        <Text style={{ color: Colors.gray, marginTop: 20 }}>No investment options available.</Text>
      )}
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    gap: 16,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark,
  },
  symbol: {
    color: Colors.gray,
    fontSize: 14,
  },
  investBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  investBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default invest