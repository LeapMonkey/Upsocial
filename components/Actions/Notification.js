import { ToastAndroid, Platform } from 'react-native';

export default Notification;

const Notification = value => {
    if (Platform.OS === "android") {
        ToastAndroid.show(value, ToastAndroid.SHORT);
    }
}

module.exports = Notification;
