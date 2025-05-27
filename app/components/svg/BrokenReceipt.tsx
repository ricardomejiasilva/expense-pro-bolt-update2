import React from "react";
import { G, Path, Svg } from "react-native-svg";

interface ZoomIconProps {
    width?: number;
    height?: number;
}

const BrokenReceiptIcon = ({ width = 60, height = 59 }: ZoomIconProps) => {
    return (
        <Svg width={width} height={height} viewBox='0 0 60 59' fill='none'>
            <G id='Receipt'>
                <Path
                    id='Vector'
                    opacity='0.2'
                    d='M7.875 47.9375V12.9062C7.875 12.4173 8.06925 11.9483 8.41502 11.6025C8.76079 11.2568 9.22976 11.0625 9.71875 11.0625H50.2812C50.7702 11.0625 51.2392 11.2568 51.585 11.6025C51.9307 11.9483 52.125 12.4173 52.125 12.9062V47.9375L44.75 44.25L37.375 47.9375L30 44.25L22.625 47.9375L15.25 44.25L7.875 47.9375Z'
                    fill='black'
                    fill-opacity='0.45'
                />
                <Path
                    id='Vector_2'
                    d='M18.0156 23.9688H41.9844'
                    stroke='black'
                    stroke-opacity='0.45'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                />
                <Path
                    id='Vector_3'
                    d='M18.0156 31.3438H41.9844'
                    stroke='black'
                    stroke-opacity='0.45'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                />
                <Path
                    id='Vector_4'
                    d='M7.875 47.9375V12.9062C7.875 12.4173 8.06925 11.9483 8.41502 11.6025C8.76079 11.2568 9.22976 11.0625 9.71875 11.0625H50.2812C50.7702 11.0625 51.2392 11.2568 51.585 11.6025C51.9307 11.9483 52.125 12.4173 52.125 12.9062V47.9375L44.75 44.25L37.375 47.9375L30 44.25L22.625 47.9375L15.25 44.25L7.875 47.9375Z'
                    stroke='black'
                    stroke-opacity='0.45'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                />
            </G>
        </Svg>
    );
};

export default BrokenReceiptIcon;
