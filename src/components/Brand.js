import React from "react";
import { Text, View } from "react-native";
import Icon from "./Icon";
import { s } from "../styles/styles";

export default function Brand() {
  return (
    <View style={s.brand}>
      <View style={s.brandIcon}>
        <Icon name="leaf" color="white" size={23} />
      </View>
      <Text style={s.brandName}>
        nest<Text style={{ color: "#82A58D" }}>.</Text>
      </Text>
      <View style={s.brandTag}>
        <Text style={s.tagText}>YOUR SPACE, SECURED</Text>
      </View>
    </View>
  );
}
