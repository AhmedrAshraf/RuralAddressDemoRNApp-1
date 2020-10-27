import React from 'react';
import img1 from '../../assets/icons/acao.png';
import img2 from '../../assets/icons/vera.png';
import img3 from '../../assets/icons/03-ampa.png';
import img4 from '../../assets/icons/03-ampa.png';
import img8 from '../../assets/icons/08-cipen.png';
import img9 from '../../assets/icons/09-sicred.png';
import img7 from '../../assets/icons/07-famato.png';
import Ico from 'react-native-vector-icons/Ionicons';
import img5 from '../../assets/icons/05-aprosoja.png';
import {Picker} from '@react-native-community/picker';
import img6 from '../../assets/icons/06-sindicatos.png';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {StyleSheet, Linking, StatusBar, Share, Platform} from 'react-native';
import {View, Text, Image, TextInput, ScrollView, Alert} from 'react-native';

// AWS Amplify imports and settings ---
// import Amplify from '@aws-amplify/core';
import Amplify from 'aws-amplify';
import {DataStore, Predicates} from '@aws-amplify/datastore';
import {RuralAddress} from '../../src/models';
import awsmobile from '../../aws-exports';
// AWS Amplify imports and settings ---

import OsmAndHelper from '../../src/OsmAndHelper';

Amplify.configure(awsmobile);
let subscription;

export default class Home extends React.Component {
  state = {
    address: false,
    addressTxt: '',
    cities: [
      {title: 'Vera-mt', key: 'VRA', address: ['500', '400', '200']},
      {title: 'Abrantes', key: 'ABT', address: ['50', '140', '150']},
    ],
    selectedCity: {
      key: 'VRA',
      title: 'Vera-mt',
      address: ['500', '400', '200'],
    },
    images: [img1, img2, img3, img4, img5, img6, img7, img8, img9],
    ruralAddresses: [],
    selectedRuralAddress: undefined,
  };

  componentDidMount() {
    const subscription = DataStore.observe(RuralAddress).subscribe((msg) => {
      // console.log(JSON.stringify(msg.model), msg.opType, msg.element);
      console.log(JSON.stringify(msg.element));

      this.state.ruralAddresses = [...this.state.ruralAddresses, msg.element];

      console.log('RuralAddress:', JSON.stringify(this.state.ruralAddresses));
    });
  }

  selectCity = (i) => this.setState({selectedCity: this.state.cities[i]});

  findAddress = async () => {
    try {
      const {selectedCity, addressTxt} = this.state;

      if (addressTxt === '') {
        Alert.alert(
          'Endereço inválido',
          'O endereço deve ser preenchido',
          [{text: 'Ok', style: 'cancel'}],
          {cancelable: false},
        );
      }

      const searchTerm = `MT_${selectedCity.key}_${addressTxt}`;

      console.log('searchTerm', searchTerm);

      const result = await DataStore.query(RuralAddress, (m) =>
        m.id('eq', searchTerm),
      );

      if (result === undefined) {
        Alert.alert(
          'Endereço não encontrado',
          'O endereço que você buscou não consta na nossa base de dados, por favor verifique se o endereço rural está correto e tente novamente',
          [{text: 'Ok', style: 'cancel'}],
          {cancelable: false},
        );
        return;
      }

      console.log('Endereço Rural encontrado!', result);

      this.setState({address: true, selectedRuralAddress: result[0]});
    } catch (error) {
      console.log(error);
    }
  };

