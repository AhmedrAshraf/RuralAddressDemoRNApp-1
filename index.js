import React from 'react';
import 'react-native-gesture-handler';
import Home from './src/Screens/Home';
import colors from './src/Utils/color';
import cross from './src/assets/cross.png';
import {name as appName} from './app.json';
import {TouchableOpacity} from 'react-native';
import styles from './src/components/introStyle';
import Screen1 from './src/components/introScreen1';
import Screen2 from './src/components/introScreen2';
import Screen3 from './src/components/introScreen3';
import Screen4 from './src/components/introScreen4';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, View, AppRegistry, Image} from 'react-native';

export default class App extends React.Component {
  state = {
    login: false,
    loading: true,
    startApp: false,
    help: ['1', '2', '3'],
    keys: ['1', '2', '3', '4'],
  };

  componentDidMount = async () => {
    let logged = await AsyncStorage.getItem('login');
    if (logged !== null) {
      this.setState({loading: false, startApp: true, login: true});
    } else {
      AsyncStorage.setItem('login', 'true');
      this.setState({loading: false});
    }
  };

  View = ({item}) => {
    if (item === '1') return <Screen1 />;
    else if (item === '2') return <Screen2 />;
    else if (item === '3') return <Screen3 />;
    else if (item === '4') return <Screen4 next={this.next} />;
  };

  next = () => this.setState({startApp: !this.state.startApp});

  render() {
    const {startApp, keys, help, loading, login} = this.state;
    if (!loading) {
      if (startApp) return <Home next={this.next} />;
      else {
        return (
          <View style={{flex: 1, backgroundColor: colors.lightGreen}}>
            {login && (
              <TouchableOpacity onPress={() => this.next()}>
                <Image source={cross} style={styles.cross} />
              </TouchableOpacity>
            )}
            <AppIntroSlider
              onDone={this.next}
              dotStyle={styles.dot}
              renderItem={this.View}
              showDoneButton={false}
              showNextButton={false}
              data={login ? help : keys}
              activeDotStyle={styles.dot1}
            />
          </View>
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

AppRegistry.registerComponent(appName, () => App);
