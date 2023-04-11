import { ToastAndroid, Platform, AlertIOS, } from 'react-native';

export default Notification;

const Notification = value => {
    if (Platform.OS === "android") {
        ToastAndroid.show(value, ToastAndroid.SHORT);
    } else {
        AlertIOS.alert(value);
    }
}

module.exports = Notification;
