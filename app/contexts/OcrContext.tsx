import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';
import { IOcrState } from 'models/ocr';
import { OcrContextType } from 'models/types';
import { useFormContext } from './FormContext';
import { uploadReceiptSearch } from 'utils/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertDateObjectToYmd, convertDateYmdToMdy } from 'utils/convertDateUtils';

const OcrContext = createContext<OcrContextType | undefined>(undefined);

export const OcrProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const initialOcrState: IOcrState = {
        ocrImage: null,
        isSubmitting: false,
        isLowConfidence: null,
        isErrorDisplayed: false,
        errorMessage: null,
        data: null,
    };
    const [ocrState, setOcrState] = useState<IOcrState>(initialOcrState);

    const ignoreResultRef = useRef(false);
    const activeOcrIdRef = useRef<number>(0);

    const resetOcrState = () => {
        ignoreResultRef.current = false;
        setOcrState(initialOcrState);
    };

    const { setSupplier, setAmount, setMdyDate, setCalendarDate, resetAutofilledFormFields } =
        useFormContext();

    const handleOcrSubmission = async (newImage: string, updateFormFields: boolean) => {
        const currentOcrId = Date.now();
        activeOcrIdRef.current = currentOcrId;
        ignoreResultRef.current = false;

        setOcrState((prev) => ({
            ...initialOcrState,
            ocrImage: newImage,
            isSubmitting: true,
        }));

        if (updateFormFields) {
            resetAutofilledFormFields();
        }

        try {
            const ocrResponse = await uploadReceiptSearch(newImage);
            const ocrReceipt = ocrResponse.data;

            if (ignoreResultRef.current || activeOcrIdRef.current !== currentOcrId) {
                console.log('OCR canceled or superseded');
                return;
            }

            if (!ocrReceipt || ocrResponse.status !== 200) {
                setOcrState((prev) => ({
                    ...prev,
                    isSubmitting: false,
                    isLowConfidence: false,
                    isErrorDisplayed: true,
                    errorMessage: 'There was an error uploading the receipt. Please try again.',
                    data: null,
                }));
                return;
            }

            if (ignoreResultRef.current || activeOcrIdRef.current !== currentOcrId) {
                console.log('OCR canceled or superseded (late)');
                return;
            }

            await AsyncStorage.setItem('ocrReceipt', JSON.stringify(ocrReceipt));

            const confidenceLevelThreshold = 2;
            if (updateFormFields) {
                // Supplier
                setSupplier({
                    value:
                        ocrReceipt.merchantName &&
                        ocrReceipt.merchantNameConfidence > confidenceLevelThreshold
                            ? ocrReceipt.merchantName
                            : '',
                    isError:
                        !ocrReceipt.merchantName ||
                        ocrReceipt.merchantNameConfidence <= confidenceLevelThreshold,
                });

                // Amount
                setAmount({
                    value:
                        ocrReceipt.total &&
                        ocrReceipt.transactionTotalConfidence > confidenceLevelThreshold
                            ? ocrReceipt.total.toString()
                            : '',
                    isError:
                        !ocrReceipt.total ||
                        ocrReceipt.transactionTotalConfidence <= confidenceLevelThreshold,
                });

                // Date
                const hasValidDate =
                    ocrReceipt.transactionDate &&
                    ocrReceipt.transactionDateConfidence > confidenceLevelThreshold;

                setMdyDate({
                    value: hasValidDate ? convertDateYmdToMdy(ocrReceipt.transactionDate) : '',
                    isError: !hasValidDate,
                });

                setCalendarDate({
                    value: ocrReceipt.transactionDate ?? convertDateObjectToYmd(new Date()),
                    isError: false,
                });
            }

            const isLowConfidence = ocrReceipt.receiptConfidence < 0.95;

            setOcrState((prev) => ({
                ...prev,
                isSubmitting: false,
                isLowConfidence: isLowConfidence,
                isErrorDisplayed: isLowConfidence,
                errorMessage: isLowConfidence
                    ? 'Receipt image is not readable to autofill details. Provide a clearer image or continue to manually enter details.'
                    : null,
                data: ocrReceipt,
            }));
        } catch (error) {
            console.error('Error uploading receipt:', error);
            setOcrState((prev) => ({
                ...prev,
                isSubmitting: false,
                isLowConfidence: false,
                isErrorDisplayed: true,
                errorMessage: 'There was an error uploading the receipt. Please try again.',
                data: null,
            }));
        }
    };

    return (
        <OcrContext.Provider
            value={{
                ocrState,
                setOcrState,
                resetOcrState,
                handleOcrSubmission,
                initialOcrState,
                ignoreResultRef,
                activeOcrIdRef,
            }}
        >
            {children}
        </OcrContext.Provider>
    );
};

export const useOcrContext = (): OcrContextType => {
    const context = useContext(OcrContext);
    if (!context) {
        throw new Error('useOcrContext must be used within an OcrProvider');
    }
    return context;
};
