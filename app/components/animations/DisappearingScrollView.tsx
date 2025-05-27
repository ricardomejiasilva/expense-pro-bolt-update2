import React, { useRef, useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    AnimatedScrollViewProps,
} from 'react-native-reanimated';

interface DisappearingScrollViewProps extends AnimatedScrollViewProps {
    children: React.ReactNode[];
}

const DisappearingScrollView: React.FC<DisappearingScrollViewProps> = ({
    children,
    style,
    ...rest
}) => {
    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y;
    });

    return (
        <Animated.ScrollView
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            scrollEnabled={true}
            style={[styles.container, style]}
            {...rest}
        >
            {children.map((child: React.ReactNode, index: number) => {
                // Track layout positions outside of worklet/hooks
                const [layoutY, setLayoutY] = useState<number[]>([]);
                const layoutYRef = useRef<number[]>([]);
                const handleLayout = useCallback(
                    (event: any) => {
                        const y = event.nativeEvent.layout.y;
                        layoutYRef.current[index] = y;
                        setLayoutY([...layoutYRef.current]);
                    },
                    [index]
                );

                const animatedStyle = useAnimatedStyle(() => {
                    const childLayoutY = layoutY[index] || 0;
                    const scale = interpolate(
                        scrollY.value,
                        [childLayoutY - 100, childLayoutY, childLayoutY + 100],
                        [1, 1, 0],
                        Extrapolation.CLAMP
                    );

                    const opacity = interpolate(
                        scrollY.value,
                        [childLayoutY - 100, childLayoutY, childLayoutY + 100],
                        [1, 1, 0],
                        Extrapolation.CLAMP
                    );

                    return {
                        transform: [{ scale }],
                        opacity,
                    };
                });

                return (
                    <Animated.View
                        key={index}
                        style={[styles.childView, animatedStyle]}
                        onLayout={handleLayout}
                    >
                        {child}
                    </Animated.View>
                );
            })}
        </Animated.ScrollView>
    );
};

export default DisappearingScrollView;

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    childView: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
