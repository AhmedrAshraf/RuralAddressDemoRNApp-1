import React from 'react';
import styles from './introStyle';
import {View, Text, Image} from 'react-native';

export default class Home extends React.Component {
  render() {
    return (
      <View style={styles.slide}>
        <Text style={styles.homeHead}>ENDERCO</Text>
        <Text style={styles.homeHead}>RURAL</Text>
        <Image style={styles.homeLogo} source={require('../assets/LOGO.png')} />
        <Text style={styles.homeSubHead}>Bem Vindo</Text>
        <Text style={styles.homeDetail}>
          Encontre o imovel rural de forma rapida e facil. Mas antes sera
          preciso fazer algumas configuracoes e aprender um pouco sobre a
          solucao Endereco Rural.
        </Text>
      </View>
    );
  }
}
