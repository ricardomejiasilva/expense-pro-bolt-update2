import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import { ReceiptTransaction } from 'models/types';
import Colors from 'config/Colors';
import BrokenReceiptOutlined from './svg/BrokenReceiptOutlined';
import { formatAmount } from 'utils/formUtils';
import { useAppContext } from 'contexts/AppContext';
import PressAnimation from './animations/PressAnimation';

interface ReceiptProps {
    item: ReceiptTransaction;
    onPress: () => void;
}

const ReceiptCard: React.FC<ReceiptProps> = ({ item, onPress }) => {
    const { token } = useAppContext();
    return (
        <PressAnimation onPress={onPress} wrapperStyle={styles.container} style={styles.content}>
            <View style={{ flexDirection: 'row', alignItems: 'center', maxWidth: '95%' }}>
                <View style={styles.imageContainer}>
                    {item.receipt.filePath ? (
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
                    ) : (
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <BrokenReceiptOutlined />
                            <Text style={styles.text}>Missing Receipt</Text>
                        </View>
                    )}
                </View>
                <View style={styles.detailsContainer}>
                    <Text
                        style={{
                            color: '#1E1E1E',
                            fontFamily: FontFamily.bold,
                            fontSize: RFPercentage(1.6),
                        }}
                    >
                        Receipt {item.id}
                    </Text>
                    <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">
                        {item.receipt.description}
                    </Text>
                </View>
            </View>

            <View style={styles.priceContainer}>
                <Text
                    style={{
                        color: '#1E1E1E',
                        fontFamily: FontFamily.bold,
                        fontSize: RFPercentage(1.6),
                    }}
                >
                    {`$${formatAmount(item.receipt.totalAmount)}`}
                </Text>
            </View>
        </PressAnimation>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        marginVertical: RFPercentage(0.5),
        width: '92%',
    },
    content: {
        alignItems: 'center',
        backgroundColor: Colors.lightgray,
        borderWidth: 1,
        borderColor: Colors.lightWhite,
        borderRadius: RFPercentage(1),
        flexDirection: 'row',
        justifyContent: 'space-between',
        maxWidth: '100%',
        paddingVertical: RFPercentage(1.6),
        paddingHorizontal: RFPercentage(1.9),
        ...(Platform.OS === 'ios' && {
            shadowColor: '#000000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.05,
            shadowRadius: 2,
        }),
    },
    imageContainer: {
        width: 48,
        height: 48,
        backgroundColor: Colors.semiLightGray,
        borderColor: Colors.borderColor,
        borderRadius: 4,
        borderWidth: 1,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsContainer: {
        marginLeft: RFPercentage(1.6),
        maxWidth: '70%',
    },
    description: {
        marginTop: RFPercentage(0.5),
        color: Colors.darkgray,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
        flexWrap: 'wrap',
    },
    priceContainer: {},
    text: {
        fontSize: RFPercentage(0.7),
        color: Colors.blacktext,
        marginLeft: RFPercentage(0.3),
    },
});
export default ReceiptCard;
