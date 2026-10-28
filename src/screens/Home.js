import React, { useState } from "react";
import { Text, View } from "react-native";
import { useAuth } from "../AuthContext";
import Button from "../components/Button";
import Icon from "../components/Icon";
import Shell from "../components/Shell";
import { s } from "../styles/styles";

export default function Home() {
  const { user, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function leave() {
    setBusy(true);
    try {
      await logout();
    } catch {
      setError("Could not sign out. Please try again.");
      setBusy(false);
    }
  }
  return (
    <Shell>
      <View style={s.intro}>
        <View style={s.avatar}>
          <Text style={s.initial}>{user.name.slice(0, 1).toUpperCase()}</Text>
          <View style={s.check}>
            <Icon name="checkmark" color="white" size={17} />
          </View>
        </View>
        <Text style={s.eyebrow}>YOU’RE RIGHT AT HOME</Text>
        <Text style={s.title}>Hello, {user.name.split(" ")[0]}.</Text>
        <Text style={s.subtitle}>A fresh start, in your own space.</Text>
      </View>
      <View style={s.card}>
        <View style={s.cardHeading}>
          <Text style={s.cardTitle}>Your profile</Text>
          <View style={s.active}>
            <Text style={s.activeText}>● Signed in</Text>
          </View>
        </View>
        <View style={s.profileRow}>
          <Icon name="person-outline" />
          <View>
            <Text style={s.profileLabel}>FULL NAME</Text>
            <Text selectable style={s.profileValue}>
              {user.name}
            </Text>
          </View>
        </View>
        <View style={s.profileRow}>
          <Icon name="mail-outline" />
          <View style={{ flex: 1 }}>
            <Text style={s.profileLabel}>EMAIL ADDRESS</Text>
            <Text selectable style={s.profileValue}>
              {user.email}
            </Text>
          </View>
        </View>
        <View style={s.sessionNote}>
          <Icon name="checkmark-circle-outline" size={20} />
          <Text style={s.sessionText}>
            You’re all set. We’ll remember you on this device until you log out.
          </Text>
        </View>
        {error && (
          <Text accessibilityRole="alert" style={s.error}>
            {error}
          </Text>
        )}
        <Button title="Logout" onPress={leave} busy={busy} secondary />
      </View>
    </Shell>
  );
}
