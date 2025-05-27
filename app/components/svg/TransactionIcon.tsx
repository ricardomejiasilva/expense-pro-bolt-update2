import React from 'react';
import { Path, Svg, G } from 'react-native-svg';

interface TransactionIconProps {
    width?: number;
    height?: number;
    focused: boolean;
}

const TransactionIcon = ({ width, height, focused }: TransactionIconProps) => {
    return (
        <Svg width={focused ? 24 : 23} height={focused ? 25 : 24} viewBox="0 0 26 27" fill="none">
            {focused ? (
                <G id="Group 8">
                    <Path
                        id="Vector"
                        opacity="0.2"
                        d="M13 25.5C19.6274 25.5 25 20.1274 25 13.5C25 6.87258 19.6274 1.5 13 1.5C6.37258 1.5 1 6.87258 1 13.5C1 20.1274 6.37258 25.5 13 25.5Z"
                        fill="#247060"
                    />
                    <Path
                        id="Vector_2"
                        d="M13 6.5V8.5M13 18.5V20.5M10 18.5H14.5C15.163 18.5 15.7989 18.2366 16.2678 17.7678C16.7366 17.2989 17 16.663 17 16C17 15.337 16.7366 14.7011 16.2678 14.2322C15.7989 13.7634 15.163 13.5 14.5 13.5H11.5C10.837 13.5 10.2011 13.2366 9.73223 12.7678C9.26339 12.2989 9 11.663 9 11C9 10.337 9.26339 9.70107 9.73223 9.23223C10.2011 8.76339 10.837 8.5 11.5 8.5H16M25 13.5C25 20.1274 19.6274 25.5 13 25.5C6.37258 25.5 1 20.1274 1 13.5C1 6.87258 6.37258 1.5 13 1.5C19.6274 1.5 25 6.87258 25 13.5Z"
                        stroke="#247060"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </G>
            ) : (
                <Path
                    d="M13 6.5V8.5M13 18.5V20.5M10 18.5H14.5C15.163 18.5 15.7989 18.2366 16.2678 17.7678C16.7366 17.2989 17 16.663 17 16C17 15.337 16.7366 14.7011 16.2678 14.2322C15.7989 13.7634 15.163 13.5 14.5 13.5H11.5C10.837 13.5 10.2011 13.2366 9.73223 12.7678C9.26339 12.2989 9 11.663 9 11C9 10.337 9.26339 9.70107 9.73223 9.23223C10.2011 8.76339 10.837 8.5 11.5 8.5H16M25 13.5C25 20.1274 19.6274 25.5 13 25.5C6.37258 25.5 1 20.1274 1 13.5C1 6.87258 6.37258 1.5 13 1.5C19.6274 1.5 25 6.87258 25 13.5Z"
                    stroke="black"
                    stroke-opacity="0.65"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            )}
        </Svg>
    );
};

export default TransactionIcon;
