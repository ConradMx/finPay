import { View, Text, ScrollView, StyleSheet, Button } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import RoundBtn from '@/src/components/RoundBtn'
import Dropdown from '@/src/components/DropDown'
import { useBalanceStore } from '@/store/balanceStore'
import { defaultStyles } from '@/constants/Styles'
import { Ionicons } from '@expo/vector-icons'
import WidgetList from '@/src/components/SortableList/WidgetList';
import { useHeaderHeight } from '@react-navigation/elements'

const home = () => {
    const {balance, runTransaction, transactions, clearTransactions}= useBalanceStore();
const headerHeight = useHeaderHeight();

    const onAddMoney = () => {
      console.log('Adding money');
runTransaction({
  id: Math.random ().toString(),
  amount: Math.floor(Math.random() * 1000),
  date: new Date(),
  title: 'Added Money'
})
    }
  return (

    <ScrollView style={{backgroundColor: Colors.background}} 
    contentContainerStyle={{
      paddingTop: headerHeight,
    }}>
    <View style= {styles.account}>
      <View style={styles.row}>
        <Text style={styles.currency}>₦</Text>
<Text style={styles.balance}>{balance()}</Text>

      </View>
    </View>

    <View style={styles.actionRow}>

         <RoundBtn icon={'add'} text={'Add money'} onPress={onAddMoney}/>
         <RoundBtn icon={'refresh'} text={'Exchange'}onPress={clearTransactions}/>
           <RoundBtn icon={'list'} text={'Details'} />
          <Dropdown/>
    </View>
    <Text style={defaultStyles.sectionHeader}>Transaction</Text>
    <View style={styles.transactions}>
      {transactions.length === 0 && (  
        <Text style={{padding:14, color:Colors.gray}}> N0 transactions yet</Text>  
        )}
       
{transactions.map((transaction) => (
  <View key={transaction.id} style={{flexDirection:'row', alignItems:'center', gap:20}}>
    <View style={styles.circle}>
      <Ionicons name={transaction.amount > 0 ? 'add' : 'remove'} size={24} color={Colors.dark}/>
    </View>
    <View style={{flex:1}}>
      <Text style={{fontWeight:'500'}}>{transaction.title}</Text>
      <Text style={{color:Colors.gray, fontSize:12}}>
        {transaction.date
          ? new Date(transaction.date).toLocaleString()
          : ''}
      </Text>
    </View>
    <Text>₦{transaction.amount}</Text>
  </View>
))}

    </View>
    <Text style={defaultStyles.sectionHeader}>Widgets</Text>
    <WidgetList />
    </ScrollView>
  )
}




const styles = StyleSheet.create({ 
    account:{
        margin:80,
        alignItems:'center'
    },
    row:{
        flexDirection:'row',
        alignItems:'center',
    },
    balance:{
fontSize:60,
fontWeight:'bold'
    },

    currency:{
fontSize:57,
fontWeight:'500'
    },
    actionRow:{
        flexDirection:'row',
        justifyContent:'space-between',
        padding:20,
    },
    transactions:{
      marginHorizontal:20,
      padding:14,
      backgroundColor: '#fff',
      borderRadius:16,
      gap:20,
    },
    circle:{
      width:40,
      height:40,
      borderRadius:20,
      backgroundColor: Colors.lightGray,
      justifyContent:'center',
      alignItems:'center',
    }

})
export default home
