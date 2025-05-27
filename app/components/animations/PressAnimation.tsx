import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { TouchableWithoutFeedbackProps } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    AnimatedStyle,
} from 'react-native-reanimated';

export interface PressAnimationProps {
    children: React.ReactNode;
    onPress: () => void;
    wrapperStyle?: TouchableWithoutFeedbackProps['style'];
    style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}
const PressAnimation: React.FC<PressAnimationProps> = ({
    children,
    onPress,
    wrapperStyle,
    style,
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withTiming(0.96, { duration: 200 });
    };

    const handlePressOut = () => {
        scale.value = withTiming(1, { duration: 100 });
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={wrapperStyle}
        >
            <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
        </TouchableOpacity>
    );
};

export default PressAnimation;
