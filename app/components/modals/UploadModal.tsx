import React, { useEffect, useRef } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import Reanimated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors from 'config/Colors';
import CloseIcon from '../svg/CloseIcon';
import Toast from 'components/Toast';
import UploadOptions from 'components/UploadOptions';

interface UploadModalProps {
    isModalVisible: boolean;
    setIsModalVisible: (visible: boolean) => void;
    handleUploadSelection: (
        item: { id: string; image: any; name: string } | null,
        setIsModalVisible: (visible: boolean) => void
    ) => void;
    setIsUploadingMissingReceipt?: (val: boolean) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
    isModalVisible,
    setIsModalVisible,
    handleUploadSelection,
    setIsUploadingMissingReceipt,
}) => {
    const { height } = Dimensions.get('window');
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

    const animatedContainerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const animatedContentStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const closeModal = () => {
        setIsModalVisible(false);
        if (setIsUploadingMissingReceipt) {
            setIsUploadingMissingReceipt(false);
        }
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

    const onPress = () => {
        opacity.value = withTiming(0, { duration: 200 });
        translateY.value = withTiming(height, { duration: 250 }, (finished) => {
            if (finished) {
                runOnJS(closeModal)();
            }
        });
    };

    return (
        <Modal visible={isModalVisible} transparent animationType="none">
            <Reanimated.View style={[styles.container, animatedContainerStyle]}>
                <GestureDetector gesture={gesture}>
                    <Reanimated.View
                        style={[styles.content, animatedContentStyle]}
                        onLayout={() => {
                            if (isModalVisible && !hasAnimatedIn.current) {
                                hasAnimatedIn.current = true;
                                opacity.value = withTiming(1, { duration: 200 });
                                translateY.value = withTiming(0, { duration: 250 });
                            }
                        }}
                    >
                        <View style={styles.modalLine} />
                        <Toast />
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={onPress}
                                style={{ paddingRight: 12, marginBottom: 8 }}
                            >
                                <CloseIcon />
                            </TouchableOpacity>
                        </View>
                        <UploadOptions
                            onSelect={(item) => handleUploadSelection(item, setIsModalVisible)}
                            variant="buttons"
                        />
                    </Reanimated.View>
                </GestureDetector>
            </Reanimated.View>
        </Modal>
    );
};

export default UploadModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalLine: {
        width: 74,
        height: 3,
        backgroundColor: Colors.uploadGray,
        marginTop: RFPercentage(0.6),
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
    header: {
        width: '92%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginTop: RFPercentage(1.3),
    },
});
