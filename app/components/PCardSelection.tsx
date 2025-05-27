import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { MaterialIcons } from '@expo/vector-icons';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import PCardModal from './modals/PCardModal';
import { useAppContext } from 'contexts/AppContext';
import PCardSelectionSkeleton from './SkeletonLoader/PCardSkeleton';

const PCardSelection = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const { selectedPCard, isPCardReceiptLoading } = useAppContext();

    useEffect(() => {
        if (isModalVisible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    }, [isModalVisible]);

    const handlePress = () => {
        setIsModalVisible(true);
    };
    return (
        <>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: RFPercentage(1.3),
                }}
            >
                {isPCardReceiptLoading ? (
                    <PCardSelectionSkeleton />
                ) : (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.blacktext,
                                fontFamily: FontFamily.medium,
                                fontSize: RFPercentage(1.6),
                            }}
                        >
                            You are currently using
                        </Text>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                            activeOpacity={0.7}
                            onPress={handlePress}
                        >
                            <Text
                                style={{
                                    marginLeft: RFPercentage(0.5),
                                    marginRight: RFPercentage(0),
                                    color: Colors.primary,
                                    fontFamily: FontFamily.medium,
                                    fontSize: RFPercentage(1.6),
                                }}
                            >
                                {`${selectedPCard?.firstName} ${selectedPCard?.lastName.charAt(0)}`}
                                's PCard
                            </Text>

                            <MaterialIcons
                                name="keyboard-arrow-down"
                                size={24}
                                color={Colors.primary}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <PCardModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
        </>
    );
};

export default PCardSelection;
