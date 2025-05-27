import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors from 'config/Colors';

interface ListItemSkeletonProps {
    showBadge?: boolean; // Controls whether to show green left border
}

const ListItemSkeleton: React.FC<ListItemSkeletonProps> = ({
    showBadge = false,
}) => {
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

    const SkeletonItem = () => (
        <View
            style={[
                styles.itemContainer,
                {
                    borderLeftColor: showBadge
                        ? Colors.primary
                        : Colors.lightWhite,
                    borderLeftWidth: showBadge
                        ? RFPercentage(1)
                        : RFPercentage(0.1),
                },
            ]}
        >
            <Animated.View
                style={[
                    {
                        width: RFPercentage(5),
                        height: RFPercentage(5),
                        borderRadius: RFPercentage(0.7),
                    },
                    animatedStyle,
                ]}
            />

            <View style={{ width: "78%", marginLeft: RFPercentage(1.6) }}>
                <Animated.View
                    style={[
                        {
                            height: RFPercentage(1.4),
                            width: "100%",
                            borderRadius: RFPercentage(0.3),
                        },
                        animatedStyle,
                    ]}
                />

                <Animated.View style={[styles.description, animatedStyle]} />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {skeletonData.map((_, index) => (
                <SkeletonItem key={`list-skeleton-${index}`} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    itemContainer: {
        width: '92%',
        borderWidth: RFPercentage(0.1),
        borderRadius: RFPercentage(1),
        borderColor: Colors.lightWhite,
        padding: RFPercentage(1.6),
        paddingVertical: RFPercentage(1.8),
        backgroundColor: Colors.white,
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: RFPercentage(0.7),
    },
    description: {
        marginTop: RFPercentage(0.5),
        height: RFPercentage(1.4),
        width: '100%',
        borderRadius: RFPercentage(0.3),
    },
});

export default ListItemSkeleton;
