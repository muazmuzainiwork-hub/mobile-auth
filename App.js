import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/AuthContext';
import { validate } from './src/validation';

const Stack = createNativeStackNavigator();
const colors = { ink: '#173D36', green: '#22785F', muted: '#687D75', border: '#DCE5DD', cream: '#F5F7EF' };
function Icon({ name, size = 22, color = colors.green }) { return <Ionicons name={name} size={size} color={color} />; }
function Button({ title, onPress, busy, secondary = false }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} disabled={busy} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondary, (pressed || busy) && { opacity: 0.65 }]}>
    {busy ? <ActivityIndicator color={secondary ? colors.green : '#FFF'} /> : <><Text style={[s.buttonText, secondary && { color: colors.green }]}>{title}</Text><Icon name={secondary ? 'log-out-outline' : 'arrow-forward'} size={19} color={secondary ? colors.green : '#FFF'} /></>}
  </Pressable>;
}
function Field({ label, icon, error, password, ...props }) {
  const [visible, setVisible] = useState(false);
  return <View style={s.fieldGroup}><Text style={s.label}>{label}</Text><View style={[s.inputWrap, error && { borderColor: '#B6473B' }]}>
    <Icon name={icon} size={19} color={colors.muted} /><TextInput accessibilityLabel={label} placeholderTextColor="#93A198" style={[s.input, Platform.OS === 'web' && { outlineStyle: 'none' }]} secureTextEntry={password && !visible} {...props} />
    {password && <Pressable accessibilityRole="button" accessibilityLabel={visible ? 'Hide password' : 'Show password'} hitSlop={12} onPress={() => setVisible(!visible)}><Icon name={visible ? 'eye-off-outline' : 'eye-outline'} color={colors.muted} size={21} /></Pressable>}
  </View>{error && <Text accessibilityRole="alert" style={s.fieldError}>{error}</Text>}</View>;
}
function Brand() { return <View style={s.brand}><View style={s.brandIcon}><Icon name="leaf" color="white" size={23} /></View><Text style={s.brandName}>nest<Text style={{ color: '#82A58D' }}>.</Text></Text><View style={s.brandTag}><Text style={s.tagText}>YOUR SPACE, SECURED</Text></View></View>; }
function Shell({ children }) {
  return <SafeAreaView style={s.safe}><StatusBar barStyle="dark-content" backgroundColor={colors.cream} /><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled"><View style={s.container}><Brand />{children}<View style={s.footer}><Icon name="shield-checkmark-outline" size={15} color={colors.muted} /><Text style={s.footerText}>A little peace of mind, every time you sign in.</Text></View><Text style={s.demo}>LOCAL DEMO · ACCOUNTS STAY ON THIS DEVICE</Text></View></ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
function AuthScreen({ navigation, signup = false }) {
  const auth = useAuth();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const change = key => value => { setValues(old => ({ ...old, [key]: value })); setErrors(old => ({ ...old, [key]: '' })); setMessage(''); };
  async function submit() {
    if (busy) return;
    const next = validate(values, signup); setErrors(next); setMessage('');
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      if (signup) await auth.signup(values.name, values.email, values.password);
      else await auth.login(values.email, values.password);
    } catch (error) { setMessage(error.message || 'Something went wrong. Please try again.'); }
    finally { setBusy(false); }
  }
  return <Shell><View style={s.intro}><View style={s.illustration}><View style={s.orbit} /><View style={s.lock}><Icon name={signup ? 'person-add-outline' : 'lock-closed-outline'} size={34} /></View><View style={s.spark}><Icon name="sparkles" size={20} /></View></View><Text style={s.eyebrow}>{signup ? 'MAKE YOURSELF AT HOME' : 'GOOD TO SEE YOU AGAIN'}</Text><Text style={s.title}>{signup ? 'Your next chapter.' : 'Welcome back.'}</Text><Text style={s.subtitle}>{signup ? 'Create your account. A space of your own awaits.' : 'Your space is right where you left it. Log in to continue.'}</Text></View>
    <View style={s.card}><View style={s.cardHeading}><Text style={s.cardTitle}>{signup ? 'Create an account' : 'Log in to your account'}</Text><Icon name="shield-checkmark-outline" size={21} /></View>
      {signup && <Field label="Full name" icon="person-outline" placeholder="e.g. Alex Morgan" value={values.name} onChangeText={change('name')} autoComplete="name" textContentType="name" error={errors.name} editable={!busy} />}
      <Field label="Email address" icon="mail-outline" placeholder="you@example.com" value={values.email} onChangeText={change('email')} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" error={errors.email} editable={!busy} />
      <Field label="Password" icon="lock-closed-outline" placeholder={signup ? 'Create a strong password' : 'Enter your password'} value={values.password} onChangeText={change('password')} autoCapitalize="none" autoCorrect={false} autoComplete={signup ? 'new-password' : 'current-password'} textContentType={signup ? 'newPassword' : 'password'} password error={errors.password} editable={!busy} onSubmitEditing={submit} returnKeyType="go" />
      {signup && <Text style={s.hint}>At least 6 characters. Make it uniquely yours.</Text>}
      {(message || auth.storageError) ? <Text accessibilityRole="alert" style={s.error}>{message || auth.storageError}</Text> : null}
      <Button title={signup ? 'Signup' : 'Login'} onPress={submit} busy={busy} />
      <View style={s.divider} /><View style={s.switchRow}><Text style={s.switchText}>{signup ? 'Already part of the nest?' : 'New around here?'}</Text><Pressable disabled={busy} accessibilityRole="button" onPress={() => navigation.navigate(signup ? 'Login' : 'Signup')}><Text style={s.link}>{signup ? 'Go to Login' : 'Go to Signup'} ↗</Text></Pressable></View>
    </View><View style={s.note}><View style={s.noteDot} /><Text style={s.noteText}>One account. Your own little corner.</Text></View></Shell>;
}
function Login(props) { return <AuthScreen {...props} />; }
function Signup(props) { return <AuthScreen {...props} signup />; }
function Home() {
  const { user, logout } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function leave() { setBusy(true); try { await logout(); } catch { setError('Could not sign out. Please try again.'); setBusy(false); } }
  return <Shell><View style={s.intro}><View style={s.avatar}><Text style={s.initial}>{user.name.slice(0, 1).toUpperCase()}</Text><View style={s.check}><Icon name="checkmark" color="white" size={17} /></View></View><Text style={s.eyebrow}>YOU’RE RIGHT AT HOME</Text><Text style={s.title}>Hello, {user.name.split(' ')[0]}.</Text><Text style={s.subtitle}>A fresh start, in your own space.</Text></View><View style={s.card}><View style={s.cardHeading}><Text style={s.cardTitle}>Your profile</Text><View style={s.active}><Text style={s.activeText}>● Signed in</Text></View></View><View style={s.profileRow}><Icon name="person-outline" /><View><Text style={s.profileLabel}>FULL NAME</Text><Text selectable style={s.profileValue}>{user.name}</Text></View></View><View style={s.profileRow}><Icon name="mail-outline" /><View style={{ flex: 1 }}><Text style={s.profileLabel}>EMAIL ADDRESS</Text><Text selectable style={s.profileValue}>{user.email}</Text></View></View><View style={s.sessionNote}><Icon name="checkmark-circle-outline" size={20} /><Text style={s.sessionText}>You’re all set. We’ll remember you on this device until you log out.</Text></View>{error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}<Button title="Logout" onPress={leave} busy={busy} secondary /></View></Shell>;
}
function Routes() { const { user, ready } = useAuth(); if (!ready) return <SafeAreaView style={[s.safe, { justifyContent: 'center' }]}><ActivityIndicator size="large" color={colors.green} accessibilityLabel="Restoring session" /></SafeAreaView>; return <NavigationContainer><Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>{user ? <Stack.Screen name="Home" component={Home} /> : <><Stack.Screen name="Login" component={Login} /><Stack.Screen name="Signup" component={Signup} /></>}</Stack.Navigator></NavigationContainer>; }
export default function App() { return <SafeAreaProvider><AuthProvider><Routes /></AuthProvider></SafeAreaProvider>; }
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream }, page: { flexGrow: 1, paddingHorizontal: 22, paddingVertical: 30, alignItems: 'center' }, container: { width: '100%', maxWidth: 460 }, brand: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 9 }, brandIcon: { backgroundColor: colors.green, width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, brandName: { fontSize: 30, fontWeight: '800', letterSpacing: -1.5, color: colors.ink }, brandTag: { marginLeft: 'auto' }, tagText: { fontSize: 8, fontWeight: '700', letterSpacing: 1.3, color: colors.muted }, intro: { alignItems: 'center', marginBottom: 26 }, illustration: { height: 112, width: 142, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }, orbit: { position: 'absolute', height: 110, width: 110, borderRadius: 55, borderColor: '#DCE6D8', borderWidth: 1, transform: [{ scaleX: 1.2 }, { rotate: '-25deg' }] }, lock: { height: 80, width: 80, borderRadius: 27, backgroundColor: '#E2ECDF', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-8deg' }] }, spark: { position: 'absolute', right: 3, top: 8, width: 34, height: 34, borderRadius: 17, backgroundColor: '#ECEDCF', alignItems: 'center', justifyContent: 'center' }, eyebrow: { color: colors.green, fontSize: 9, fontWeight: '800', letterSpacing: 2.1, marginBottom: 10 }, title: { fontSize: 34, fontWeight: '700', letterSpacing: -1.3, color: colors.ink, textAlign: 'center' }, subtitle: { fontSize: 14, lineHeight: 22, color: colors.muted, textAlign: 'center', maxWidth: 290, marginTop: 10 }, card: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8DE', borderRadius: 24, padding: 24, shadowColor: '#243D2C', shadowOpacity: 0.035, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } }, cardHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, gap: 8 }, cardTitle: { fontSize: 18, fontWeight: '700', color: colors.ink, letterSpacing: -0.4 }, fieldGroup: { marginBottom: 18 }, label: { fontSize: 12, fontWeight: '600', color: colors.ink, marginBottom: 9 }, inputWrap: { borderWidth: 1, borderColor: colors.border, backgroundColor: '#FCFDFB', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10, minHeight: 52 }, input: { flex: 1, fontSize: 14, color: colors.ink, paddingVertical: 15, minWidth: 0 }, fieldError: { fontSize: 12, color: '#AD4039', marginTop: 6 }, button: { backgroundColor: colors.green, borderRadius: 12, minHeight: 53, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 12, marginTop: 7 }, buttonText: { color: '#FFF', fontSize: 14, fontWeight: '700' }, secondary: { backgroundColor: '#F5F8F2', borderWidth: 1, borderColor: colors.border }, divider: { height: 1, backgroundColor: '#EDF0E9', marginVertical: 24 }, switchRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 6 }, switchText: { color: colors.muted, fontSize: 12 }, link: { color: colors.green, fontSize: 12, fontWeight: '700' }, hint: { color: colors.muted, fontSize: 11, marginTop: -8, marginBottom: 15 }, error: { color: '#A13830', fontSize: 12, lineHeight: 18, backgroundColor: '#FFF0ED', padding: 12, borderRadius: 10, marginBottom: 12 }, note: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 23 }, noteDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#83A57D' }, noteText: { fontSize: 12, color: colors.muted }, footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 38 }, footerText: { color: colors.muted, fontSize: 10 }, demo: { fontSize: 8, letterSpacing: 1.2, textAlign: 'center', color: '#879589', marginTop: 16 }, avatar: { width: 90, height: 90, borderRadius: 32, backgroundColor: '#DFEBDD', justifyContent: 'center', alignItems: 'center', marginVertical: 22 }, initial: { fontSize: 38, color: colors.green, fontWeight: '600' }, check: { position: 'absolute', bottom: -3, right: -3, backgroundColor: colors.green, borderWidth: 4, borderColor: colors.cream, borderRadius: 16, padding: 3 }, active: { backgroundColor: '#EDF6EA', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 6 }, activeText: { color: colors.green, fontSize: 10, fontWeight: '600' }, profileRow: { flexDirection: 'row', gap: 14, alignItems: 'center', paddingBottom: 22 }, profileLabel: { color: colors.muted, fontSize: 9, letterSpacing: 1.3, marginBottom: 5 }, profileValue: { fontSize: 16, color: colors.ink, flexShrink: 1 }, sessionNote: { backgroundColor: '#F0F5EB', borderRadius: 12, padding: 14, flexDirection: 'row', gap: 10, marginBottom: 16 }, sessionText: { color: colors.muted, fontSize: 12, lineHeight: 19, flex: 1 },
});
