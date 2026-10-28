import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Brand from "./Brand";
import Icon from "./Icon";
import { colors } from "../theme/colors";
import { s } from "../styles/styles";

export default function Shell({ children }) {
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cream} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={s.page}
          keyboardShouldPersistTaps="handled"
        >
          <View style={s.container}>
            <Brand />
            {children}
            <View style={s.footer}>
              <Icon
                name="shield-checkmark-outline"
                size={15}
                color={colors.muted}
              />
              <Text style={s.footerText}>
                A little peace of mind, every time you sign in.
              </Text>
            </View>
            <Text style={s.demo}>
              LOCAL DEMO · ACCOUNTS STAY ON THIS DEVICE
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
