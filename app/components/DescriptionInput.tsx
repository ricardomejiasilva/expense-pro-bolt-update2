import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import { IFormContext } from 'models/types';

interface DescriptionInputProps {
    description: IFormContext['description'];
    setDescription: IFormContext['setDescription'];
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({ description, setDescription }) => {
    const [inputHeight, setInputHeight] = useState(60);
    const [thirdLine, setThirdLine] = useState(false);

    return (
        <View style={{ width: '92%' }}>
            <View style={styles.labelContainer}>
                <Text style={styles.labelText}>Short Description of Purchase (required)</Text>
            </View>

            <View
                style={[
                    styles.inputContainer,
                    { height: Math.max(60, inputHeight) },
                    description.isError && styles.errorBorder,
                ]}
            >
                <TextInput
                    style={[
                        styles.textInput,
                        {
                            paddingTop: thirdLine ? Platform.OS === 'ios' ? RFPercentage(0.3) : RFPercentage(1.4) : RFPercentage(0),
                            position: 'relative',
                            top: Platform.OS === 'ios' ? 0 : -22,
                        },
                        { height: Math.max(60, inputHeight) },
                    ]}
                    onChangeText={(text) => {
                        const reachedLimit = text.length >= 255;
                        const trimmed = text.slice(0, 255);

                        setDescription({
                            value: trimmed,
                            isError: reachedLimit,
                            errorMessage: reachedLimit
                                ? 'Maximum 255 characters allowed.'
                                : undefined,
                        });
                    }}
                    value={description.value}
                    placeholder="Enter Description"
                    placeholderTextColor={Colors.placeholder}
                    multiline
                    onContentSizeChange={(event) => {
                        const { contentSize } = event.nativeEvent;
                        setInputHeight(contentSize.height + 22);
                        setThirdLine(contentSize.height > 20);
                    }}
                />
            </View>
            {description.isError && (
                <Text style={styles.errorText}>
                    {description.errorMessage || 'Enter a short description.'}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    labelContainer: {
        width: '100%',
        justifyContent: 'center',
        marginTop: RFPercentage(1),
    },
    labelText: {
        marginVertical: RFPercentage(1),
        fontSize: RFPercentage(1.6),
        color: Colors.blacktext,
        fontFamily: FontFamily.regular,
    },
    inputContainer: {
        width: '100%',
        height: 60,
        borderRadius: RFPercentage(1),
        borderWidth: RFPercentage(0.1),
        borderColor: Colors.gray,
        justifyContent: 'flex-start',
        paddingHorizontal: RFPercentage(1.4),
        paddingVertical: RFPercentage(0.6),
        marginBottom: RFPercentage(0.9),
    },
    textInput: {
        color: Colors.blacktext,
        padding: 0,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.8),
    },
    errorBorder: {
        borderColor: Colors.red,
    },
    errorText: {
        color: Colors.red,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
        marginBottom: RFPercentage(0.5),
    },
});

export default DescriptionInput;
