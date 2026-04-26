import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, StatusBar
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function LoginScreen({ navigation }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill all fields"); return;
    }
    setLoading(true); setError("");
    try {
      const { data } = await API.post("/auth/login",
        { email, password });
      login(data.token, data.user);
    } catch (err) {
      setError(err.response?.data?.error
        || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <StatusBar barStyle="light-content"
        backgroundColor="#0f0f1a" />

      <Text style={styles.emoji}></Text>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Login to get your personalized recipes
      </Text>

      {error !== "" && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#475569"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#475569"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.btnWrapper}
        onPress={handleLogin}
        disabled={loading}>
        <LinearGradient
          colors={["#e94560", "#a855f7"]}
          style={styles.btn}
          start={{ x:0, y:0 }}
          end={{ x:1, y:0 }}>
          <Text style={styles.btnText}>
            {loading ? "Logging in..." : "Login →"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>
          No account?{" "}
          <Text style={styles.linkAccent}>
            Register here
          </Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#0f0f1a" },
  content:   { flexGrow:1, justifyContent:"center",
               padding:28 },
  emoji:     { fontSize:48, textAlign:"center",
               marginBottom:14 },
  title:     { color:"white", fontSize:24,
               fontWeight:"800", textAlign:"center",
               marginBottom:6 },
  subtitle:  { color:"#64748b", textAlign:"center",
               fontSize:13, marginBottom:28 },
  errorBox:  { backgroundColor:"rgba(233,69,96,0.1)",
               borderWidth:1,
               borderColor:"rgba(233,69,96,0.3)",
               borderRadius:8, padding:10,
               marginBottom:14 },
  errorText: { color:"#e94560", fontSize:13 },
  input:     { backgroundColor:"#1a1a2e",
               borderWidth:1, borderColor:"#2a2a45",
               borderRadius:12, padding:14,
               color:"white", fontSize:14,
               marginBottom:12 },
  btnWrapper:{ borderRadius:12, overflow:"hidden",
               marginBottom:20 },
  btn:       { padding:16, alignItems:"center" },
  btnText:   { color:"white", fontWeight:"700",
               fontSize:15 },
  link:      { color:"#64748b", textAlign:"center",
               fontSize:13 },
  linkAccent:{ color:"#e94560", fontWeight:"600" },
});