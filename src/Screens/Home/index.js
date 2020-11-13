import React from 'react';
import Amplify from 'aws-amplify';
import {RuralAddress} from '../../models';
import OsmAndHelper from '../../OsmAndHelper';
import AppConfig from '../../Utils/AppConfig';
import img1 from '../../assets/icons/acao.png';
import img2 from '../../assets/icons/vera.png';
import awsmobile from '../../Utils/aws-exports';
import {DataStore} from '@aws-amplify/datastore';
import img3 from '../../assets/icons/03-ampa.png';
import img4 from '../../assets/icons/03-ampa.png';
import img8 from '../../assets/icons/08-cipen.png';
import img9 from '../../assets/icons/09-sicred.png';
import img7 from '../../assets/icons/07-famato.png';
import Ico from 'react-native-vector-icons/Ionicons';
import img5 from '../../assets/icons/05-aprosoja.png';
import {Picker} from '@react-native-community/picker';
import img6 from '../../assets/icons/06-sindicatos.png';
import Clipboard from '@react-native-community/clipboard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/FontAwesome5';
import {
  View,
  Text,
  Image,
  Share,
  Alert,
  Linking,
  Platform,
  TextInput,
  StatusBar,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
Amplify.configure(awsmobile);

export default class Home extends React.Component {
  state = {
    cities: [],
    address: false,
    addressTxt: '',
    selectedCity: null,
    ruralAddresses: [],
    selectedRuralAddress: undefined,
    images: [
      {logo: img1, url: AppConfig.url1},
      {logo: img2, url: AppConfig.url2},
      {logo: img3, url: AppConfig.url3},
      {logo: img4, url: AppConfig.url4},
      {logo: img5, url: AppConfig.url5},
      {logo: img6, url: AppConfig.url6},
      {logo: img7, url: AppConfig.url7},
      {logo: img8, url: AppConfig.url8},
      {logo: img9, url: AppConfig.url9},
    ],
  };

  componentDidMount = async () => {
    await DataStore.observe(RuralAddress).subscribe((msg) => {
      let array = [...this.state.ruralAddresses, msg.element];
      this.setState({ruralAddresses: array});
    });
    await fetch(AppConfig.getCityApi, {
      method: 'GET',
      headers: {Authorization: AppConfig.getCityApiHeader},
    })
      .then((response) => response.json())
      .then((e) => {
        let cities = [];
        let data = JSON.parse(e.body);
        for (let i = 0; i < data.length; i++) {
          if (data[i].sigla) {
            cities.push(data[i]);
          }
        }
        this.setState({cities});
      });
  };

  selectCity = (i) => {
    const {cities} = this.state;
    this.setState({selectedCity: cities[i]});
  };

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
      } else {
        const searchTerm = `MT_${selectedCity.sigla}_${addressTxt}`;
        const result = await DataStore.query(RuralAddress, (m) =>
          m.id('eq', searchTerm),
        );
        if (!result.length) {
          Alert.alert(
            'Endereço não encontrado',
            'O endereço que você buscou não consta na nossa base de dados, por favor verifique se o endereço rural está correto e tente novamente',
            [{text: 'Ok', style: 'cancel'}],
            {cancelable: false},
          );
        } else {
          this.setState({address: true, selectedRuralAddress: result[0]});
        }
      }
    } catch (error) {
      console.log(error);
      alert('Something Went Wrong! Please Try Again');
    }
  };

  navigate = async () => {
    const {id, latitude, longitude} = this.state.selectedRuralAddress;
    if (Platform.OS === 'android') {
      OsmAndHelper.navigate(null, 0, 0, id, +latitude, +longitude, 'car', true);
    }
    if (Platform.OS === 'ios') {
      const url = `osmandmaps://navigate?lat=${+latitude}&lon=${+longitude}&z=4&title=${id}&profile=car&force=true`;
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`this URL is not supported: ${url}`);
      }
    }
  };

  copyCoordinates = async () => {
    let address = this.state.selectedRuralAddress;
    if (address) {
      Clipboard.setString(`${address.latitude},${address.longitude}`);
      Alert.alert('', 'Coordenadas copiadas');
    }
  };

  shareCoordinates = () => {
    const address = this.state.selectedRuralAddress;
    const message = `${AppConfig.webNavigatorUrl}${address.latitude}/${address.longitude}`;
    Share.share({message});
  };

  openWebMap = () => {
    const {selectedRuralAddress} = this.state;
    const content = `${AppConfig.webNavigatorUrl}${selectedRuralAddress.latitude}/${selectedRuralAddress.longitude}`;
    Linking.openURL(content);
  };

  render() {
    const {cities, images, address, addressTxt, selectedCity} = this.state;
    let ico = address ? styles.iconBlue : styles.icons;
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor="#0081c7" />
        <View style={styles.header}>
          <Text
            style={styles.headTxt}
            onPress={() => Linking.openURL(AppConfig.reportProblem)}>
            Reportar Problema
          </Text>
          <Text style={styles.headTxt} onPress={this.props.next}>
            Ajuda
          </Text>
        </View>
        <View style={styles.inputBox}>
          <Text style={styles.lable}>Buscar município</Text>
          <View style={styles.searchSection}>
            <Ico style={styles.searchIcon} name="ios-search" />
            <Picker
              style={styles.input1}
              placeholder="Buscar municipio"
              onValueChange={(e, i) => this.selectCity(i)}
              selectedValue={selectedCity && selectedCity.nome}>
              {!!cities.length &&
                cities.map((e, i) => (
                  <Picker.Item key={i} label={e.nome} value={e.nome} />
                ))}
            </Picker>
          </View>
          <Text style={styles.lable}>Buscar endereço rural</Text>
          <View style={styles.row}>
            <View style={styles.searchSection}>
              <Ico style={styles.searchIcon} name="ios-search" />
              {selectedCity && (
                <Text style={styles.cityCode}>{selectedCity.sigla}</Text>
              )}
              <TextInput
                value={addressTxt}
                placeholder="Buscar endereço rural"
                style={selectedCity ? styles.input : styles.input2}
                onChangeText={(e) => this.setState({addressTxt: e})}
              />
            </View>
            <Text style={styles.serachBut} onPress={this.findAddress}>
              Buscar
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.centerIcon}
          activeOpacity={address ? 0.5 : 1}
          onPress={address ? this.navigate : null}>
          <Icon name="navigation" style={ico} />
          <Text style={styles.bottomLable}>Inicar</Text>
        </TouchableOpacity>
        <View style={styles.centerIconRow}>
          <TouchableOpacity
            style={styles.IconBox}
            activeOpacity={address ? 0.5 : 1}
            onPress={address ? this.copyCoordinates : null}>
            <Ico name="earth" style={ico} />
            <Text style={styles.bottomLable}>Copiar{'\n'}Coordenadas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.IconBox}
            activeOpacity={address ? 0.5 : 1}
            onPress={address ? this.shareCoordinates : null}>
            <Ico name="paper-plane" style={ico} />
            <Text style={styles.bottomLable}>
              Compartihar{'\n'}endereço rural
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.IconBox}
            activeOpacity={address ? 0.5 : 1}
            onPress={address ? this.openWebMap : null}>
            <Icons name="map-marked-alt" style={ico} />
            <Text style={styles.bottomLable}>WebMapa</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subHead}>patrocinadores</Text>
        <ScrollView>
          <View style={styles.sponsersBox}>
            {images.map((e, i) => (
              <TouchableOpacity key={i} onPress={() => Linking.openURL(e.url)}>
                <Image source={e.logo} style={styles.logos} />
              </TouchableOpacity>
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
    paddingBottom: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    padding: 0,
    width: '60%',
  },
  input2: {
    padding: 0,
    width: '72%',
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
    width: 100,
    height: 100,
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
