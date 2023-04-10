import { StyleSheet } from 'react-native';
import Main from './components/Main';
import { Provider } from "react-redux";
import configureStore from "./components/configureStore";

const store = configureStore();

export default function App() {

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
