import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { type ToastContextType, type IToastState } from 'models/types';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const defaultToastState: IToastState = {
    isToastVisible: false,
    message: '',
    type: 'success',
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toastState, setToastState] = useState<IToastState>(defaultToastState);
    const toastDisplayDuration = 3600;

    const showToast = (message: IToastState['message'], type: IToastState['type']) => {
        setToastState({
            isToastVisible: true,
            message: message,
            type,
        });
    };

    const closeToast = () => {
        setToastState(defaultToastState);
    };

    useEffect(() => {
        if (toastState.isToastVisible) {
            const timeout = setTimeout(() => {
                closeToast();
            }, toastDisplayDuration); // add time to allow for animation

            return () => clearTimeout(timeout);
        }
    }, [toastState]);

    return (
        <ToastContext.Provider
            value={{
                toastState,
                setToastState,
                showToast,
                closeToast,
                toastDisplayDuration,
            }}
        >
            {children}
        </ToastContext.Provider>
    );
};

export const useToastContext = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within an ToastProvider');
    }
    return context;
};
