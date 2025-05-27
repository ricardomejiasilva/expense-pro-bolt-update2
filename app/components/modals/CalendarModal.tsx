import React, { useEffect } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { FontFamily } from 'config/Fonts';
import Colors from 'config/Colors';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';

import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import LeftOutlined from '../svg/LeftOutlined';
import RightOutlined from '../svg/RightOutlined';
import { useFormContext } from 'contexts/FormContext';
import {
    convertDateMdyToYmd,
    convertDateObjectToYmd,
    convertDateYmdToMdy,
} from 'utils/convertDateUtils';
import { useOcrContext } from 'contexts/OcrContext';
import Toast from 'components/Toast';

interface CalendarModalProps {
    isModalVisible: boolean;
    setIsModalVisible: (visible: boolean) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isModalVisible, setIsModalVisible }) => {
    const { mdyDate, setMdyDate, calendarDate, setCalendarDate } = useFormContext();
    const { ocrState } = useOcrContext();

    useEffect(() => {
        // If mdyDate is a valid date in mm-dd-yyyy format, update calendarDate
        if (mdyDate.value && mdyDate.value.match(/^\d{1,2}-\d{1,2}-\d{4}$/)) {
            setCalendarDate({
                value: convertDateMdyToYmd(mdyDate.value),
                isError: false,
            });
        }
    }, [isModalVisible]);

    const handleChange = (date: DateType) => {
        if (date) {
            setCalendarDate({
                value: convertDateObjectToYmd(date),
                isError: false,
            });
        }
    };

    const handleSave = () => {
        setIsModalVisible(false);
        setMdyDate({
            value: convertDateYmdToMdy(calendarDate.value),
            isError: calendarDate.isError,
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setCalendarDate({
            value: ocrState.data?.transactionDate ?? convertDateObjectToYmd(new Date()),
            isError: false,
        });
    };

    return (
        <Modal
            visible={isModalVisible}
            animationType="none"
            onRequestClose={() => setIsModalVisible(false)}
            transparent={true}
        >
            <Toast />
            {/* Overlay View */}
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <DateTimePicker
                        mode="single"
                        date={calendarDate.value}
                        selectedItemColor="#007161"
                        headerButtonStyle={{
                            borderRadius: 6,
                            borderWidth: 1,
                            borderColor: Colors.gray,
                            padding: 7,
                        }}
                        weekDaysTextStyle={{
                            fontSize: RFPercentage(1.4),
                            fontFamily: FontFamily.regular,
                        }}
                        calendarTextStyle={{
                            fontSize: RFPercentage(2.3),
                            fontFamily: FontFamily.regular,
                        }}
                        headerTextStyle={{
                            color: Colors.primary,
                            fontSize: RFPercentage(2.3),
                            fontFamily: FontFamily.regular,
                        }}
                        selectedTextStyle={{
                            fontSize: RFPercentage(2.3),
                            fontFamily: FontFamily.regular,
                        }}
                        yearContainerStyle={{ borderWidth: 0 }}
                        monthContainerStyle={{ borderWidth: 0 }}
                        dayContainerStyle={{ borderRadius: 6 }}
                        todayContainerStyle={{ borderColor: 'transparent' }}
                        buttonPrevIcon={<LeftOutlined />}
                        buttonNextIcon={<RightOutlined />}
                        minDate={new Date(new Date().setDate(new Date().getDate() - 60))}
                        maxDate={new Date()}
                        onChange={(params) => handleChange(params.date)}
                    />
                    <PrimaryButton
                        text="Save"
                        containerStyle={[styles.button, { marginBottom: RFPercentage(0.9) }]}
                        onPress={handleSave}
                    />
                    <SecondaryButton
                        text="Cancel"
                        onPress={handleCancel}
                        containerStyle={[styles.button, { marginBottom: RFPercentage(3) }]}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default CalendarModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: '100%',
        paddingHorizontal: RFPercentage(1.9),
        paddingTop: RFPercentage(1.2),
        borderRadius: RFPercentage(1.2),
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 2,
    },
    button: {
        width: '92%',
        alignItems: 'center',
    },
});
