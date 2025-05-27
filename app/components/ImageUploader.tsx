// Merged version of ImageUploader and ImageReplace with 'long' support

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Text,
    Platform,
    ImageSourcePropType,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from 'models/types';
import { useOcrContext } from 'contexts/OcrContext';
import { useModalContext } from 'contexts/ModalContext';

import ReceiptImage from './ReceiptImage';
import ZoomIcon from './svg/ZoomIcon';
import SwapIcon from './svg/SwapIcon';
import UploadModal from './modals/UploadModal';
import Alert from './Alert';
import AppLoadingWithOverlay from './AppLoadingWithOverlay';
import Toast from './Toast';
import Colors from 'config/Colors';
import { FontFamily } from 'config/Fonts';
import { handleUploadSelection } from 'utils/uploadUtils';

interface ImageUploaderProps {
    image: string | ImageSourcePropType | null;
    setImage?: (image: string) => void;
    updateTransactionDataWithOcrData?: boolean;
    long?: boolean;
    runOcrOnMount?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    image,
    setImage,
    updateTransactionDataWithOcrData = false,
    long = false,
    runOcrOnMount = false,
}) => {
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const scale = useSharedValue(1);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const isImageReplacedRef = useRef(false);

    const { ocrState, handleOcrSubmission, setOcrState } = useOcrContext();
    const { setIsUploadingMissingReceipt } = useModalContext();

    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = Math.max(0.5, Math.min(event.scale, 3));
        })
        .onEnd(() => {
            scale.value = withTiming(1, { duration: 250 });
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    useEffect(() => {
        if (
            image &&
            typeof image === 'string' &&
            image !== ocrState.ocrImage &&
            (runOcrOnMount || isImageReplacedRef.current)
        ) {
            handleOcrSubmission(image, updateTransactionDataWithOcrData);
            setIsUploadingMissingReceipt(false);
            isImageReplacedRef.current = false; // reset after triggering
        }
    }, [image]);

    const receiptImageSource = ocrState.ocrImage
        ? { uri: ocrState.ocrImage }
        : image && typeof image === 'string'
        ? { uri: image }
        : image || undefined;

    const isPDF = typeof image === 'string' && image.toLowerCase().endsWith('.pdf');

    const errorMessage = ocrState.isLowConfidence
        ? 'Receipt image is not readable to autofill details. Provide a clearer image or continue to manually enter details.'
        : ocrState.errorMessage;

    return (
        <View style={styles.imageUploader}>
            {ocrState.isSubmitting && <AppLoadingWithOverlay />}

            {errorMessage && ocrState.isErrorDisplayed && (
                <Alert
                    description={errorMessage}
                    isDismissable
                    onDismiss={() => setOcrState({ ...ocrState, isErrorDisplayed: false })}
                />
            )}

            <View style={styles.borderWrapper}>
                <GestureHandlerRootView style={[styles.container, { minHeight: long ? 350 : 272 }]}>
                    <View
                        style={[
                            styles.imageContainer,
                            {
                                minHeight:
                                    Platform.OS === 'ios' ? (long ? 350 : 234) : long ? 355 : 260,
                            },
                        ]}
                    >
                        <ReceiptImage
                            source={
                                typeof receiptImageSource === 'string'
                                    ? { uri: receiptImageSource }
                                    : receiptImageSource
                            }
                            style={[
                                styles.image,
                                {
                                    height: long ? RFPercentage(38) : RFPercentage(28),
                                    minHeight:
                                        Platform.OS === 'ios'
                                            ? long
                                                ? 350
                                                : 250
                                            : long
                                            ? 365
                                            : 260,
                                },
                            ]}
                            previewOnly={isPDF}
                            isModal={isPDF}
                            pdfHeight={'86%'}
                            resizeMode="cover"
                        />

                        <TouchableOpacity
                            style={styles.zoomButton}
                            onPress={() => setIsImageModalVisible(true)}
                            activeOpacity={0.7}
                        >
                            <ZoomIcon />
                            <Text style={styles.zoomText}>Tap to Zoom</Text>
                        </TouchableOpacity>
                    </View>

                    {setImage && (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setIsUploadModalVisible(true)}
                            style={styles.replaceButton}
                        >
                            <SwapIcon />
                            <Text style={styles.replaceText}>Replace</Text>
                        </TouchableOpacity>
                    )}

                    <Modal visible={isImageModalVisible} transparent={true}>
                        <Toast />
                        <GestureHandlerRootView style={{ flex: 1 }}>
                            <TouchableOpacity
                                style={styles.modalContainer}
                                onPress={() => setIsImageModalVisible(false)}
                                activeOpacity={1}
                            >
                                <View style={styles.gestureContainer}>
                                    <GestureDetector gesture={pinchGesture}>
                                        <Animated.View style={[animatedStyle, styles.animatedView]}>
                                            <ReceiptImage
                                                source={
                                                    typeof receiptImageSource === 'string'
                                                        ? { uri: receiptImageSource }
                                                        : receiptImageSource
                                                }
                                                resizeMode="contain"
                                                isModal={true}
                                                toggleModal={() => setIsImageModalVisible(false)}
                                            />
                                        </Animated.View>
                                    </GestureDetector>
                                </View>
                                {!isPDF && (
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setIsImageModalVisible(false)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                )}
                            </TouchableOpacity>
                        </GestureHandlerRootView>
                    </Modal>

                    <UploadModal
                        isModalVisible={isUploadModalVisible}
                        setIsModalVisible={setIsUploadModalVisible}
                        handleUploadSelection={(item) =>
                            handleUploadSelection(
                                item,
                                setIsUploadModalVisible,
                                navigation,
                                false,
                                (uri) => {
                                    isImageReplacedRef.current = true;
                                    setImage?.(uri);
                                }
                            )
                        }
                    />
                </GestureHandlerRootView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    imageUploader: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flex: 1,
    },
    borderWrapper: {
        padding: Platform.OS === 'ios' ? 1 : 0,
        backgroundColor: Colors.borderColor,
        borderRadius: 8,
        width: '92%',
        marginTop: RFPercentage(1),
        zIndex: 1000,
        overflow: 'hidden',
        ...(Platform.OS === 'android' && {
            borderWidth: 1,
            borderColor: Colors.borderColor,
            elevation: 0,
        }),
    },
    container: {
        width: '100%',
        borderRadius: 7,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
        flexGrow: 1,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        position: 'relative',
        alignItems: 'center',
        backgroundColor: Colors.gray,
        justifyContent: 'flex-start',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        backgroundColor: 'transparent',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        alignSelf: 'stretch',
        resizeMode: 'contain',
    },
    zoomButton: {
        flexDirection: 'row',
        position: 'absolute',
        top: RFPercentage(1),
        backgroundColor: Colors.black,
        opacity: 0.85,
        paddingVertical: RFPercentage(0.5),
        paddingHorizontal: RFPercentage(0.9),
        borderRadius: RFPercentage(16),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        zIndex: 10,
    },
    zoomText: {
        marginLeft: RFPercentage(0.9),
        color: Colors.white,
    },
    replaceButton: {
        borderTopWidth: 1,
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: RFPercentage(1),
        flexDirection: 'row',
        alignSelf: 'stretch',
        width: '100%',
    },
    replaceText: {
        marginLeft: RFPercentage(1),
        color: Colors.link,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.9),
        fontWeight: '300',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    gestureContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatedView: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        bottom: RFPercentage(4),
        backgroundColor: Colors.black,
        opacity: 0.85,
        paddingVertical: RFPercentage(0.8),
        paddingHorizontal: RFPercentage(1.8),
        borderRadius: RFPercentage(2),
        zIndex: 10,
    },
    closeButtonText: {
        color: Colors.white,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.8),
    },
});

export default ImageUploader;
