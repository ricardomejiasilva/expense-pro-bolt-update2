import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import UploadOptions, { type UploadOptionsProps } from './UploadOptions';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors from 'config/Colors';

interface UploadPopoverProps {
    isVisible: boolean;
    onSelect: UploadOptionsProps['onSelect'];
}

const UploadPopover: React.FC<UploadPopoverProps> = ({ isVisible, onSelect }) => {
    const scale = useSharedValue(0);
    const bottom = useSharedValue(0);
    const height = useSharedValue(0);

    const animatedContainerStyle = useAnimatedStyle(() => ({
        bottom: bottom.value,
        height: height.value,
    }));

    const animatedPopoverStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    useEffect(() => {
        if (isVisible) {
            // Logic to show the popover
            scale.value = withTiming(1, { duration: 400 });
            bottom.value = withTiming(120, { duration: 300 });
            height.value = withTiming(200, { duration: 400 }); // Replace "initial" with a numeric height value
        } else {
            // Logic to hide the popover
            scale.value = withTiming(0, { duration: 400 });
            bottom.value = withTiming(20, { duration: 500 });
            height.value = withTiming(0, { duration: 400 });
        }
    }, [isVisible]);

    return (
        <Animated.View style={[styles.container, animatedContainerStyle]}>
            <Animated.View style={[styles.popover, animatedPopoverStyle]}>
                <UploadOptions onSelect={onSelect} />
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: RFPercentage(10),
        position: 'absolute',
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popover: {
        width: 230,
        backgroundColor: Colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.06)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 1,
    },
});

export default UploadPopover;
