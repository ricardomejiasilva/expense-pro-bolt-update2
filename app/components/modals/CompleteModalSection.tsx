import React, { useState } from 'react';
import ImageDisplay from '../ImageDisplay';
import MissingReceipt from '../MissingReceipt';
import CompletedAlert from '../CompletedAlert';
import AutofilledDetails from '../AutofilledDetails';
import { ReceiptTransaction } from 'models/types';
import TransactionDetails from 'components/TransactionDetails';

interface CompleteModalSectionProps {
    image: string | null;
    displayAlert?: boolean;
    selectedReceiptTransaction?: ReceiptTransaction;
}

const CompleteModalSection: React.FC<CompleteModalSectionProps> = ({
    image,
    displayAlert = true,
}) => {
    const [isAlertVisible, setIsAlertVisible] = useState(true);
    return (
        <>
            {displayAlert && isAlertVisible && (
                <CompletedAlert setIsAlertVisible={setIsAlertVisible} />
            )}

            <TransactionDetails />

            {image ? <ImageDisplay image={image} /> : <MissingReceipt />}

            <AutofilledDetails long />
        </>
    );
};

export default CompleteModalSection;
