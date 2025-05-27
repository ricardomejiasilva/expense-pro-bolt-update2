import React, { useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import type { ExpensePCard } from 'models/types';
import CloseIcon from '../svg/CloseIcon';
import { useAppContext } from 'contexts/AppContext';
import Toast from 'components/Toast';
import Colors from 'config/Colors';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';

interface PCardModalProps {
    isModalVisible: boolean;
    setIsModalVisible: (visible: boolean) => void;
}

const { width, height } = Dimensions.get('window');
const isIphoneSE = Platform.OS === 'ios' && width === 375 && height === 667;

const PCardModal: React.FC<PCardModalProps> = ({ isModalVisible, setIsModalVisible }) => {
    const { pCards, selectedPCard, setCardholderId, setIsPCardReceiptLoading } = useAppContext();

    const translateY = useSharedValue(height);
    const opacity = useSharedValue(0);
    const startY = useSharedValue(0);
    const hasAnimatedIn = useRef(false);

    useEffect(() => {
        if (!isModalVisible) {
            hasAnimatedIn.current = false;
            opacity.value = withTiming(0, { duration: 200 });
            translateY.value = withTiming(height, { duration: 300 });
        }
    }, [isModalVisible]);

    const gesture = Gesture.Pan()
        .onStart(() => {
            startY.value = translateY.value;
        })
        .onUpdate((event) => {
            const next = startY.value + event.translationY;
            translateY.value = Math.max(0, next);
        })
        .onEnd((event) => {
            const shouldClose = event.translationY > 100 || event.velocityY > 800;
            if (shouldClose) {
                opacity.value = withTiming(0, { duration: 200 });
                translateY.value = withTiming(height, { duration: 250 }, (finished) => {
                    if (finished) runOnJS(setIsModalVisible)(false);
                });
            } else {
                translateY.value = withTiming(0, { duration: 250 });
            }
        });

    const animatedContainerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const animatedContentStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const handlePress = (item: ExpensePCard) => {
        if (selectedPCard?.cardholderId === item.cardholderId) return;
        setCardholderId(item.cardholderId);
        setIsPCardReceiptLoading(true);
        setIsModalVisible(false);
    };

    const handleClose = () => {
        opacity.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(height, { duration: 250 }, (finished) => {
            if (finished) runOnJS(setIsModalVisible)(false);
        });
    };

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="none"
            onRequestClose={handleClose}
        >
            <Toast />
            <Reanimated.View style={[styles.container, animatedContainerStyle]}>
                <GestureDetector gesture={gesture}>
                    <Reanimated.View
                        onLayout={() => {
                            if (isModalVisible && !hasAnimatedIn.current) {
                                hasAnimatedIn.current = true;
                                opacity.value = withTiming(1, { duration: 400 });
                                translateY.value = withTiming(0, { duration: 400 });
                            }
                        }}
                        style={[styles.content, animatedContentStyle]}
                    >
                        <View style={styles.modalLine} />
                        <View style={styles.header}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text
                                    style={{
                                        color: Colors.blacktext,
                                        fontFamily: FontFamily.bold,
                                        fontSize: RFPercentage(1.9),
                                    }}
                                >
                                    PCard User
                                </Text>
                            </View>
                            <TouchableOpacity onPress={handleClose} style={{ paddingRight: 8 }}>
                                <CloseIcon />
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: RFPercentage(1) }} />

                        <ScrollView style={{ width: '100%' }}>
                            {pCards.map((item: ExpensePCard) => (
                                <TouchableOpacity
                                    key={item.cardholderId}
                                    onPress={() => handlePress(item)}
                                    style={[
                                        styles.buttonContainer,
                                        {
                                            backgroundColor:
                                                selectedPCard?.cardholderId === item.cardholderId
                                                    ? '#DFEEEC'
                                                    : undefined,
                                        },
                                    ]}
                                    activeOpacity={0.7}
                                >
                                    <View style={{ width: '92%' }}>
                                        <Text
                                            style={{
                                                color: Colors.blacktext,
                                                fontFamily: FontFamily.bold,
                                                fontSize: RFPercentage(1.6),
                                            }}
                                        >
                                            {item.legalName}'s PCard - {item.lastFourDigits}
                                        </Text>
                                        <View style={{ marginTop: RFPercentage(0.6) }}>
                                            <Text
                                                style={{
                                                    color: Colors.blacktext,
                                                    fontFamily: FontFamily.regular,
                                                    fontSize: RFPercentage(1.6),
                                                }}
                                            >
                                                {item.companyName} | {item.departmentName}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Reanimated.View>
                </GestureDetector>
            </Reanimated.View>
        </Modal>
    );
};

export default PCardModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
        width: '100%',
        maxHeight: isIphoneSE ? '58%' : '44%',
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingVertical: RFPercentage(1),
        paddingBottom: Platform.OS === 'ios' ? RFPercentage(5) : 16,
        alignItems: 'center',
    },
    modalLine: {
        width: 74,
        height: 3,
        backgroundColor: Colors.uploadGray,
        marginTop: RFPercentage(0.6),
    },
    header: {
        width: '92%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: RFPercentage(1.3),
    },
    buttonContainer: {
        paddingVertical: RFPercentage(1.6),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: RFPercentage(1),
    },
});
