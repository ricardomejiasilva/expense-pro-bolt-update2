import { View, ActivityIndicator } from "react-native";
import React from "react";
import Colors from "config/Colors";

const AppLoading: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color={Colors.primary} />
    </View>
  );
};
export default AppLoading;
