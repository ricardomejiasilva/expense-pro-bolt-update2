import React from 'react';
import { StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import AnimatedButton, { type AnimatedButtonProps } from './AnimatedButton';

interface PrimaryButtonProps extends Omit<AnimatedButtonProps, 'children'> {
    text: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
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
const styles = StyleSheet.create({
    button: {
        width: '100%',
        paddingVertical: RFPercentage(1.4),
        borderRadius: RFPercentage(1),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
    },
    buttonText: {
        color: Colors.white,
        fontSize: RFPercentage(1.9),
        fontFamily: FontFamily.regular,
    },
});
export default PrimaryButton;
