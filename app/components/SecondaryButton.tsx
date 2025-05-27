import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import AnimatedButton, { type AnimatedButtonProps } from './AnimatedButton';

interface SecondaryButtonProps extends Omit<AnimatedButtonProps, 'children'> {
    text: string;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
    text,
    onPress,
    containerStyle,
    buttonStyle,
    textStyle,
}) => {
    return (
        <AnimatedButton
            onPress={onPress}
            containerStyle={[containerStyle]}
            buttonStyle={[styles.button, buttonStyle]}
            textStyle={[styles.buttonText, textStyle]}
        >
            {text}
        </AnimatedButton>
    );
};

export default SecondaryButton;

const styles = StyleSheet.create({
    button: {
        width: '100%',
        paddingVertical: 11,
        borderRadius: RFPercentage(1),
        borderWidth: RFPercentage(0.15),
        borderColor: '#B7B7B7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: Colors.blacktext,
        fontSize: RFPercentage(1.9),
        fontFamily: FontFamily.regular,
    },
});
