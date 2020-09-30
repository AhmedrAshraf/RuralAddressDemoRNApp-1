/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Button,
  Platform,
} from 'react-native';

// AWS Amplify imports and settings ---
// import Amplify from '@aws-amplify/core';
import Amplify from 'aws-amplify';
import {DataStore, Predicates} from '@aws-amplify/datastore';
import {RuralAddress} from './src/models';
import awsmobile from './aws-exports';
// AWS Amplify imports and settings ---

import ToastExample from './src/ToastExample';
import OsmAndHelper from './src/OsmAndHelper';
import ListItem from './components/ListItem';
import SearchItem from './components/SearchItem';

Amplify.configure(awsmobile);
let subscription;

// AWS Amplify imports and settings ---

const Separator = () => <View style={styles.separator} />;

const App = () => {
  async function listRuralAddresses(setRuralAddresses) {
    const ruralAddresses = await DataStore.query(
      RuralAddress,
      Predicates.arguments,
    );

    setRuralAddresses(ruralAddresses);
  }

  const [ruralAddresses, setRuralAddresses] = useState([]);
  const [currRuralAddress, setCurrRuralAddress] = useState(undefined);

  /*useState(() => {
    const subscription = DataStore.observe().subscribe(console.log);

    return () => subscription.unsubscribe();
  }, [])*/

  useEffect(() => {
    const subscription = DataStore.observe(RuralAddress).subscribe((msg) => {
      // console.log(JSON.stringify(msg.model), msg.opType, msg.element);
      console.log(JSON.stringify(msg.element));

      setRuralAddresses([...ruralAddresses, msg.element]);

      console.log('RuralAddress:', JSON.stringify(ruralAddresses));
    });

    return () => subscription.unsubscribe();
  });

  const searchItem = async (text) => {
    try {
      const item = 'MT_VRA_1';
      console.log('item', item);
      const result = await DataStore.query(RuralAddress, (m) =>
        m.id('eq', item),
      );

      if (result === undefined) {
        Alert.alert('Item not found!');
        return;
      }

      console.log('Item Found!', result[0]);
      Alert.alert('Item Found!', `Item ${result[0].id} - ${result[0].status}`);

      setCurrRuralAddress(result[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const loadDatabase = async () => {
    const ruralAddressesFromDb = await DataStore.query(RuralAddress); //todo: sort

    Alert.alert(
      'Items loaded',
      `There are ${ruralAddressesFromDb.length} items in datase`,
    );
  };

  function showToast() {
    ToastExample.show(
      `${Platform.OS} - ${Platform.Version}`,
      ToastExample.LONG,
    );
  }

  const navigate = () => {
    console.log('currRuralAddress', currRuralAddress);

    // OsmAndHelper.doNothing();

     OsmAndHelper.navigate(null,
                               0, 0,
                               "MT_VRA_1", +currRuralAddress.latitude, +currRuralAddress.longitude,
                               "car", true);
  };

  return (
    <View style={styles.container}>
      <Button title="Navigate" onPress={() => navigate()} />
      <Separator />
      <Button title="Load Sample NativeModule" onPress={() => showToast()} />
      <Separator />
      <SearchItem searchItem={searchItem} />
      <Separator />
      <Button title="Load Database" onPress={() => loadDatabase()} />
      <Separator />
      <FlatList
        data={ruralAddresses}
        renderItem={({item}) => <ListItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, paddingTop: 60},
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default App;
