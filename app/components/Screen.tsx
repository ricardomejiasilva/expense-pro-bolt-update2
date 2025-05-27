import React from 'react';
import {
    Platform,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    ViewStyle,
    View,
} from 'react-native';
import Colors from 'config/Colors';

interface ScreenProps {
    children: React.ReactNode;
    statusBarColor?: string;
    style?: ViewStyle;
    safeArea?: boolean;
}
const Screen: React.FC<ScreenProps> = ({
    children,
    statusBarColor = Colors.primary,
    style,
    safeArea = false,
}) => {
    return (
        <>
            {!safeArea ? (
                <View style={[styles.screen, style]}>
                    {Platform.OS === 'android' ? (
                        <StatusBar
                            backgroundColor={statusBarColor}
                            barStyle="dark-content"
                        />
                    ) : null}
                    {children}
                </View>
            ) : (
                <SafeAreaView style={[styles.screen, style]}>
                    {Platform.OS === 'android' ? (
                        <StatusBar
                            backgroundColor={statusBarColor}
                            barStyle="dark-content"
                        />
                    ) : null}
                    {children}
                </SafeAreaView>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
});

export default Screen;
