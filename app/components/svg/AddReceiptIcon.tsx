import React from "react";
import { Path, Svg } from "react-native-svg";

interface AddReceiptIconProps {
    width?: number;
    height?: number;
}

const AddReceiptIcon = ({ width, height }: AddReceiptIconProps) => {
    return (
        <Svg width="17" height="16" viewBox="0 0 17 16" fill="none">
            <Path d="M13.749 9.25H2.87554C2.80679 9.25 2.75054 9.30625 2.75054 9.375V10.3125C2.75054 10.3812 2.80679 10.4375 2.87554 10.4375H12.3318L10.0771 13.2969C10.013 13.3781 10.0708 13.5 10.1755 13.5H11.3083C11.3849 13.5 11.4568 13.4656 11.5052 13.4047L14.1427 10.0594C14.4005 9.73125 14.1677 9.25 13.749 9.25ZM14.1255 5.5625H4.66929L6.92397 2.70312C6.98804 2.62188 6.93022 2.5 6.82554 2.5H5.69272C5.61616 2.5 5.54429 2.53438 5.49585 2.59531L2.85835 5.94063C2.60054 6.26875 2.83335 6.75 3.25054 6.75H14.1255C14.1943 6.75 14.2505 6.69375 14.2505 6.625V5.6875C14.2505 5.61875 14.1943 5.5625 14.1255 5.5625Z" fill="#277C6C"/>
        </Svg>
    );
};

export default AddReceiptIcon;
