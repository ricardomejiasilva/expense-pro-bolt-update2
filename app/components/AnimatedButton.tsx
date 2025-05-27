import React from 'react';
import { StyleSheet, Text, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { type TouchableWithoutFeedbackProps } from 'react-native-gesture-handler';
import { type AnimatedStyle } from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';

import Colors from 'config/Colors';
import { FontFamily } from 'config/Fonts';
import PressAnimation from './animations/PressAnimation';

export interface AnimatedButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    containerStyle?: TouchableWithoutFeedbackProps['style'];
    buttonStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
    textStyle?: StyleProp<TextStyle>;
}
const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    children,
    containerStyle,
    buttonStyle,
    textStyle,
    onPress,
}) => {
    return (
        <PressAnimation wrapperStyle={containerStyle} style={buttonStyle} onPress={onPress}>
            <Text style={[styles.buttonText, textStyle]}>{children}</Text>
        </PressAnimation>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        color: Colors.white,
        fontSize: RFPercentage(1.9),
        fontFamily: FontFamily.regular,
    },
});

export default AnimatedButton;
