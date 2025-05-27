import React from "react";
import { Path, Svg } from "react-native-svg";

interface TransactionIconProps {
    width?: number;
    height?: number;
    focused: boolean;
}

const ReceiptIcon = ({ width, height, focused }: TransactionIconProps) => {
    return (
        <Svg width={width} height={height} viewBox='0 0 24 25' fill='none'>
            {focused ? (
                <>
                    <Path
                        opacity='0.2'
                        d='M1 22V3.95C1 3.69804 1.09658 3.45641 1.26849 3.27825C1.44039 3.10009 1.67355 3 1.91667 3H22.0833C22.3264 3 22.5596 3.10009 22.7315 3.27825C22.9034 3.45641 23 3.69804 23 3.95V22L19.3333 20.1L15.6667 22L12 20.1L8.33333 22L4.66667 20.1L1 22Z'
                        fill='#247060'
                    />
                    <Path
                        d='M6.04167 10.3H17.9583M6.04167 13.9H17.9583M1 22V4.9C1 4.66131 1.09658 4.43239 1.26849 4.2636C1.44039 4.09482 1.67355 4 1.91667 4H22.0833C22.3264 4 22.5596 4.09482 22.7315 4.2636C22.9034 4.43239 23 4.66131 23 4.9V22L19.3333 20.2L15.6667 22L12 20.2L8.33333 22L4.66667 20.2L1 22Z'
                        stroke='#247060'
                        stroke-width='1.5'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                    />
                </>
            ) : (
                <Path
                    d='M6.04167 10.3H17.9583M6.04167 13.9H17.9583M1 22V4.9C1 4.66131 1.09658 4.43239 1.26849 4.2636C1.44039 4.09482 1.67355 4 1.91667 4H22.0833C22.3264 4 22.5596 4.09482 22.7315 4.2636C22.9034 4.43239 23 4.66131 23 4.9V22L19.3333 20.2L15.6667 22L12 20.2L8.33333 22L4.66667 20.2L1 22Z'
                    stroke='black'
                    stroke-opacity='0.65'
                    stroke-width='1.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                />
            )}
        </Svg>
    );
};

export default ReceiptIcon;
