import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "../AuthContext";
import { validate } from "../validation";
import Button from "../components/Button";
import Field from "../components/Field";
import Icon from "../components/Icon";
import Shell from "../components/Shell";
import { s } from "../styles/styles";

export default function AuthScreen({ navigation, signup = false }) {
  const auth = useAuth();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const change = (key) => (value) => {
    setValues((old) => ({ ...old, [key]: value }));
    setErrors((old) => ({ ...old, [key]: "" }));
    setMessage("");
  };
  async function submit() {
    if (busy) return;
    const next = validate(values, signup);
    setErrors(next);
    setMessage("");
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      if (signup) await auth.signup(values.name, values.email, values.password);
      else await auth.login(values.email, values.password);
    } catch (error) {
      setMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Shell>
      <View style={s.intro}>
        <View style={s.illustration}>
          <View style={s.orbit} />
          <View style={s.lock}>
            <Icon
              name={signup ? "person-add-outline" : "lock-closed-outline"}
              size={34}
            />
          </View>
          <View style={s.spark}>
            <Icon name="sparkles" size={20} />
          </View>
        </View>
        <Text style={s.eyebrow}>
          {signup ? "MAKE YOURSELF AT HOME" : "GOOD TO SEE YOU AGAIN"}
        </Text>
        <Text style={s.title}>
          {signup ? "Your next chapter." : "Welcome back."}
        </Text>
        <Text style={s.subtitle}>
          {signup
            ? "Create your account. A space of your own awaits."
            : "Your space is right where you left it. Log in to continue."}
        </Text>
      </View>
      <View style={s.card}>
        <View style={s.cardHeading}>
          <Text style={s.cardTitle}>
            {signup ? "Create an account" : "Log in to your account"}
          </Text>
          <Icon name="shield-checkmark-outline" size={21} />
        </View>
        {signup && (
          <Field
            label="Full name"
            icon="person-outline"
            placeholder="e.g. Alex Morgan"
            value={values.name}
            onChangeText={change("name")}
            autoComplete="name"
            textContentType="name"
            error={errors.name}
            editable={!busy}
          />
        )}
        <Field
          label="Email address"
          icon="mail-outline"
          placeholder="you@example.com"
          value={values.email}
          onChangeText={change("email")}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          error={errors.email}
          editable={!busy}
        />
        <Field
          label="Password"
          icon="lock-closed-outline"
          placeholder={
            signup ? "Create a strong password" : "Enter your password"
          }
          value={values.password}
          onChangeText={change("password")}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={signup ? "new-password" : "current-password"}
          textContentType={signup ? "newPassword" : "password"}
          password
          error={errors.password}
          editable={!busy}
          onSubmitEditing={submit}
          returnKeyType="go"
        />
        {signup && (
          <Text style={s.hint}>
            At least 6 characters. Make it uniquely yours.
          </Text>
        )}
        {message || auth.storageError ? (
          <Text accessibilityRole="alert" style={s.error}>
            {message || auth.storageError}
          </Text>
        ) : null}
        <Button
          title={signup ? "Signup" : "Login"}
          onPress={submit}
          busy={busy}
        />
        <View style={s.divider} />
        <View style={s.switchRow}>
          <Text style={s.switchText}>
            {signup ? "Already part of the nest?" : "New around here?"}
          </Text>
          <Pressable
            disabled={busy}
            accessibilityRole="button"
            onPress={() => navigation.navigate(signup ? "Login" : "Signup")}
          >
            <Text style={s.link}>
              {signup ? "Go to Login" : "Go to Signup"} ↗
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={s.note}>
        <View style={s.noteDot} />
        <Text style={s.noteText}>One account. Your own little corner.</Text>
      </View>
    </Shell>
  );
}
