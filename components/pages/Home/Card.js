import React, { useState, useEffect, useRef } from 'react';
import { Text, Dimensions, PanResponder, Animated, StyleSheet } from 'react-native';
import { Video, ResizeMode } from "expo-av";

const { width, height } = Dimensions.get('window');

export const Card = (props) => {
    const topVideo = useRef(null);
    useEffect(() => {
        props.setTopCardVideos(topVideo)
    }, [topVideo])
    var pan = new Animated.ValueXY();
    const [status, setStatus] = useState({});
    var cardPanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([
            null,
            { dx: pan.x, dy: pan.y },
        ]),
        onPanResponderRelease: (e, { dx }) => {
            const absDx = Math.abs(dx)
            const direction = absDx / dx

            if (absDx > 120) {
                Animated.decay(pan, {
                    velocity: { x: 3 * direction, y: 0 },
                    deceleration: 0.995,
                }).start(props.onSwipeOff)
            } else {
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    friction: 4.5,
                }).start()
            }
        },
    });

    const rotateCard = pan.x.interpolate({
        inputRange: [-200, 0, 200],
        outputRange: ['10deg', '0deg', '-10deg'],
    });

    const animatedStyle = {
        transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotate: rotateCard },
        ],
    }

    const likeOpacity = pan.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
    });

    const nopeOpacity = pan.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: [1, 0, 0],
        extrapolate: 'clamp'
    });

    return (
        <Animated.View
            {...cardPanResponder.panHandlers}
            style={[styles.card, animatedStyle]}>
            <Animated.View
                style={{
                    opacity: likeOpacity,
                    transform: [{ rotate: "-30deg" }],
                    position: "absolute",
                    top: 50,
                    left: 40,
                    zIndex: 1000
                }}
            >
                <Text
                    style={{
                        borderWidth: 1,
                        borderColor: "green",
                        color: "green",
                        fontSize: 32,
                        fontWeight: "800",
                        padding: 10
                    }}
                >
                    LIKE
                </Text>
            </Animated.View>
            <Animated.View
                style={{
                    opacity: nopeOpacity,
                    transform: [{ rotate: "30deg" }],
                    position: "absolute",
                    top: 50,
                    right: 40,
                    zIndex: 1000
                }}
            >
                <Text
                    style={{
                        borderWidth: 1,
                        borderColor: "red",
                        color: "red",
                        fontSize: 32,
                        fontWeight: "800",
                        padding: 10
                    }}
                >
                    NOPE
                </Text>
            </Animated.View>
            <Video
                videoStyle={{ position: 'relative', width: Dimensions.get("window").width, height: Dimensions.get("window").height }}
                ref={topVideo}
                style={{ width: "100%", height: Dimensions.get("window").height }}
                source={{ uri: props.profile.ipfsUrl }}
                rate={1.0}
                volume={1.0}
                // shouldPlay
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                onPlaybackStatusUpdate={status => { setStatus(() => status); props.setTopCardVideos(topVideo) }}
            />
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        width: width,
        height: height,
        overflow: 'hidden',
        backgroundColor: '#000',
        margin: 10,
        borderWidth: 0,
        borderColor: 'lightgrey',
        borderRadius: 8,
    },
});