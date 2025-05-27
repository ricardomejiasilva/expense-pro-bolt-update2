import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    ScrollView,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Fontisto } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { FontFamily } from 'config/Fonts';
import { useAppContext } from 'contexts/AppContext';
import { ReceiptTransaction } from 'models/types';
import { useFormContext } from 'contexts/FormContext';
import Colors from 'config/Colors';
import Icons from 'config/Icons_temp';
import Screen from 'components/Screen';
import AppLine from 'components/AppLine';
import Header from 'components/Header';
import PCardSelection from 'components/PCardSelection';
import ReceiptCard from 'components/ReceiptCard';
import ReceiptsDueAlert from 'components/ReceiptsDueAlert';
import { type RootStackParamList } from 'models/types';
import TransactionSkeleton from 'components/SkeletonLoader/TransactionSkeleton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DisappearingScrollView from 'components/animations/DisappearingScrollView';

type BottomTabRouteProp = RouteProp<RootStackParamList, 'BottomTab'>;

interface ReceiptScreenProps {
    bottomTabParams?: BottomTabRouteProp['params'];
}

const ReceiptSreen: React.FC<ReceiptScreenProps> = ({ bottomTabParams }) => {
    type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Receipts'>;
    const navigation = useNavigation<NavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');

    const { receiptTransactions, setSelectedReceiptTransaction, isPCardReceiptLoading } =
        useAppContext();
    const { updateFormValuesFromReceiptTransaction } = useFormContext();

    const filteredAndSortedReceipts = receiptTransactions
        .filter((item) => item.receiptStatus !== 1 && item.receipt)
        .filter(
            (item) =>
                item.receipt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                `Receipt ${item.receipt.id}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => b.id - a.id);

    const handleReceiptPress = (receipt: ReceiptTransaction) => {
        updateFormValuesFromReceiptTransaction(receipt);
        setSelectedReceiptTransaction(receipt);
        navigation.navigate('ReceiptModal', {
            screen: 'ReceiptModal',
        });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Screen style={styles.screen}>
                <Header />
                <PCardSelection />
                <AppLine />
                <ReceiptsDueAlert />

                <View
                    style={{
                        width: '92%',
                        marginTop: RFPercentage(1.8),
                    }}
                >
                    <Text
                        style={{
                            color: '#262626',
                            fontFamily: FontFamily.bold,
                            fontSize: RFPercentage(2.2),
                        }}
                    >
                        Submitted Receipts
                    </Text>
                    <Text style={styles.headerDescription}>
                        Receipts submitted in the last 60 days.
                    </Text>
                </View>

                <View style={styles.searchmain}>
                    <TextInput
                        style={styles.inputtext}
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        placeholder="Search"
                        placeholderTextColor="#979797"
                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View style={styles.searchIcon} />
                        <Fontisto name="search" size={18} color={Colors.blacktext} />
                    </View>
                </View>
                {isPCardReceiptLoading ? (
                    <View
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <TransactionSkeleton />
                    </View>
                ) : filteredAndSortedReceipts.length > 0 ? (
                    <DisappearingScrollView
                        contentContainerStyle={{
                            alignItems: 'center',
                            paddingBottom: RFPercentage(5),
                        }}
                        showsVerticalScrollIndicator={false}
                        style={{ width: '100%', marginTop: RFPercentage(1.4) }}
                    >
                        {filteredAndSortedReceipts.map((item: ReceiptTransaction) => (
                            <ReceiptCard
                                key={item.receipt.id}
                                item={item as ReceiptTransaction}
                                onPress={() => handleReceiptPress(item as ReceiptTransaction)}
                            />
                        ))}
                    </DisappearingScrollView>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Image
                            source={Icons.Noevent}
                            style={{
                                width: RFPercentage(16),
                                height: RFPercentage(10),
                            }}
                        />
                        <Text
                            style={{
                                marginTop: RFPercentage(1),
                                fontSize: RFPercentage(1.6),
                                color: Colors.blacktext,
                            }}
                        >
                            You have not submitted receipts
                        </Text>
                        <Text style={styles.emptySubtext}>in the last 60 days.</Text>
                    </View>
                )}
            </Screen>
        </TouchableWithoutFeedback>
    );
};

export default ReceiptSreen;
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    headerDescription: {
        marginTop: RFPercentage(0.5),
        color: Colors.notificationText,
        fontFamily: FontFamily.regular,
        fontSize: RFPercentage(1.6),
    },
    searchmain: {
        marginTop: RFPercentage(2),
        width: '92%',
        paddingHorizontal: RFPercentage(1.6),
        borderRadius: RFPercentage(1),
        borderWidth: RFPercentage(0.15),
        borderColor: Colors.gray,
        backgroundColor: Colors.white,
        height: RFPercentage(5),
        marginStart: RFPercentage(0.5),
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    inputtext: {
        width: '75%',
        fontSize: RFPercentage(1.8),
        color: Colors.black,
        fontFamily: FontFamily.regular,
    },
    searchIcon: {
        height: '100%',
        width: RFPercentage(0.15),
        backgroundColor: '#979797',
        marginHorizontal: RFPercentage(1.6),
    },
    emptyContainer: {
        width: '92%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: RFPercentage(0.15),
        borderColor: Colors.lightWhite,
        borderRadius: RFPercentage(1),
        height: '57%',
        paddingHorizontal: RFPercentage(4),
        marginTop: 16,
    },
    emptySubtext: {
        marginTop: RFPercentage(1),
        marginBottom: RFPercentage(6),
        textAlign: 'center',
        fontSize: RFPercentage(1.6),
        color: Colors.blacktext,
    },
    loading: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: RFPercentage(1.3),
    },
});
