import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

const MenuSkeleton = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    const skeletonData = Array(2).fill({});

    useEffect(() => {
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulseAnimation.start();
        return () => pulseAnimation.stop();
    }, [opacity]);

    const animatedStyle = {
        opacity,
        backgroundColor: '#E0E0E0',
    };

    const SkeletonMenuItem = () => (
        <>
            <View style={styles.top} />
            <View style={styles.itemContainer}>
                <View
                    style={{
                        width: '92%',
                    }}
                >
                    <Animated.View
                        style={[
                            {
                                height: RFPercentage(2),
                                width: '80%',
                                borderRadius: RFPercentage(0.5),
                            },
                            animatedStyle,
                        ]}
                    />

                    <Animated.View style={[styles.status, animatedStyle]} />
                </View>
            </View>
        </>
    );

    return (
        <View style={styles.container}>
            {skeletonData.map((_, index) => (
                <SkeletonMenuItem key={`menu-skeleton-${index}`} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    top: {
        width: '92%',
        height: 1,
        backgroundColor: '#F5F5F5',
        alignSelf: 'center',
    },
    itemContainer: {
        paddingVertical: RFPercentage(1.6),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: RFPercentage(1),
    },
    status: {
        marginTop: RFPercentage(0.6),
        height: RFPercentage(2),
        width: '80%',
        borderRadius: RFPercentage(0.5),
    },
});

export default MenuSkeleton;
