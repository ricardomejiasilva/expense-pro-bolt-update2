import React, { useState, useEffect, useRef } from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
    Text,
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    Platform,
} from 'react-native';
import { FontFamily } from 'config/Fonts';
import { useNavigation } from '@react-navigation/native';
import { handleUploadSelection } from '../../utils/uploadUtils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from 'models/types';
import Colors from 'config/Colors';
import AppLine from '../AppLine';
import PrimaryButton from '../PrimaryButton';
import PostedReceipt from '../PostedReceipts';
import SecondaryButton from '../SecondaryButton';
import CloseIcon from '../svg/CloseIcon';
import LeftArrow from '../svg/LeftArrow';
import { useAppContext } from 'contexts/AppContext';
import { useFormContext } from 'contexts/FormContext';
import { handleAttachReceipt } from 'utils/appContextUtils';
import Toast from 'components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToastContext } from 'contexts/ToastContext';
import Icons from 'config/Icons_temp';
import Reanimated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import DisappearingScrollView from 'components/animations/DisappearingScrollView';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AttachReceiptModalProps {
    isModalVisible: boolean;
    setIsModalVisible: (visible: boolean) => void;
}

const AttachReceiptModal = ({ isModalVisible, setIsModalVisible }: AttachReceiptModalProps) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [selectedReceiptId, setSelectedReceiptId] = useState<number | null>(null);
    const [attachEnabled, setAttachEnabled] = useState(false);
    const { showToast } = useToastContext();
    const translateY = useSharedValue(height);
    const opacity = useSharedValue(0);
    const startY = useSharedValue(0);
    const hasAnimatedIn = useRef(false);
    const isMounted = useRef(true);

    const {
        shortForm,
        pCardReceipts,
        quietlyRefreshPCardReceipts,
        selectedReceiptTransaction,
        setIsUploadModalVisible,
        setIsAttachingReceipt,
        setIsTransactionModalVisible,
    } = useAppContext();
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (!isModalVisible) {
            hasAnimatedIn.current = false;
            opacity.value = withTiming(0, { duration: 200 });
            translateY.value = withTiming(height, { duration: 300 });
        }
    }, [isModalVisible]);

    const animatedContainerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const animatedContentStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const closeModalAnimated = () => {
        setAttachEnabled(false);
        setIsModalVisible(false);
    };

    const animateAndCloseModal = (onCloseComplete?: () => void) => {
        opacity.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(height, { duration: 250 }, (finished) => {
            if (finished) {
                runOnJS(closeModalAnimated)();
                if (onCloseComplete) runOnJS(onCloseComplete)();
            }
        });
    };

    const gesture = Gesture.Pan()
        .onStart(() => {
            startY.value = translateY.value;
        })
        .onUpdate((event) => {
            translateY.value = Math.max(0, startY.value + event.translationY);
        })
        .onEnd((event) => {
            const shouldClose = event.translationY > 100 || event.velocityY > 800;
            if (shouldClose) {
                opacity.value = withTiming(0, { duration: 200 });
                translateY.value = withTiming(height, { duration: 250 }, (finished) => {
                    if (finished) runOnJS(closeModal)();
                });
            } else {
                translateY.value = withTiming(0, { duration: 250 });
            }
        });

    const handlePress = (i: number, id: number) => {
        setSelectedReceiptId(id);
        setSelectedIndex(i);
    };

    const closeAndOpenUploadModal = () => {
        setIsModalVisible(false);
        setTimeout(() => {
            setIsAttachingReceipt(true);
            setIsUploadModalVisible(true);
        }, 50);
    };

    const handlePrimaryPress = async () => {
        if (selectedReceiptId && selectedReceiptTransaction?.transaction.id) {
            await handleAttachReceipt(
                selectedReceiptTransaction.transaction.id,
                selectedReceiptId,
                quietlyRefreshPCardReceipts,
                () => showToast('Receipt successfully attached to transaction.', 'success', false),
                () => showToast('Unable to attach receipt to transaction.', 'error', false)
            );
            animateAndCloseModal();
        } else {
            opacity.value = withTiming(0, { duration: 200 });
            translateY.value = withTiming(height, { duration: 250 }, (finished) => {
                if (finished) {
                    runOnJS(closeAndOpenUploadModal)();
                }
            });
        }
    };

    const handleSecondaryPress = () => {
        setAttachEnabled((prev) => !prev);
    };

    const handleContinueWithoutReceipt = async () => {
        handleUploadSelection(
            null,
            setIsUploadModalVisible,
            navigation,
            shortForm,
            null,
            true,
            () => {
                setIsModalVisible(false);
            }
        );
        setIsModalVisible(false);
        await AsyncStorage.setItem('isAttachingReceipt', 'true');
    };

    const submittedReceipts = pCardReceipts.filter((item) => !item.transaction);
    const emptyReceipts = submittedReceipts.length === 0;

    const truncateTitle = (title: string) =>
        title.length > 15 ? title.substring(0, 15) + '...' : title;

    return (
        <Modal visible={isModalVisible} transparent animationType="none">
            <Toast />
            <Reanimated.View style={[styles.container, animatedContainerStyle]}>
                <GestureDetector gesture={gesture}>
                    <Reanimated.View
                        style={[styles.content, animatedContentStyle]}
                        onLayout={() => {
                            if (isModalVisible && !hasAnimatedIn.current) {
                                hasAnimatedIn.current = true;
                                opacity.value = withTiming(1, { duration: 350 });
                                translateY.value = withTiming(0, { duration: 400 });
                            }
                        }}
                    >
                        <View style={styles.modalLine} />
                        <View style={styles.header}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {attachEnabled && (
                                    <TouchableOpacity
                                        onPress={() => setAttachEnabled(false)}
                                        style={{ marginRight: 8, padding: 4 }}
                                    >
                                        <LeftArrow />
                                    </TouchableOpacity>
                                )}
                                <Text
                                    style={{
                                        color: Colors.blacktext,
                                        fontFamily: FontFamily.bold,
                                        fontSize: RFPercentage(1.9),
                                    }}
                                >
                                    Attach Receipt -{' '}
                                </Text>
                                <Text
                                    style={{
                                        color: Colors.textGray,
                                        fontFamily: FontFamily.regular,
                                        fontSize: RFPercentage(1.9),
                                    }}
                                >
                                    {truncateTitle(selectedReceiptTransaction?.supplier ?? '')}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => animateAndCloseModal()}
                                style={{ paddingRight: 8 }}
                            >
                                <CloseIcon />
                            </TouchableOpacity>
                        </View>

                        <AppLine />

                        {attachEnabled && !emptyReceipts && (
                            <DisappearingScrollView
                                style={{ width: '100%', padding: 16, height: '40%' }}
                            >
                                {(() => {
                                    // Ensure all child elements are in a single array so the animation can work
                                    const elements: React.ReactNode[] = [];
                                    elements.push(
                                        ...submittedReceipts.map((item, i) => (
                                            <PostedReceipt
                                                key={i}
                                                index={i}
                                                item={item}
                                                selectedIndex={selectedIndex}
                                                onPress={() => handlePress(i, item.receipt.id)}
                                            />
                                        ))
                                    );
                                    elements.push(
                                        <View
                                            style={{ height: 24 }}
                                            key={submittedReceipts.length + 1}
                                        />
                                    );
                                    return elements;
                                })()}
                            </DisappearingScrollView>
                        )}

                        {attachEnabled && emptyReceipts && (
                            <View style={styles.emptyContainer}>
                                <Image
                                    source={Icons.Noevent}
                                    style={{ width: RFPercentage(12), height: RFPercentage(8) }}
                                />
                                <Text style={styles.emptySubText}>
                                    You currently have no{'\n'}receipts to attach.
                                </Text>
                            </View>
                        )}

                        {!attachEnabled || !emptyReceipts ? (
                            <View style={{ width: '92%' }}>
                                <PrimaryButton
                                    text={attachEnabled ? 'Attach Receipt' : 'New Receipt'}
                                    onPress={handlePrimaryPress}
                                    containerStyle={styles.loginbutton}
                                />
                                <SecondaryButton
                                    text={attachEnabled ? 'Cancel' : 'Previously Submitted Receipt'}
                                    containerStyle={styles.loginbutton}
                                    onPress={handleSecondaryPress}
                                />
                            </View>
                        ) : null}

                        {!attachEnabled && (
                            <TouchableOpacity
                                style={{
                                    width: '100%',
                                    alignItems: 'center',
                                    marginTop: RFPercentage(2.2),
                                }}
                                onPress={handleContinueWithoutReceipt}
                            >
                                <Text style={{ color: Colors.link, fontSize: RFPercentage(1.9) }}>
                                    Continue without receipt image
                                </Text>
                            </TouchableOpacity>
                        )}
                    </Reanimated.View>
                </GestureDetector>
            </Reanimated.View>
        </Modal>
    );
};

export default AttachReceiptModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingVertical: RFPercentage(1),
        paddingBottom: Platform.OS === 'ios' ? RFPercentage(5) : RFPercentage(1.9),
        alignItems: 'center',
    },
    modalLine: {
        width: 74,
        height: 3,
        backgroundColor: Colors.uploadGray,
        marginTop: RFPercentage(0.2),
        marginBottom: RFPercentage(0.4),
    },
    header: {
        width: '92%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: RFPercentage(1),
        marginBottom: RFPercentage(1.9),
    },
    loginbutton: {
        marginTop: RFPercentage(1.2),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        width: '92%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: RFPercentage(0.15),
        borderColor: Colors.borderColor,
        borderRadius: 6,
        marginTop: RFPercentage(2.4),
        paddingVertical: RFPercentage(14),
        paddingHorizontal: RFPercentage(4),
    },
    emptySubText: {
        marginTop: RFPercentage(0.9),
        marginBottom: RFPercentage(6),
        textAlign: 'center',
        fontSize: RFPercentage(1.6),
        color: Colors.blacktext,
    },
});
