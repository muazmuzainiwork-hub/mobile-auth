import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function Icon({ name, size = 22, color = colors.green }) {
  return <Ionicons name={name} size={size} color={color} />;
}
