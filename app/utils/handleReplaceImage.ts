import * as ImagePicker from "expo-image-picker";

export const handleReplaceImage = async (setImage: (image:string) => void ) => {
    let result: ImagePicker.ImagePickerResult =
        await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

    if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setImage(imageUri);
    }
};