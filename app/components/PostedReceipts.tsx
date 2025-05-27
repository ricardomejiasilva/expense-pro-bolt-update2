import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import { Receipt, ReceiptTransaction, SubmittedReceipt } from 'models/types';
import Colors from 'config/Colors';
import { useAppContext } from 'contexts/AppContext';
import PressAndSelectAnimation from './animations/PressAndSelectAnimation';

interface ReceiptProps {
    item: ReceiptTransaction;
    index: number;
    selectedIndex: number | null;
    onPress: (index: number, name: number) => void;
}
const PostedReceipt: React.FC<ReceiptProps> = ({
    item,
    onPress,
    index,
    selectedIndex,
}: ReceiptProps) => {
    const { token } = useAppContext();
    const handleSelect = (id: number) => {
        onPress(index, id);
    };
    return (
        <PressAndSelectAnimation
            id={index}
            onSelect={handleSelect}
            isSelected={selectedIndex === index}
            wrapperStyle={[styles.container]}
            style={[styles.content]}
        >
            <View style={styles.layout}>
                <View
                    style={{
                        flexGrow: 1,
                        flexShrink: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={[
                            styles.radioContainer,
                            {
                                borderColor: selectedIndex === index ? Colors.green : Colors.gray,
                            },
                        ]}
                    >
                        {selectedIndex === index && <View style={styles.radio} />}
                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{
                                uri: item.receipt.filePath,
                                headers: {
                                    Cookie: token ? token : '',
                                },
                                cache: 'force-cache',
                            }}
                            resizeMode="contain"
                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                        />
                    </View>
                    <View style={{ marginLeft: RFPercentage(0.9) }}>
                        <Text
                            style={{
                                color: '#1E1E1E',
                                fontFamily: FontFamily.bold,
                                fontSize: RFPercentage(1.6),
                            }}
                        >
                            Receipt {item.id}
                        </Text>
                        <Text
                            style={[styles.subtitle, { maxWidth: '80%' }]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.receipt.description}
                        </Text>
                    </View>
                </View>
                <View style={{ flexGrow: 1, flexShrink: 0, alignItems: 'flex-end' }}>
                    <Text
                        style={{
                            color: '#1E1E1E',
                            fontFamily: FontFamily.bold,
                            fontSize: RFPercentage(1.6),
                        }}
                    >
                        $
                        {item.totalAmount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </Text>
                </View>
            </View>
        </PressAndSelectAnimation>
    );
};
const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.white,
        borderColor: Colors.borderColor,
        borderRadius: RFPercentage(1),
        borderWidth: 0,
    },
    content: {
        backgroundColor: Colors.white,
        borderRadius: RFPercentage(1),
        marginVertical: RFPercentage(0.5),
    },
    layout: {
        flexDirection: 'row',
        paddingVertical: RFPercentage(1.4),
        paddingHorizontal: RFPercentage(1.9),
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    radioContainer: {
        width: RFPercentage(1.9),
        height: RFPercentage(1.9),
        backgroundColor: Colors.white,
        borderWidth: RFPercentage(0.15),
        borderRadius: RFPercentage(1),

        alignItems: 'center',
        justifyContent: 'center',
        marginRight: RFPercentage(0.9),
    },
    radio: {
        backgroundColor: Colors.green,
        width: RFPercentage(0.9),
        height: RFPercentage(0.9),
        borderRadius: RFPercentage(1),
    },
    subtitle: {
        marginTop: RFPercentage(0.5),
        color: Colors.darkgray,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.4),
    },
    imageContainer: {
        width: 48,
        height: 48,
        backgroundColor: Colors.semiLightGray,
        borderColor: Colors.borderColor,
        borderRadius: 4,
        borderWidth: 1,
        paddingVertical: 3,
        paddingHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default PostedReceipt;
