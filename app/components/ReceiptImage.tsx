/**
 * @name ReceiptImage
 * @description A component that conditionally displays an image or a PDF file based on the file extension.
 * @description It accepts the same props as the Image component from react-native, but with an optional `isModal`.
 * @example
 * <ReceiptImage source={{ uri: "https://example.com/receipt.pdf" }} />
 * @example
 * <ReceiptImage source={{ uri: "https://example.com/receipt.jpg" }} />
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    ImageProps,
    StyleSheet,
    Button,
    Text,
    TouchableWithoutFeedback,
    ActivityIndicator,
    DimensionValue,
} from 'react-native';
import Pdf, { PdfProps } from 'react-native-pdf';
import Colors from 'config/Colors';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useAppContext } from 'contexts/AppContext';
import * as FileSystem from 'expo-file-system';

interface ReceiptImageProps extends ImageProps {
    isModal?: boolean;
    toggleModal?: () => void;
    previewOnly?: boolean;
    pdfHeight?: DimensionValue;
}

const ReceiptImage: React.FC<ReceiptImageProps> = ({
    source,
    style,
    isModal = false,
    toggleModal,
    previewOnly = false,
    pdfHeight = '100%',
    ...rest
}) => {
    const { token } = useAppContext();
    const imageIsPDF =
        typeof source === 'object' && 'uri' in source && source.uri && source.uri.includes('.pdf');
    const [page, setPage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [pdfError, setPdfError] = useState<string | null>(null);
    const [localPdfUri, setLocalPdfUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const isModalStyles = isModal ? receiptImageStyles.modalImage : {};
    const scale = useSharedValue(1);

    // Pinch gesture implementation
    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = Math.max(0.5, Math.min(event.scale, 3));
        })
        .onEnd(() => {
            scale.value = withTiming(1, { duration: 250 });
        });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    useEffect(() => {
        let isMounted = true;
        const downloadPdf = async () => {
            if (imageIsPDF && source && 'uri' in source && source.uri) {
                setIsLoading(true);
                setPdfError(null);
                setLocalPdfUri(null);
                try {
                    if (source.uri.startsWith('file://')) {
                        // Local file, use directly
                        if (isMounted) {
                            setLocalPdfUri(source.uri);
                            setPdfError(null);
                            setIsLoading(false);
                        }
                        return;
                    }
                    // Remote file, download
                    const filename = source.uri.split('/').pop() || `temp_${Date.now()}.pdf`;
                    const fileUri = `${FileSystem.cacheDirectory}${filename}`;
                    // Check if file already exists in cache
                    const fileInfo = await FileSystem.getInfoAsync(fileUri);
                    if (fileInfo.exists) {
                        if (isMounted) {
                            setLocalPdfUri(fileUri);
                            setPdfError(null);
                            setIsLoading(false);
                        }
                        return;
                    }
                    // Download the file
                    const downloadResult = await FileSystem.downloadAsync(source.uri, fileUri, {
                        headers: {
                            Cookie: token ? token : '',
                        },
                    });
                    if (downloadResult.status === 200) {
                        if (isMounted) {
                            setLocalPdfUri(downloadResult.uri);
                            setPdfError(null);
                            setIsLoading(false);
                        }
                    } else {
                        throw new Error('Download failed');
                    }
                } catch (error) {
                    console.error('PDF Download Error:', error);
                    if (isMounted) {
                        setPdfError('Failed to load PDF. Please try again.');
                        setIsLoading(false);
                    }
                }
            }
        };
        if (imageIsPDF) {
            downloadPdf();
        }
        return () => {
            isMounted = false;
        };
    }, [source, token, imageIsPDF]);

    const pdfSource = localPdfUri ? ({ uri: localPdfUri } as PdfProps['source']) : undefined;

    return (
        <>
            {imageIsPDF && (isModal === true || previewOnly) ? (
                <View
                    style={[
                        style,
                        isModalStyles,
                        receiptImageStyles.container,
                        { height: pdfHeight },
                    ]}
                >
                    <TouchableWithoutFeedback>
                        <View style={[isModalStyles, receiptImageStyles.pdfContainer]}>
                            <GestureDetector gesture={pinchGesture}>
                                <Animated.View style={[animatedStyle, { flex: 1 }]}>
                                    {isLoading ? (
                                        <View style={receiptImageStyles.loadingContainer}>
                                            <ActivityIndicator size="large" color={Colors.gray} />
                                        </View>
                                    ) : pdfError ? (
                                        <View style={receiptImageStyles.errorContainer}>
                                            <Text style={receiptImageStyles.errorText}>
                                                {pdfError}
                                            </Text>
                                        </View>
                                    ) : pdfSource ? (
                                        <Pdf
                                            source={pdfSource}
                                            page={previewOnly ? 1 : page}
                                            onLoadComplete={(numberOfPages, filePath) => {
                                                setNumberOfPages(numberOfPages);
                                                setPdfError(null);
                                            }}
                                            onPageChanged={(page, numberOfPages) => {
                                                setPage(page);
                                                setNumberOfPages(numberOfPages);
                                            }}
                                            onError={(error) => {
                                                console.error('PDF Error:', error);
                                                setPdfError(
                                                    'Failed to load PDF. Please try again.'
                                                );
                                            }}
                                            style={receiptImageStyles.pdf}
                                            scale={1.0}
                                            minScale={1.0}
                                            maxScale={3.0}
                                            enablePaging={true}
                                        />
                                    ) : null}
                                </Animated.View>
                            </GestureDetector>
                        </View>
                    </TouchableWithoutFeedback>
                    {!previewOnly && numberOfPages > 0 && (
                        <View style={receiptImageStyles.paginationContainer}>
                            <View style={receiptImageStyles.pagination}>
                                {page === 1 ? (
                                    <Button
                                        title={'Close'}
                                        onPress={() => toggleModal && toggleModal()}
                                        color={Colors.link}
                                    />
                                ) : (
                                    <Button
                                        title={'Previous'}
                                        onPress={() => setPage(page - 1)}
                                        color={Colors.link}
                                    />
                                )}

                                <Text
                                    style={receiptImageStyles.paginationLabel}
                                >{`Page ${page} / ${numberOfPages}`}</Text>
                                {numberOfPages !== 1 && (
                                    <Button
                                        title="Next"
                                        onPress={() => setPage(page + 1)}
                                        disabled={page >= numberOfPages}
                                        color={Colors.link}
                                    />
                                )}
                            </View>
                        </View>
                    )}
                </View>
            ) : (
                <Image source={source} style={[style, isModalStyles]} {...rest} />
            )}
        </>
    );
};

const receiptImageStyles = StyleSheet.create({
    modalImage: {
        width: '92%',
        height: '90%',
    },
    container: {
        width: '100%',
        height: '100%',
    },
    pdfContainer: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    pdf: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    pagination: {
        flex: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 40,
        marginTop: 20,
        paddingHorizontal: 20,
    },
    paginationLabel: {
        color: 'white',
        paddingRight: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.gray,
    },
    errorText: {
        color: Colors.red,
        textAlign: 'center',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.gray,
    },
});

export default ReceiptImage;
