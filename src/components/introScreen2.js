import React from 'react';
import styles from './introStyle';
import Modal from 'react-native-modal';
import AppConfig from '../Utils/AppConfig';
import VideoPlayer from 'react-native-video-controls';
import {
  View,
  Text,
  Image,
  Linking,
  Platform,
  TouchableOpacity,
} from 'react-native';

export default class Screen2 extends React.Component {
  state = {play: false};

  toggleModal = () => this.setState({play: !this.state.play});

  render() {
    return (
      <View style={styles.slide}>
        <Text style={styles.darkGreenTxt}>
          O OsmaAnd Maps é um aplicativo de acesso livre, que permite ao usuário
          navegar até o imóvel rural mesmo sem internet. baixe o aplicativo
          OsmaAnd Maps antes de começar a usar o Endereço Rural e baixe a base
          rodoviária de Mato Grosso conforme o vídeo.
        </Text>
        <Text style={styles.subHead}>Baixe o OsmaAnd:</Text>
        {Platform.OS === 'android' ? (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.playStoreBut}
            onPress={() => Linking.openURL(AppConfig.playStoreAppUrl)}>
            <Image
              style={styles.play}
              source={require('../assets/googleplay.png')}
            />
            <Text style={styles.whiteTxt}>Baixe na </Text>
            <Text style={styles.boldTxt}>Google Play</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.appStoreBut}
            onPress={() => Linking.openURL(AppConfig.appleStoreAppUrl)}>
            <Image
              style={styles.apple}
              source={require('../assets/apple.png')}
            />
            <Text style={styles.whiteTxt}>Baixe na </Text>
            <Text style={styles.boldTxt}>App Store</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.subHead}>
          Baixe a base rodoviária de Mato Grosso{'\n'}no OsmAnd conforme o vídeo
          a seguir:
        </Text>
        <TouchableOpacity
          onPress={this.toggleModal}
          style={styles.playVideoBut}>
          <Image
            style={styles.videoIcon}
            source={require('../assets/play.png')}
          />
          <Text style={styles.whiteTxt}>veja o </Text>
          <Text style={styles.boldTxt}>Video</Text>
        </TouchableOpacity>
        <Modal
          isVisible={this.state.play}
          onBackdropPress={this.toggleModal}
          onBackButtonPress={this.toggleModal}>
          <View style={{height: 400}}>
            <VideoPlayer
              navigator={this.toggleModal}
              source={{uri: AppConfig.video1link}}
            />
          </View>
        </Modal>
      </View>
    );
  }
}
