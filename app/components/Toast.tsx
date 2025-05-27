import { AntDesign } from '@expo/vector-icons';
import Colors from 'config/Colors';
import { useToastContext } from 'contexts/ToastContext';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface ToastProps {}

const Toast: React.FC<ToastProps> = () => {
    const { toastState, toastDisplayDuration } = useToastContext();
    const [opacity] = useState(new Animated.Value(0));

    useEffect(() => {
        if (toastState.isToastVisible) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            const timeout = setTimeout(() => {
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }).start();
            }, toastDisplayDuration - 600); // allow enough time for the animation out

            return () => clearTimeout(timeout);
        }
    }, [toastState]);

    if (toastState.isToastVisible) {
        return (
            <Animated.View
                style={[
                    styles.toast,
                    { opacity },
                    { top: toastState.notification ? '14%' : '16%' },
                    { pointerEvents: toastState.isToastVisible ? 'auto' : 'none' },
                ]}
            >
                <View style={styles.content}>
                    {toastState.type === 'success' ? (
                        <AntDesign name="checkcircle" size={16} color="#52C41A" />
                    ) : (
                        <AntDesign name="closecircle" size={16} color="#FF4D4F" />
                    )}
                    <Text style={styles.message}>{toastState.message}</Text>
                </View>
            </Animated.View>
        );
    } else return null;
};

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        zIndex: 999,
    },
    content: {
        paddingHorizontal: RFPercentage(1.4),
        paddingVertical: RFPercentage(1.4),
        borderRadius: RFPercentage(1),
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
    },
    message: {
        backgroundColor: 'white',
        marginLeft: RFPercentage(1),
        color: Colors.blacktext,
        fontSize: RFPercentage(1.6),
        textAlign: 'center',
    },
});

export default Toast;
