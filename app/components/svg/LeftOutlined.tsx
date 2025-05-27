import React from "react";
import { Path, Svg, G, Defs, Rect, ClipPath } from "react-native-svg";

interface LogoProps {
    width?: number;
    height?: number;
}

const LeftOutlined = ({ width=16, height=16 }: LogoProps) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
            <Path d="M11.313 3.41119V2.20338C11.313 2.09869 11.1927 2.04088 11.1114 2.10494L4.0677 7.6065C4.00785 7.65304 3.95943 7.71264 3.92612 7.78074C3.8928 7.84885 3.87549 7.92366 3.87549 7.99947C3.87549 8.07528 3.8928 8.1501 3.92612 8.2182C3.95943 8.2863 4.00785 8.3459 4.0677 8.39244L11.1114 13.894C11.1943 13.9581 11.313 13.9003 11.313 13.7956V12.5878C11.313 12.5112 11.2771 12.4378 11.2177 12.3909L5.5927 8.00025L11.2177 3.60807C11.2771 3.56119 11.313 3.48775 11.313 3.41119Z" fill="#1C1C1C"/>
        </Svg>
    );
};

export default LeftOutlined;
