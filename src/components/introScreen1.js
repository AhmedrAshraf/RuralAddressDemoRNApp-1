import React from 'react';
import styles from './introStyle';
import {View, Text, Image} from 'react-native';

export default class Home extends React.Component {
  render() {
    return (
      <View style={styles.slide}>
        <Text style={styles.homeHead}>ENDEREÇO</Text>
        <Text style={styles.homeHead}>RURAL</Text>
        <Image style={styles.homeLogo} source={require('../assets/LOGO.png')} />
        <Text style={styles.homeSubHead}>Bem Vindo</Text>
        <Text style={styles.darkGreenTxt}>
          Encontre o imóvel rural de forma rápida e fácil. Mas antes será
          preciso fazer algumas configurações e aprender um pouco sobre a
          solução Endereço Rural.
        </Text>
      </View>
    );
  }
}
