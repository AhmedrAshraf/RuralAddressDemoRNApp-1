import React from 'react';
import styles from './introStyle';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class Terms extends React.Component {
  state = {agree: false};

  change = () => this.setState({agree: !this.state.agree});

  render() {
    const {agree} = this.state;
    let name = agree ? 'checkbox-marked' : 'checkbox-blank-outline';
    return (
      <View style={{flex: 1}}>
        <View style={styles.slide}>
          <Text style={styles.homeDetail}>Termos e condicoes de uso</Text>
          <Text style={styles.homeDetail}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries,
          </Text>
          <Text style={styles.homeDetail}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries,
          </Text>
          <View style={styles.agreementRow}>
            <Icon onPress={this.change} name={name} size={20} />
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
