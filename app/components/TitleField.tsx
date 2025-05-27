import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions, Platform } from 'react-native';
import { FontFamily } from 'config/Fonts';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors from 'config/Colors';

interface TitleFieldProps {
    title: string;
    keyboardType?: KeyboardTypeOptions;
    value: string;
    onChangeText: (text: string) => void;
    error?: boolean;
    editable?: boolean;
}

const TitleField: React.FC<TitleFieldProps> = ({
    title,
    keyboardType = 'default',
    value,
    onChangeText,
    error = false,
    editable = true,
}) => {
    const [inputHeight, setInputHeight] = useState(40);
    const [secondLine, setSecondLine] = useState(false);

    return (
        <>
            <View
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: RFPercentage(1),
                }}
            >
                <Text style={styles.title}>{title}</Text>
            </View>

            <View
                style={[
                    styles.inputcontainer,
                    error && styles.errorBorder,
                    { height: Math.max(42, inputHeight) },
                ]}
            >
                <TextInput
                    style={[
                        styles.input,
                        {
                            paddingTop: secondLine && Platform.OS === 'ios' ? RFPercentage(1.1) : RFPercentage(0),
                            height: Math.max(40, inputHeight),
                            maxHeight: 40,
                        },
                    ]}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder="Enter supplier name"
                    placeholderTextColor={Colors.placeholder}
                    keyboardType={keyboardType}
                    editable={editable}
                    multiline={true}
                    onContentSizeChange={(event) => {
                        const { contentSize } = event.nativeEvent;
                        setInputHeight(contentSize.height + 22);
                        setSecondLine(contentSize.height > 20);
                    }}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    errorBorder: {
        borderColor: Colors.red,
        borderWidth: RFPercentage(0.1),
    },
    errorText: {
        color: Colors.red,
        fontSize: RFPercentage(1.6),
        marginTop: RFPercentage(0.5),
    },
    title: {
        marginVertical: RFPercentage(1),
        fontSize: RFPercentage(1.6),
        color: Colors.blacktext,
        fontFamily: FontFamily.regular,
    },
    inputcontainer: {
        width: '100%',
        borderRadius: RFPercentage(1),
        borderWidth: RFPercentage(0.1),
        borderColor: Colors.gray,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === 'ios' ? 10 : 0,
        position: 'relative',
    },
    input: {
        width: '100%',
        fontSize: RFPercentage(1.9),
        fontFamily: FontFamily.regular,
        color: Colors.blacktext,
        position: 'absolute',
        left: 0,
        top: 0,
        marginLeft: RFPercentage(1.6),
    },
});

export default TitleField;
