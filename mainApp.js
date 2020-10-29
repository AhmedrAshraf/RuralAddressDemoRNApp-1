import React from 'react';
import Home from './Screens/Home';
import Terms from './components/terms';
import Screen1 from './components/introHome';
import styles from './components/introStyle';
import Screen2 from './components/introScreen2';
import Screen3 from './components/introScreen3';
import AppIntroSlider from 'react-native-app-intro-slider';

export default class App extends React.Component {
  state = {
    startApp: false,
    keys: [{key: 1}, {key: 2}, {key: 3}, {key: 4}],
  };

  View = ({item}) => {
    if (item.key == 1) {
      return <Screen1 />;
    } else if (item.key == 2) {
      return <Screen2 />;
    } else if (item.key == 3) {
      return <Screen3 />;
    } else if (item.key == 4) {
      return <Terms next={this.next} />;
    }
  };

  next = () => this.setState({startApp: !this.state.startApp});

  render() {
    const {startApp, keys} = this.state;
    if (startApp) {
      return <Home next={this.next} />;
    } else {
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
  }
}
