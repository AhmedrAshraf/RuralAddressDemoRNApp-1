import React from 'react';
import styles from './introStyle';
import AppConfig from '../Utils/AppConfig';
// import Modal from 'react-native-modal';
// import VideoPlayer from 'react-native-video-controls';
import {View, Text, Image, TouchableOpacity, Linking} from 'react-native';

export default class Screen3 extends React.Component {
  state = {play: false};

  toggleModal = () => this.setState({play: !this.state.play});

  render() {
    return (
      <View style={styles.slide}>
        <Text style={styles.darkGreenTxt}>
          Aprenda como buscar o endereco rural{'\n'}conforme o video a seguir:
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.toggleModal}
          style={styles.playVideoBut2}>
          <Image
            style={styles.videoIcon}
            source={require('../assets/play.png')}
          />
          <Text style={styles.whiteTxt}>veja o </Text>
          <Text style={styles.boldTxt}>Video</Text>
        </TouchableOpacity>
        <Text style={styles.darkGreenTxt}>
          O Endereco Rural e uma iniciativa da sociedade civil organizada para
          tranzer cidadania as apessoas do compo, incorporando tecnologia para o
          endercamento figital dos imoveis rurais dos municipios.
        </Text>
        <Text style={styles.darkGreenTxt}>Conheca mais sobre o Enderco Rural:</Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL(AppConfig.openWebLink)}>
          www.enderecorural.com
        </Text>
        {/* <Modal
          isVisible={this.state.play}
          onBackdropPress={this.toggleModal}
          onBackButtonPress={this.toggleModal}>
          <View style={{height: 400}}>
            <VideoPlayer navigator={this.toggleModal} source={{uri: AppConfig.video1link}} />
          </View>
        </Modal> */}
      </View>
    );
  }
}
