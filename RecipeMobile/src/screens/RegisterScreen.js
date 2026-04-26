import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function RegisterScreen({ navigation }) {
  const [username,    setUsername]    = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [modelUserId, setModelUserId] = useState("");
  const [users,       setUsers]       = useState([]);
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    API.get("/recipes/users/sample")
       .then(r => setUsers(r.data.users || []))
       .catch(() => {});
  }, []);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("Please fill all fields"); return;
    }
    setLoading(true); setError("");
    try {
      const { data } = await API.post("/auth/register", {
        username, email, password,
        modelUserId: modelUserId
          ? parseInt(modelUserId) : null,
      });
      login(data.token, data.user);
    } catch (err) {
      setError(err.response?.data?.error
        || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">

      <Text style={styles.title}>Create Account </Text>
      <Text style={styles.subtitle}>
        Join to get AI-powered recipe recommendations
      </Text>

      {error !== "" && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}> {error}</Text>
        </View>
      )}

      <TextInput style={styles.input}
        placeholder="Username"
        placeholderTextColor="#475569"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none" />

      <TextInput style={styles.input}
        placeholder="Email"
        placeholderTextColor="#475569"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none" />

      <TextInput style={styles.input}
        placeholder="Password"
        placeholderTextColor="#475569"
        value={password}
        onChangeText={setPassword}
        secureTextEntry />

      <Text style={styles.label}>
        Link Dataset User ID (optional):
      </Text>

      {/* Picker with full dark background fix for Android */}
      <View style={styles.pickerBox}>
        <Picker
          selectedValue={modelUserId}
          onValueChange={setModelUserId}
          style={styles.picker}
          dropdownIconColor="#e94560"
          mode="dropdown">
          <Picker.Item
            label="-- Skip: Take quiz instead --"
            value=""
            color={Platform.OS === "android" ? "#ffffff" : "#94a3b8"}
            style={{ backgroundColor: "#1a1a2e" }}
          />
          {users.map(uid => (
            <Picker.Item
              key={uid}
              label={`User ID: ${uid}`}
              value={String(uid)}
              color="#ffffff"
              style={{ backgroundColor: "#1a1a2e" }}
            />
          ))}
        </Picker>
      </View>

      {/* Selected value display so user can always see what's chosen */}
      <View style={styles.selectedBox}>
        <Text style={styles.selectedLabel}>Selected: </Text>
        <Text style={styles.selectedValue}>
          {modelUserId ? `User ID: ${modelUserId}` : "Skip — Take quiz instead"}
        </Text>
      </View>

      {/* Path indicator */}
      <View style={styles.pathRow}>
        <View style={[styles.pathCard,
          !modelUserId && styles.pathActive]}>
          <Text style={styles.pathIcon}>❔</Text>
          <Text style={styles.pathTitle}>Quiz</Text>
          <Text style={styles.pathDesc}>10 questions</Text>
        </View>
        <View style={[styles.pathCard,
          modelUserId && styles.pathActiveGreen]}>
          <Text style={styles.pathIcon}>🤖</Text>
          <Text style={styles.pathTitle}>AI Model</Text>
          <Text style={styles.pathDesc}>P2D neural</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.btnWrapper}
        onPress={handleRegister}
        disabled={loading}>
        <LinearGradient
          colors={["#e94560", "#a855f7"]}
          style={styles.btn}
          start={{ x:0, y:0 }}
          end={{ x:1, y:0 }}>
          <Text style={styles.btnText}>
            {loading ? "Creating..." :
             modelUserId
               ? "Register → AI Recs "
               : "Register → Quiz "}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>
          Have an account?{" "}
          <Text style={styles.linkAccent}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:       { flex:1, backgroundColor:"#0f0f1a" },
  content:         { flexGrow:1, padding:24, paddingTop:48 },
  title:           { color:"white", fontSize:22,
                     fontWeight:"800", marginBottom:6 },
  subtitle:        { color:"#64748b", fontSize:12,
                     marginBottom:20 },
  errorBox:        { backgroundColor:"rgba(233,69,96,0.1)",
                     borderWidth:1,
                     borderColor:"rgba(233,69,96,0.3)",
                     borderRadius:8, padding:10,
                     marginBottom:12 },
  errorText:       { color:"#e94560", fontSize:12 },
  input:           { backgroundColor:"#1a1a2e",
                     borderWidth:1, borderColor:"#2a2a45",
                     borderRadius:12, padding:13,
                     color:"white", fontSize:14,
                     marginBottom:10 },
  label:           { color:"#94a3b8", fontSize:12,
                     marginBottom:6 },
  pickerBox:       { backgroundColor:"#1a1a2e",
                     borderWidth:1, borderColor:"#2a2a45",
                     borderRadius:12, overflow:"hidden",
                     marginBottom:6 },
  picker:          { color:"#ffffff",
                     backgroundColor:"#1a1a2e",
                     height:52 },
  selectedBox:     { flexDirection:"row",
                     alignItems:"center",
                     backgroundColor:"rgba(233,69,96,0.07)",
                     borderWidth:1,
                     borderColor:"rgba(233,69,96,0.2)",
                     borderRadius:8, padding:8,
                     marginBottom:12 },
  selectedLabel:   { color:"#64748b", fontSize:11 },
  selectedValue:   { color:"#e94560", fontSize:11,
                     fontWeight:"600", flex:1 },
  pathRow:         { flexDirection:"row", gap:10,
                     marginBottom:16 },
  pathCard:        { flex:1, backgroundColor:"#1a1a2e",
                     borderWidth:1, borderColor:"#2a2a45",
                     borderRadius:10, padding:12,
                     alignItems:"center" },
  pathActive:      { borderColor:"rgba(233,69,96,0.5)",
                     backgroundColor:"rgba(233,69,96,0.08)" },
  pathActiveGreen: { borderColor:"rgba(74,222,128,0.5)",
                     backgroundColor:"rgba(74,222,128,0.08)" },
  pathIcon:        { fontSize:18, marginBottom:3 },
  pathTitle:       { color:"white", fontWeight:"700",
                     fontSize:12 },
  pathDesc:        { color:"#64748b", fontSize:10 },
  btnWrapper:      { borderRadius:12, overflow:"hidden",
                     marginBottom:16 },
  btn:             { padding:15, alignItems:"center" },
  btnText:         { color:"white", fontWeight:"700",
                     fontSize:14 },
  link:            { color:"#64748b", textAlign:"center",
                     fontSize:12 },
  linkAccent:      { color:"#e94560", fontWeight:"600" },
});