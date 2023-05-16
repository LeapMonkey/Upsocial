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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();