import React from 'react';
import { Path, Svg, G } from 'react-native-svg';

interface CreditCard {
    width?: number;
    height?: number;
}

const CreditCard = ({ width = 16, height = 16 }: CreditCard) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
            <G id="icon/outlined/application/credit-card">
                <Path
                    id="Vector"
                    d="M14.5 2.5H1.5C1.22344 2.5 1 2.72344 1 3V13C1 13.2766 1.22344 13.5 1.5 13.5H14.5C14.7766 13.5 15 13.2766 15 13V3C15 2.72344 14.7766 2.5 14.5 2.5ZM2.125 3.625H13.875V5.5H2.125V3.625ZM13.875 12.375H2.125V6.875H13.875V12.375ZM10.1719 11.375H12.75C12.8188 11.375 12.875 11.3188 12.875 11.25V10.125C12.875 10.0563 12.8188 10 12.75 10H10.1719C10.1031 10 10.0469 10.0563 10.0469 10.125V11.25C10.0469 11.3188 10.1031 11.375 10.1719 11.375Z"
                    fill="#000000A6"
                    fill-opacity="0.65"
                />
            </G>
        </Svg>
    );
};

export default CreditCard;
