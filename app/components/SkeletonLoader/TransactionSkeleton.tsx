import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ScrollView, Platform } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors from 'config/Colors';
import DisappearingScrollView from 'components/animations/DisappearingScrollView';

const TransactionSkeleton = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    const skeletonData = Array(10).fill({});

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
        <View style={styles.transactionContainer}>
            <View style={styles.contentContainer}>
                <View style={styles.leftContent}>
                    <Animated.View style={[styles.imagePlaceholder, animatedStyle]} />
                    <View style={styles.textContainer}>
                        <Animated.View style={[styles.titlePlaceholder, animatedStyle]} />
                        <Animated.View style={[styles.amountPlaceholder, animatedStyle]} />
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <DisappearingScrollView
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            >
                {skeletonData.map((_, index) => (
                    <SkeletonItem key={`skeleton-${index}`} />
                ))}
            </DisappearingScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        paddingHorizontal: RFPercentage(2),
        paddingVertical: RFPercentage(1),
    },
    transactionContainer: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.lightWhite,
        borderRadius: RFPercentage(1),
        padding: 0,
        marginVertical: RFPercentage(0.5),
        width: '100%',
        shadowColor: Platform.OS === 'ios' ? '#000000' : '#A9A9A9',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 3,
    },
    contentContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.lightgray,
        paddingVertical: RFPercentage(1.4),
        paddingHorizontal: RFPercentage(1.9),
        justifyContent: 'space-between',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '60%',
    },
    imagePlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 4,
    },
    textContainer: {
        marginLeft: 8,
    },
    titlePlaceholder: {
        width: '100%',
        height: RFPercentage(2),
        borderRadius: RFPercentage(0.5),
    },
    amountPlaceholder: {
        marginTop: RFPercentage(0.8),
        width: RFPercentage(31.4),
        height: RFPercentage(2),
        borderRadius: RFPercentage(0.5),
    },
    statusPlaceholder: {
        width: RFPercentage(10),
        height: RFPercentage(3),
        borderRadius: RFPercentage(0.5),
    },
});

export default TransactionSkeleton;
