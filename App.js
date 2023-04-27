import { StyleSheet, View } from 'react-native';
import Main from './components/Main';
import { Provider } from "react-redux";
import configureStore from "./components/configureStore";
import * as serviceWorkerRegistration from "./src/serviceWorkerRegistration";


const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    width: 400,
    height: "100%",
    position: 'relative'
  },
  header: {
    height: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "#000"
  },
  footer: {
    height: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "#000"
  }
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();