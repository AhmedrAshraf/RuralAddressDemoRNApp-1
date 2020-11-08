import React from 'react';
import styles from './introStyle';
import tick from '../assets/tick.png';
import {View, Text, TouchableOpacity, Image} from 'react-native';

export default class Terms extends React.Component {
  state = {agree: false};

  change = () => this.setState({agree: !this.state.agree});

  render() {
    const {agree} = this.state;
    let name = agree ? 'checkbox-marked' : 'checkbox-blank-outline';
    return (
      <View style={{flex: 1}}>
        <View style={styles.slide}>
          <Text style={styles.agreeHeadTxt}>Termos e condicoes de uso</Text>
          <Text style={styles.darkGreenTxt}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries,
          </Text>
          <Text style={styles.darkGreenTxt}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries,
          </Text>
          <View style={styles.agreementRow}>
            {agree ? (
              <TouchableOpacity
                activeOpacity={1}
                onPress={this.change}
                style={styles.checkBox1}>
                <Image source={tick} style={styles.tick} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={1}
                onPress={this.change}
                style={styles.checkBox2}
              />
            )}
            <Text onPress={this.change} style={styles.agreeTxt}>
              Concordo com os termos e condicoes de uso
            </Text>
          </View>
          <TouchableOpacity
            onPress={agree ? this.props.next : null}
            style={agree ? styles.next : styles.next1}>
            <Text style={styles.nexTxt}>Iniciar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
