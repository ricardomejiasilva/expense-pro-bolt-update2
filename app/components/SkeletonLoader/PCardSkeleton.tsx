import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

const PCardSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, [opacity]);

  const animatedStyle = {
    opacity,
    backgroundColor: "#E0E0E0",
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: RFPercentage(0.2),
      }}
    >
      <Animated.View
        style={[
          {
            height: RFPercentage(2),
            width: RFPercentage(25),
            borderRadius: RFPercentage(0.5),
          },
          animatedStyle,
        ]}
      />

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Animated.View
          style={[
            {
              height: RFPercentage(2),
              width: RFPercentage(12),
              borderRadius: RFPercentage(0.5),
              marginHorizontal: RFPercentage(0.5),
            },
            animatedStyle,
          ]}
        />

        {/* Arrow icon placeholder */}
        <Animated.View
          style={[
            {
              height: RFPercentage(2.4),
              width: RFPercentage(2.4),
              borderRadius: RFPercentage(0.5),
            },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
};

export default PCardSkeleton;
