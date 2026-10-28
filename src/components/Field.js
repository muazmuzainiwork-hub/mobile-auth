import React, { useState } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import Icon from "./Icon";
import { colors } from "../theme/colors";
import { s } from "../styles/styles";

export default function Field({ label, icon, error, password, ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={s.fieldGroup}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.inputWrap, error && { borderColor: "#B6473B" }]}>
        <Icon name={icon} size={19} color={colors.muted} />
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor="#93A198"
          style={[s.input, Platform.OS === "web" && { outlineStyle: "none" }]}
          secureTextEntry={password && !visible}
          {...props}
        />
        {password && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? "Hide password" : "Show password"}
            hitSlop={12}
            onPress={() => setVisible(!visible)}
          >
            <Icon
              name={visible ? "eye-off-outline" : "eye-outline"}
              color={colors.muted}
              size={21}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text accessibilityRole="alert" style={s.fieldError}>
          {error}
        </Text>
      )}
    </View>
  );
}
