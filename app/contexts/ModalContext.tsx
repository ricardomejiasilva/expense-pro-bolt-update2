import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ModalContextType } from 'models/types';

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isImageDisplayModalVisible, setIsImageDisplayModalVisible] = useState<boolean>(false);
    const [isUploadingMissingReceipt, setIsUploadingMissingReceipt] = useState<boolean>(false);

    return (
        <ModalContext.Provider
            value={{
                isImageDisplayModalVisible,
                setIsImageDisplayModalVisible,
                isUploadingMissingReceipt,
                setIsUploadingMissingReceipt,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};

export const useModalContext = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModalContext must be used within an ModalProvider');
    }
    return context;
};
