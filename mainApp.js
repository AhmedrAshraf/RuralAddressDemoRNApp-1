import React from 'react';
import Home from './src/Screens/Home';
import colors from './src/Utils/color';
import styles from './src/components/introStyle';
import Screen4 from './src/components/introScreen4';
import Screen1 from './src/components/introScreen1';
import Screen2 from './src/components/introScreen2';
import Screen3 from './src/components/introScreen3';
import {ActivityIndicator, View} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class App extends React.Component {
  state = {
    loading: true,
    startApp: false,
    keys: [{key: '1'}, {key: '2'}, {key: '3'}, {key: '4'}],
  };

  componentDidMount = async () => {
    let logged = await AsyncStorage.getItem('login');
    if (logged !== null) this.setState({loading: false, startApp: true});
    else this.setState({loading: false});
  };

  View = ({item}) => {
    const {key} = item;
    if (key === '1') return <Screen1 />;
    else if (key === '2') return <Screen2 />;
    else if (key === '3') return <Screen3 />;
    else if (key === '4') return <Screen4 next={this.next} />;
  };

  next = async () => {
    await AsyncStorage.setItem('login', 'true');
    this.setState({startApp: !this.state.startApp});
  };

  render() {
    const {startApp, keys, loading} = this.state;
    if (!loading) {
      if (startApp) return <Home next={this.next} />;
      else {
        return (
          <AppIntroSlider
            data={keys}
            onDone={this.next}
            dotStyle={styles.dot}
            renderItem={this.View}
            showDoneButton={false}
            showNextButton={false}
            activeDotStyle={styles.dot1}
          />
        );
      }
    } else {
      return (
        <View style={styles.slide}>
          <ActivityIndicator size={50} color={colors.loader} />
        </View>
      );
    }
  }
}
