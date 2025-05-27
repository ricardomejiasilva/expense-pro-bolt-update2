import React from 'react';
import { Text, Image, StyleSheet, ImageSourcePropType, Platform } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import PressAnimation from './animations/PressAnimation';

export interface UploadItem {
    id: string;
    name: string;
    image: ImageSourcePropType;
}

const selectUpload: UploadItem[] = [
    {
        id: '1',
        name: 'Take Photo',
        image: require('assets/images/camera.png'),
    },
    {
        id: '2',
        name: 'Upload from Photos',
        image: require('assets/images/photo.png'),
    },
    {
        id: '3',
        name: 'Upload from Files',
        image: require('assets/images/file.png'),
    },
];

export interface UploadOptionsProps {
    onSelect: (item: UploadItem) => void;
    variant?: 'buttons';
}

const UploadOptions: React.FC<UploadOptionsProps> = ({ onSelect, variant }) => {
    return (
        <>
            {selectUpload.map((item) => (
                <PressAnimation
                    key={item.id}
                    onPress={() => onSelect(item)}
                    wrapperStyle={variant === 'buttons' ? styles.buttonContainer : styles.container}
                    style={variant === 'buttons' ? styles.buttonContent : styles.content}
                >
                    <Image
                        source={item.image}
                        style={{
                            width: 50,
                            height: 50,
                            marginRight: RFPercentage(1.9),
                        }}
                        resizeMode="contain"
                    />
                    <Text
                        style={{
                            color: Colors.blacktext,
                            fontFamily: FontFamily.regular,
                            fontSize: RFPercentage(1.6),
                        }}
                    >
                        {item.name}
                    </Text>
                </PressAnimation>
            ))}
        </>
    );
};

export default UploadOptions;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        width: '100%',
        paddingVertical: RFPercentage(1.2),
        paddingHorizontal: RFPercentage(1),
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 24,
    },
    buttonContainer: {
        width: '92%',
        marginTop: RFPercentage(1),
        backgroundColor: Colors.white,
    },
    content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
    buttonContent: {
        borderColor: Colors.lightWhite,
        borderWidth: 1,
        borderRadius: 6,
        shadowColor: Platform.OS === 'ios' ? '#000000' : '#949494',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: Colors.lightgray,
        paddingVertical: RFPercentage(1.2),
        paddingHorizontal: RFPercentage(1.9),
    },
});
