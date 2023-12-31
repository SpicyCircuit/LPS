import React, { useEffect, useState, useContext } from 'react';
import { Text, View, Alert, FlatList, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

import UserContext from '../constants/UserContext.js';
import { styles } from '../utils/styleSheet.js';

const transactionDB = SQLite.openDatabase('transactionData.db');

const HistoryScreen = ({ navigation }) => {
  const { User, setUser } = useContext(UserContext);
  const [DATA, setData] = useState(null);

  useEffect(() => {
    transactionDB.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT * FROM transactions WHERE userId = ?',
          [User],
          (_, { rows }) => {
            if (rows.length > 0) {
              setData(rows._array);
            }
          },
          (error) => {
            console.log('Transaction Error:', error);
            Alert.alert('Error', 'Unable to retrieve orders at this time');
          }
        );
      }
    );
  }, [User]);

  const renderTransactions = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('PurchasedTicketInfo', { ticketId: item.ticketId })}
      >
        <View>
          <Text style={styles.subTitle}>
            {item.ticketName}: {"\n\t"}numbers: {item.numbers}, {"\n\t"}winnings: ${item.winnings}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleNavigateToRedeemableTickets = () => {
    navigation.navigate('RedeemableTicketScreen');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderTransactions}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => (
          <View>
            <Text style={styles.subTitle}>No Transactions</Text>
          </View>
        )}
      />
      <Button title="Redeemable Tickets" onPress={handleNavigateToRedeemableTickets} />
    </View>
  );
};

export default HistoryScreen;
