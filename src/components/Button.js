import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import Icon from "./Icon";
import { colors } from "../theme/colors";
import { s } from "../styles/styles";

export default function Button({ title, onPress, busy, secondary = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={busy}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        (pressed || busy) && { opacity: 0.65 },
      ]}
    >
      {busy ? (
        <ActivityIndicator color={secondary ? colors.green : "#FFF"} />
      ) : (
        <>
          <Text style={[s.buttonText, secondary && { color: colors.green }]}>
            {title}
          </Text>
          <Icon
            name={secondary ? "log-out-outline" : "arrow-forward"}
            size={19}
            color={secondary ? colors.green : "#FFF"}
          />
        </>
      )}
    </Pressable>
  );
}
