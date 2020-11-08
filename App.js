import React, {useState, useEffect} from 'react';
import {
  View,
  Alert,
  Button,
  Linking,
  Platform,
  FlatList,
  StyleSheet,
} from 'react-native';
// import awsmobile from '.';
// AWS Amplify imports and settings ---
// import Amplify from '@aws-amplify/core';
import Amplify from 'aws-amplify';
import {DataStore, Predicates} from '@aws-amplify/datastore';
import {RuralAddress} from './src/models';
import awsmobile from './aws-exports';
// AWS Amplify imports and settings ---

// import ToastExample from './src/ToastExample';
import OsmAndHelper from './src/OsmAndHelper';
import ListItem from './src/components/ListItem';
import SearchItem from './src/components/SearchItem';

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
      const result = await DataStore.query(RuralAddress, (m) =>
        m.id('eq', text),
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
    const ruralAddressesFromDb = await DataStore.query(RuralAddress);

    Alert.alert(
      'Items loaded',
      `There are ${ruralAddressesFromDb.length} items in datase`,
    );
  };

  const navigate = async () => {
    console.log('currRuralAddress', currRuralAddress);
    // Note: I'm using MT_VRA_1 as a example, we need to use <STATE>_<CITY INITIALS (3 CHARS)>_<CODE>
    // For now, our app works only on Mato Grosso State ("MT") and only the City named "Vera" has the coordinates, plus the City initials.
    // To get the list of Cities from MT state call this API:
    // https://e1mmosz1xb.execute-api.us-east-1.amazonaws.com/production/estados/13/cidades
    // Header = Authorization:9c2d5ef0-fc50-11e7-9885-5f4f224882f3:aBcXvG5Z425EeSCIdwdsCOpoXR2XJuN8ltzhD9h6
    // and get the body property of the results, notice that only "Vera" city will have a property named "sigla":"VRA"
    // I'll fill all the cities with this properly in near future, but the app need to work righ now this way. You
    // can use the City name (property "nome") from this API whenever the "sigla" property does not exists or null.

    if (Platform.OS === 'android') {
      OsmAndHelper.navigate(
        null,
        0,
        0,
        'MT_VRA_1',
        +currRuralAddress.latitude,
        +currRuralAddress.longitude,
        'car',
        true,
      );
    }

    if (Platform.OS === 'ios') {
      const url = `osmandmaps://navigate?lat=${+currRuralAddress.latitude}&lon=${+currRuralAddress.longitude}&z=4&title=MT_VRA_1&profile=car&force=true`;
      // osmand ios app does not accept profile and force params yet, but does not throw error

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Navigate" onPress={() => navigate()} />
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
