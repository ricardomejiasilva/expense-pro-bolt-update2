import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppLoading from './AppLoading';

const AppLoadingWithOverlay: React.FC = () => {
    return (
        <View style={styles.transparentOverlay}>
            <AppLoading />
        </View>
    );
};

const styles = StyleSheet.create({
    transparentOverlay: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1001,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AppLoadingWithOverlay;
