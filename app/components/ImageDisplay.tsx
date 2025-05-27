import React from 'react';
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
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors from 'config/Colors';
import ZoomIcon from './svg/ZoomIcon';
import ReceiptImage from './ReceiptImage';
import { useModalContext } from 'contexts/ModalContext';
import Toast from './Toast';

interface ImageDisplayProps {
    image: string | ImageSourcePropType | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image }) => {
    const isPDF = typeof image === 'string' && image.toLowerCase().endsWith('.pdf');
    const imageSource = image ? (typeof image === 'string' ? { uri: image } : image) : undefined;
    const scale = useSharedValue(1);

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

    const { isImageDisplayModalVisible, setIsImageDisplayModalVisible } = useModalContext();

    const toggleModal = () => {
        setIsImageDisplayModalVisible(!isImageDisplayModalVisible);
    };

    return (
        <View style={styles.borderWrapper}>
            <GestureHandlerRootView style={styles.container}>
                {image && (
                    <>
                        <View style={styles.imageContainer}>
                            <ReceiptImage
                                source={imageSource}
                                style={styles.image}
                                previewOnly={isPDF}
                                isModal={isPDF}
                                pdfHeight={'100%'}
                            />
                            <TouchableOpacity
                                style={styles.zoomButton}
                                onPress={toggleModal}
                                activeOpacity={0.7}
                            >
                                <ZoomIcon />
                                <Text style={styles.zoomText}>
                                    {isPDF ? 'View PDF' : 'Tap to Zoom'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Modal visible={isImageDisplayModalVisible} transparent={true}>
                            <Toast />
                            <GestureHandlerRootView style={{ flex: 1 }}>
                                <TouchableOpacity
                                    style={styles.modalContainer}
                                    onPress={toggleModal}
                                    activeOpacity={1}
                                >
                                    <View style={styles.gestureContainer}>
                                        {!isPDF && (
                                            <GestureDetector gesture={pinchGesture}>
                                                <Animated.View
                                                    style={[animatedStyle, styles.animatedView]}
                                                >
                                                    <ReceiptImage
                                                        source={imageSource}
                                                        resizeMode="contain"
                                                        isModal={true}
                                                        toggleModal={toggleModal}
                                                    />
                                                </Animated.View>
                                            </GestureDetector>
                                        )}
                                        {isPDF && (
                                            <ReceiptImage
                                                source={imageSource}
                                                resizeMode="contain"
                                                isModal={true}
                                                toggleModal={toggleModal}
                                            />
                                        )}
                                    </View>
                                    {!isPDF && (
                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={toggleModal}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.closeButtonText}>Close</Text>
                                        </TouchableOpacity>
                                    )}
                                </TouchableOpacity>
                            </GestureHandlerRootView>
                        </Modal>
                    </>
                )}
            </GestureHandlerRootView>
        </View>
    );
};

const styles = StyleSheet.create({
    borderWrapper: {
        padding: Platform.OS === 'ios' ? 1 : 0,
        backgroundColor: Colors.borderColor,
        borderRadius: 8,
        width: '92%',
        marginTop: RFPercentage(1.4),
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
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        minHeight: 230,
        position: 'relative',
    },
    imageContainer: {
        width: '100%',
        position: 'relative',
        alignItems: 'center',
        height: RFPercentage(31.5),
    },
    image: {
        width: '100%',
        height: RFPercentage(32),
        backgroundColor: Colors.gray,
        borderRadius: 8,
        minHeight: 230,
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
    },
    animatedView: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
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
    zoomText: {
        marginLeft: RFPercentage(0.9),
        color: Colors.white,
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
        fontFamily: 'DMSans_400Regular',
        fontSize: RFPercentage(1.8),
    },
});

export default ImageDisplay;
