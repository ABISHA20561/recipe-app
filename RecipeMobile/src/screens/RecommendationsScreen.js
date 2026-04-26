import React, { useState, useEffect } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from "react-native";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import API from "../api";

const MODES = [
  { key:"blend",   icon:"🎯", label:"Blended",
    color:"#e94560" },
  { key:"healthy", icon:"🥗", label:"Healthy",
    color:"#4ade80" },
  { key:"hedonic", icon:"😋", label:"Hedonic",
    color:"#a78bfa" },
];

export default function RecommendationsScreen({
  navigation
}) {
  const { user }  = useAuth();
  const [recipes,  setRecipes]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [mode,     setMode]     = useState("blend");
  const [topK,     setTopK]     = useState(10);

  const fetchRecs = async () => {
    setLoading(true); setError("");
    try {
      const { data } = await API.post(
        "/recipes/recommend",
        { top_k:topK, mode }
      );
      setRecipes(data.recommendations || []);
    } catch (err) {
      setError(err.response?.data?.error
        || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecs(); }, [mode, topK]);

  const currentMode = MODES.find(m => m.key === mode);

  return (
    <View style={styles.container}>

      {/* Top info bar */}
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>
          User{" "}
          <Text style={styles.infoAccent}>
            #{user?.modelUserId}
          </Text>
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Quiz")}>
          <Text style={styles.quizLink}>
            Try Quiz
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mode buttons */}
      <View style={styles.modeRow}>
        {MODES.map(m => (
          <TouchableOpacity
            key={m.key}
            onPress={() => setMode(m.key)}
            style={[
              styles.modeBtn,
              mode === m.key && {
                borderColor: m.color,
                backgroundColor: `rgba(${
                  m.key==="blend"  ? "233,69,96" :
                  m.key==="healthy"? "74,222,128":
                                     "167,139,250"
                },0.1)`
              }
            ]}>
            <Text style={styles.modeIcon}>{m.icon}</Text>
            <Text style={[
              styles.modeLabel,
              mode===m.key && { color:m.color }
            ]}>
              {m.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Top K + Refresh row */}
      <View style={styles.controlRow}>
        <Text style={styles.controlLabel}>Show:</Text>
        {[5, 10, 20].map(k => (
          <TouchableOpacity
            key={k}
            onPress={() => setTopK(k)}
            style={[
              styles.kBtn,
              topK===k && styles.kBtnActive
            ]}>
            <Text style={[
              styles.kBtnText,
              topK===k && styles.kBtnTextActive
            ]}>
              {k}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={fetchRecs}>
          <Text style={styles.refreshText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Loading state */}
      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator
            size="large"
            color={currentMode?.color || "#e94560"} />
          <Text style={styles.loadingText}>
            Getting {currentMode?.label} recipes...
          </Text>
          <Text style={styles.loadingSubText}>
            This may take 10-20 seconds
          </Text>
        </View>
      )}

      {/* Error state */}
      {error !== "" && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      )}

      {/* Recipe list */}
      {!loading && (
        <FlatList
          data={recipes}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) =>
            <RecipeCard recipe={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex:1, backgroundColor:"#0f0f1a" },
  infoBar:         { backgroundColor:"#1a1a2e",
                     flexDirection:"row",
                     justifyContent:"space-between",
                     alignItems:"center",
                     paddingHorizontal:16,
                     paddingVertical:10,
                     borderBottomWidth:1,
                     borderBottomColor:"#2a2a45" },
  infoText:        { color:"#94a3b8", fontSize:13 },
  infoAccent:      { color:"#e94560", fontWeight:"700" },
  quizLink:        { color:"#a78bfa", fontSize:13,
                     fontWeight:"600" },
  modeRow:         { flexDirection:"row", padding:10,
                     gap:8 },
  modeBtn:         { flex:1, padding:10, borderRadius:10,
                     borderWidth:1, borderColor:"#2a2a45",
                     backgroundColor:"#1a1a2e",
                     alignItems:"center" },
  modeIcon:        { fontSize:16, marginBottom:3 },
  modeLabel:       { color:"#94a3b8", fontSize:11,
                     fontWeight:"600" },
  controlRow:      { flexDirection:"row",
                     alignItems:"center",
                     paddingHorizontal:12,
                     paddingBottom:8, gap:8 },
  controlLabel:    { color:"#64748b", fontSize:12 },
  kBtn:            { padding:7, borderRadius:6,
                     borderWidth:1, borderColor:"#2a2a45",
                     minWidth:32, alignItems:"center",
                     backgroundColor:"#1a1a2e" },
  kBtnActive:      { backgroundColor:"#e94560",
                     borderColor:"#e94560" },
  kBtnText:        { color:"#94a3b8", fontSize:12 },
  kBtnTextActive:  { color:"white", fontWeight:"700" },
  refreshBtn:      { marginLeft:"auto",
                     backgroundColor:"rgba(233,69,96,0.1)",
                     borderRadius:8, padding:7,
                     paddingHorizontal:12, borderWidth:1,
                     borderColor:"rgba(233,69,96,0.3)" },
  refreshText:     { color:"#e94560", fontSize:15 },
  loadingBox:      { flex:1, justifyContent:"center",
                     alignItems:"center", padding:40 },
  loadingText:     { color:"#94a3b8", marginTop:14,
                     fontSize:14, textAlign:"center" },
  loadingSubText:  { color:"#475569", marginTop:6,
                     fontSize:12 },
  errorBox:        { backgroundColor:"rgba(233,69,96,0.1)",
                     margin:16, borderRadius:8,
                     padding:12, borderWidth:1,
                     borderColor:"rgba(233,69,96,0.3)" },
  errorText:       { color:"#e94560" },
  list:            { padding:16 },
});