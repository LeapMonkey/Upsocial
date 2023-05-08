import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Personalize = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Personalize!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        marginBottom: 10,
    },
});

export default Personalize;