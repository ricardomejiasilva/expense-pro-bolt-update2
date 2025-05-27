import React from "react";
import { G, Path, Svg } from "react-native-svg";

interface TransactionIconProps {
    width?: number;
    height?: number;
}

const LeftArrow = ({ width=16, height=16 }: TransactionIconProps) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
            <G id="Icon / ArrowLeftOutlined">
            <Path id="Vector" d="M13.6244 7.40625H4.48219L9.95406 2.65625C10.0416 2.57969 9.98844 2.4375 9.87281 2.4375H8.49C8.42906 2.4375 8.37125 2.45937 8.32594 2.49844L2.42125 7.62187C2.36717 7.66875 2.3238 7.72671 2.29407 7.79181C2.26435 7.85692 2.24896 7.92765 2.24896 7.99922C2.24896 8.07079 2.26435 8.14152 2.29407 8.20663C2.3238 8.27173 2.36717 8.32968 2.42125 8.37656L8.36031 13.5312C8.38375 13.5516 8.41187 13.5625 8.44156 13.5625H9.87125C9.98687 13.5625 10.04 13.4187 9.9525 13.3438L4.48219 8.59375H13.6244C13.6931 8.59375 13.7494 8.5375 13.7494 8.46875V7.53125C13.7494 7.4625 13.6931 7.40625 13.6244 7.40625Z" fill="#1C1C1C"/>
            </G>
        </Svg>
    );
};

export default LeftArrow;
