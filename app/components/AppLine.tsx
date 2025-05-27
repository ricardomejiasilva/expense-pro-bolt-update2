import React from 'react';
import { View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors from 'config/Colors';

interface ApplineProps {
    bottom?: number;
}

const AppLine: React.FC<ApplineProps> = ({ bottom }) => {
    return (
        <View
            style={{
                width: '100%',
                height: RFPercentage(0.1),
                backgroundColor: Colors.lightWhite,
                borderRadius: RFPercentage(0.5),
                marginBottom: bottom ? bottom : 0,
            }}
        />
    );
};
export default AppLine;
