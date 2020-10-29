import React from 'react';
import styles from './introStyle';
// import Modal from 'react-native-modal';
// import VideoPlayer from 'react-native-video-controls';
import {View, Text, Image, TouchableOpacity, Linking} from 'react-native';

export default class Screen3 extends React.Component {
  state = {play: false};

  toggleModal = () => this.setState({play: !this.state.play});

  render() {
    return (
      <View style={styles.slide}>
        <Text style={styles.homeDetail}>
          Aprenda como buscar o endereco rural{'\n'}conforme o video a seguir:
        </Text>
        <TouchableOpacity
          onPress={this.toggleModal}
          style={styles.playVideoBut2}>
          <Image
            style={styles.videoIcon}
            source={require('../assets/play.png')}
          />
          <Text style={styles.whiteTxt}>veja o </Text>
          <Text style={styles.boldTxt}>Video</Text>
        </TouchableOpacity>
        <Text style={styles.homeDetail}>
          O Endereco Rural e uma iniciativa da sociedade civil organizada para
          tranzer cidadania as apessoas do compo, incorporando tecnologia para o
          endercamento figital dos imoveis rurais dos municipios.
        </Text>
        <Text style={styles.text}>Conheca mais sobre o Enderco Rural:</Text>
        <Text
          style={styles.link}
          onPress={() => {
            Linking.openURL('https://www.enderecorural.com.com');
          }}>
          www.enderecorural.com
        </Text>
        {/* <Modal
          isVisible={this.state.play}
          onBackdropPress={this.toggleModal}
          onBackButtonPress={this.toggleModal}>
          <View style={{height: 400}}>
            <VideoPlayer
              navigator={this.toggleModal}
              source={{uri: 'https://vjs.zencdn.net/v/oceans.mp4'}}
            />
          </View>
        </Modal> */}
      </View>
    );
  }
}
