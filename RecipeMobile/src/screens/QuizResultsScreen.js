import React, { useState, useEffect } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from "react-native";
import RecipeCard from "../components/RecipeCard";
import API from "../api";

export default function QuizResultsScreen({
  navigation
}) {
  const [recipes,  setRecipes]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => { fetchRecs(); }, []);

  const fetchRecs = async () => {
    setLoading(true); setError("");
    try {
      const { data } = await API.post(
        "/quiz/recommend", {}
      );
      setRecipes(data.recommendations || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
           Your Quiz Results!
        </Text>
        <Text style={styles.headerSub}>
          Recipes matched to your preferences
        </Text>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.btn}
            onPress={fetchRecs}>
            <Text style={styles.btnText}>
               Refresh
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() =>
              navigation.navigate("Quiz")}>
            <Text style={styles.btnText}>
               Retake
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnAlt}
            onPress={() =>
              navigation.navigate("ForYou")}>
            <Text style={styles.btnAltText}>
               AI Mode
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator
            size="large" color="#e94560" />
          <Text style={styles.loadingText}>
            Finding perfect recipes...
          </Text>
        </View>
      )}

      {error !== "" && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            ❌ {error}
          </Text>
        </View>
      )}

      {!loading && (
        <FlatList
          data={recipes}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) =>
            <RecipeCard recipe={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>😕</Text>
              <Text style={styles.emptyText}>
                No recipes found.
              </Text>
              <TouchableOpacity
                style={styles.retakeBtn}
                onPress={() =>
                  navigation.navigate("Quiz")}>
                <Text style={styles.retakeBtnText}>
                  Retake Quiz
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex:1, backgroundColor:"#0f0f1a" },
  header:       { backgroundColor:"#1a1a2e",
                  padding:18, paddingTop:14,
                  borderBottomWidth:1,
                  borderBottomColor:"#2a2a45" },
  headerTitle:  { color:"white", fontSize:18,
                  fontWeight:"800", marginBottom:4 },
  headerSub:    { color:"#64748b", fontSize:12,
                  marginBottom:12 },
  btnRow:       { flexDirection:"row", gap:8 },
  btn:          { backgroundColor:"rgba(233,69,96,0.1)",
                  borderWidth:1,
                  borderColor:"rgba(233,69,96,0.3)",
                  borderRadius:8, padding:8,
                  paddingHorizontal:12 },
  btnText:      { color:"#e94560", fontWeight:"600",
                  fontSize:12 },
  btnAlt:       { backgroundColor:"rgba(100,116,139,0.1)",
                  borderWidth:1, borderColor:"#2a2a45",
                  borderRadius:8, padding:8,
                  paddingHorizontal:12 },
  btnAltText:   { color:"#94a3b8", fontWeight:"600",
                  fontSize:12 },
  loadingBox:   { flex:1, justifyContent:"center",
                  alignItems:"center" },
  loadingText:  { color:"#94a3b8", marginTop:12 },
  errorBox:     { backgroundColor:"rgba(233,69,96,0.1)",
                  margin:16, borderRadius:8,
                  padding:12, borderWidth:1,
                  borderColor:"rgba(233,69,96,0.3)" },
  errorText:    { color:"#e94560" },
  list:         { padding:16 },
  emptyBox:     { alignItems:"center", padding:50 },
  emptyEmoji:   { fontSize:36, marginBottom:10 },
  emptyText:    { color:"#64748b", fontSize:14,
                  marginBottom:16 },
  retakeBtn:    { backgroundColor:"#e94560",
                  borderRadius:8, padding:10,
                  paddingHorizontal:22 },
  retakeBtnText:{ color:"white", fontWeight:"700" },
});