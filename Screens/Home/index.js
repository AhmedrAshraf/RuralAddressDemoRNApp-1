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
import {StyleSheet, Linking, StatusBar, Share} from 'react-native';
import {View, Text, Image, TextInput, ScrollView, Alert} from 'react-native';

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
  };

  selectCity = (i) => this.setState({selectedCity: this.state.cities[i]});

  findAddress = () => {
    const {selectedCity, addressTxt} = this.state;
    if (addressTxt !== '') {
      let check = selectedCity.address.find((e) => e == addressTxt);
      if (check) {
        this.setState({address: true});
      } else {
        Alert.alert(
          'Endereco Nao encontratdo',
          'O endereco que voce buscou nao consta na nossa base de dados, por favor varifique se o endereco rural esta correto e lenle novamente',
          [
            {
              text: 'Ok',
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      }
    } else {
      Alert.alert(
        'Endereço inválido',
        'O endereço deve ser preenchido',
        [
          {
            text: 'Ok',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
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
                  <Picker.Item label={e.title} value={e.title} />
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
