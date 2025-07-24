import React from "react";
import { AppState, Linking } from "react-native";
import { ReactReduxContext } from "react-redux";
import WonderPush from "react-native-wonderpush";
// import {loginHandler} from 'services/oAuth20'; <- uncommnent this line if social login activated

export const AppStateContext = React.createContext({ appState: "" });
export class AppStateProvider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
    };

    this.appStateSubscription = null;
    this.linkingSubscription = null;
  }

  static contextType = ReactReduxContext;

  componentDidMount() {
    this.appStateSubscription = AppState.addEventListener("change", this._handleAppStateChange);
    this.linkingSubscription = Linking.addEventListener("url", this.handleOpenURL);

    this.checkOpeningUrl();
  }

  componentWillUnmount() {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove(); // ✅ Correct
    }
    if (this.linkingSubscription) {
      this.linkingSubscription.remove(); // ✅ Correct
    }
  }

  checkOpeningUrl = async () => {
    try {
      const url = await Linking.getInitialURL();
      if (url) {
        this.handleOpenURL({ url });
      }
    } catch { }
  };

  _handleAppStateChange = (nextAppState) => {
    this.setState({ appState: nextAppState });
  };

  handleOpenURL = ({ url }) => {
    // Handle the deep link here
  };

  render() {
    return (
      <AppStateContext.Provider value={this.state}>
        {this.props.children}
      </AppStateContext.Provider>
    );
  }
}
