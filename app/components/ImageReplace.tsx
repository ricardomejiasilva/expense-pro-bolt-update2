import React, { useState } from 'react';
import {
    Modal,
    TouchableOpacity,
    Text,
    StyleSheet,
    ImageSourcePropType,
    View,
    Platform,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { handleUploadSelection } from 'utils/uploadUtils';
import { RootStackParamList } from 'models/types';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import UploadModal from './modals/UploadModal';
import ZoomIcon from './svg/ZoomIcon';
import SwapIcon from './svg/SwapIcon';
import ReceiptImage from './ReceiptImage';
import Alert from './Alert';
import AppLoadingWithOverlay from './AppLoadingWithOverlay';
import { useModalContext } from 'contexts/ModalContext';
import { useOcrContext } from 'contexts/OcrContext';
import Toast from './Toast';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ImageReplaceProps {
    image: string | ImageSourcePropType | null;
}

const ImageReplace: React.FC<ImageReplaceProps> = ({ image }) => {
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const navigation = useNavigation<NavigationProp>();
    const scale = useSharedValue(1);
    const { ocrState, setOcrState, handleOcrSubmission } = useOcrContext();
    const { isImageDisplayModalVisible, setIsImageDisplayModalVisible } = useModalContext();

    // Simpler pinch gesture implementation
    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = Math.max(0.5, Math.min(event.scale, 3));
        })
        .onEnd(() => {
            scale.value = withTiming(1, { duration: 250 });
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handleReplaceImage = (newImage: string) => {
        if (newImage) {
            handleOcrSubmission(newImage, true);
        }
    };

    const toggleImageDisplayModal = () => {
        setIsImageDisplayModalVisible(!isImageDisplayModalVisible);
    };

    const receiptImageSource = ocrState.ocrImage
        ? { uri: ocrState.ocrImage }
        : image
        ? typeof image === 'string'
            ? { uri: image }
            : image
        : undefined;

    const isPDF = typeof image === 'string' && image.toLowerCase().endsWith('.pdf');

    return (
        <View style={styles.imageUploader}>
            {ocrState.isSubmitting && <AppLoadingWithOverlay />}

            {ocrState.errorMessage && ocrState.isErrorDisplayed && (
                <Alert
                    description={ocrState.errorMessage}
                    isDismissable={true}
                    onDismiss={() =>
                        setOcrState({
                            ...ocrState,
                            isErrorDisplayed: false,
                        })
                    }
                />
            )}

            <View style={styles.borderWrapper}>
                <GestureHandlerRootView style={styles.container}>
                    <View style={styles.imageContainer}>
                        <ReceiptImage
                            source={receiptImageSource}
                            style={styles.image}
                            previewOnly={isPDF}
                            isModal={isPDF}
                            pdfHeight={'86%'}
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            style={styles.zoomButton}
                            onPress={toggleImageDisplayModal}
                            activeOpacity={0.7}
                        >
                            <ZoomIcon />
                            <Text style={styles.zoomText}>Tap to Zoom</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setIsUploadModalVisible(true)}
                        style={styles.replaceButton}
                    >
                        <SwapIcon />
                        <Text style={styles.replaceText}>Replace</Text>
                    </TouchableOpacity>

                    <Modal visible={isImageDisplayModalVisible} transparent={true}>
                        <Toast />
                        <GestureHandlerRootView style={{ flex: 1 }}>
                            <TouchableOpacity
                                style={styles.modalContainer}
                                onPress={toggleImageDisplayModal}
                                activeOpacity={1}
                            >
                                <View style={styles.gestureContainer}>
                                    <GestureDetector gesture={pinchGesture}>
                                        <Animated.View style={[animatedStyle, styles.animatedView]}>
                                            <ReceiptImage
                                                source={receiptImageSource}
                                                resizeMode="contain"
                                                isModal={true}
                                                toggleModal={toggleImageDisplayModal}
                                            />
                                        </Animated.View>
                                    </GestureDetector>
                                </View>
                                {!isPDF && (
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={toggleImageDisplayModal}
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
                                handleReplaceImage
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
        minHeight: 272,
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
        minHeight: Platform.OS === 'ios' ? 234 : 239,
    },
    image: {
        width: '100%',
        backgroundColor: 'transparent',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        minHeight: Platform.OS === 'ios' ? 234 : 239,
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
    errorText: {
        backgroundColor: 'transparent',
        color: Colors.red,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
        marginTop: RFPercentage(0.9),
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

export default ImageReplace;
