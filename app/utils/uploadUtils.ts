import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'models/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type UploadItem } from 'components/UploadOptions';
import { StackActions } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
        return false;
    }
    return true;
};

const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Media library permission is required to upload photos.');
        return false;
    }
    return true;
};

export const handleUploadSelection = async (
    item: UploadItem | null,
    setIsUploadModalVisible: (visible: boolean) => void,
    navigation: NavigationProp,
    shortForm: boolean = false,
    setImage?: ((image: string) => void) | null,
    isAttachingReceipt?: boolean,
    onSuccessClose?: () => void
) => {
    if (!item) {
        if (isAttachingReceipt) {
            await AsyncStorage.setItem('isAttachingReceipt', 'true');
        }
        setIsUploadModalVisible(false);

        if (onSuccessClose) {
            onSuccessClose();
        }

        navigation.navigate(shortForm ? 'ReceiptForm' : 'ReceiptCategories', {
            image: null,
        });

        return;
    }

    let result;

    if (item.name === 'Take Photo') {
        const cameraPermission = await requestCameraPermission();
        if (!cameraPermission) return;

        result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
    } else if (item.name === 'Upload from Photos') {
        const mediaLibraryPermission = await requestMediaLibraryPermission();
        if (!mediaLibraryPermission) return;

        result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
        });
    } else if (item.name === 'Upload from Files') {
        result = await DocumentPicker.getDocumentAsync({
            type: '*/*', // Adjust the type
            copyToCacheDirectory: true,
        });
    }

    if (result && !result.canceled) {
        const fileUri = result.assets[0].uri;

        if (setImage) {
            setImage(fileUri);
        } else {
            if (isAttachingReceipt) {
                await AsyncStorage.setItem('isAttachingReceipt', 'true');
            }

            if (onSuccessClose) {
                onSuccessClose();
            }

            const routeName = shortForm ? 'ReceiptForm' : 'ReceiptFormReview';
            navigation.dispatch(
                StackActions.replace(routeName, {
                    image: fileUri,
                })
            );
        }

        setIsUploadModalVisible(false); // hide upload modal
    }
};

export const generateFormDataFromImageString = async (image: string | null) => {
    const formData = new FormData();
    if (!image) {
        return formData;
    }

    const imageFetch = await fetch(image);
    const blob = await imageFetch.blob();
    let fileName = image.split('/').pop();
    let mimeType = blob.type;

    formData.append('File', {
        uri: image,
        type: mimeType,
        name: fileName,
    });
    return formData;
};