  navigate = async () => {
    const {selectedRuralAddress} = this.state;

    console.log('selectedRuralAddress', selectedRuralAddress);

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
        selectedRuralAddress.id,
        +selectedRuralAddress.latitude,
        +selectedRuralAddress.longitude,
        'car',
        true,
      );
    }

    if (Platform.OS === 'ios') {
      const url = `osmandmaps://navigate?lat=${+selectedRuralAddress.latitude}&lon=${+selectedRuralAddress.longitude}&z=4
      &title=${selectedRuralAddress.id}&profile=car&force=true`;
      // osmand ios app does not accept profile and force params yet, but does not throw error

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }
  };

  render() {
    const {selectedCity, cities, address, addressTxt, images} = this.state;
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor="#0081c7" />
        <View style={styles.header}>
          <Text
            style={styles.headTxt}
            onPress={() => {
              Linking.openURL('https://www.enderecorural.com/reportarproblema');
            }}>
            Reportar Problema
          </Text>
          <Text style={styles.headTxt} onPress={this.props.next}>
            Ajuda
          </Text>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.lable}>Buscar municipio</Text>
          <View style={styles.searchSection}>
            <Ico style={styles.searchIcon} name="ios-search" />
            <Picker
              style={styles.input1}
              placeholder="Buscar municipio"
              selectedValue={selectedCity.title}
              onValueChange={(e, i) => this.selectCity(i)}>
              {cities.length &&
                cities.map((e) => (
                  <Picker.Item key={e.key} label={e.title} value={e.title} />
                ))}
            </Picker>
          </View>
          <Text style={styles.lable}>Buscar endereco rural</Text>
          <View style={styles.row}>
            <View style={styles.searchSection}>
              <Ico style={styles.searchIcon} name="ios-search" />
              <Text style={styles.cityCode}>{selectedCity.key}</Text>
              <TextInput
                style={styles.input}
                placeholder="Buscar endereco rural"
                onChangeText={(e) => this.setState({addressTxt: e})}
              />
            </View>
            <Text style={styles.serachBut} onPress={this.findAddress}>
              Buscar
            </Text>
          </View>
        </View>
        <View style={styles.centerIcon}>
          <Icon
            onPress={this.navigate}
            name="navigation"
            style={address ? styles.iconBlue : styles.icons}
          />
          <Text style={styles.bottomLable}>Inicar</Text>
        </View>
        <View style={styles.centerIconRow}>
          <View style={styles.IconBox}>
            <Ico
              name="earth"
              style={address ? styles.iconBlue : styles.icons}
            />
            <Text style={styles.bottomLable}>Copiar{'\n'}Coordenadas</Text>
          </View>
          <View style={styles.IconBox}>
            <Ico
              name="paper-plane"
              style={address ? styles.iconBlue : styles.icons}
              onPress={() => address && Share.share({message: addressTxt})}
            />
            <Text style={styles.bottomLable}>
              Compartihar{'\n'}endereco rural
            </Text>
          </View>
          <View style={styles.IconBox}>
            <Icons
              name="map-marked-alt"
              style={address ? styles.iconBlue : styles.icons}
            />
            <Text style={styles.bottomLable}>WebMapa</Text>
          </View>
        </View>
        <Text style={styles.subHead}>patrocinadores</Text>
        <ScrollView>
          <View style={styles.sponsersBox}>
            {images.map((e, i) => (
              <Image source={e} key={i} style={styles.logos} />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#0081c7',
    justifyContent: 'space-between',
  },
  headTxt: {
    padding: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    padding: 0,
    width: '60%',
  },
  input1: {
    padding: 0,
    width: '90%',
  },
  searchSection: {
    padding: 0,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gainsboro',
    justifyContent: 'flex-start',
  },
  cityCode: {
    color: 'gray',
    marginRight: 5,
    paddingRight: 5,
    borderRightWidth: 1,
    borderRightColor: 'silver',
  },
  searchIcon: {
    padding: 5,
    fontSize: 20,
    color: '#000',
  },
  lable: {
    marginTop: 30,
  },
  inputBox: {
    width: '85%',
    alignSelf: 'center',
  },
  iconBlue: {
    padding: 10,
    fontSize: 30,
    color: 'white',
    borderRadius: 50,
    backgroundColor: '#0081c7',
  },
  icons: {
    padding: 10,
    fontSize: 30,
    color: 'white',
    borderRadius: 50,
    backgroundColor: 'gray',
  },
  centerIcon: {
    width: '105%',
    marginTop: 30,
    alignItems: 'center',
  },
  centerIconRow: {
    width: '85%',
    marginTop: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomLable: {
    color: 'gray',
    textAlign: 'center',
  },
  IconBox: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  subHead: {
    color: 'gray',
    marginTop: 20,
    paddingLeft: 20,
    paddingBottom: 4,
    marginBottom: 2 /*4 gray sponsor box, comment it*/,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: 'gainsboro',
  },
  sponsersBox: {
    flex: 1,
    padding: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    /*backgroundColor: '#EEEEEE'*/
  },
  logos: {
    width: 120,
    height: 120,
    marginVertical: 10,
    resizeMode: 'cover',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serachBut: {
    marginTop: 5,
    color: 'white',
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#0081c7',
  },
});
