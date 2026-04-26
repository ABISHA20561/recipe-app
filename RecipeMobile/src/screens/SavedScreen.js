import React, { useState, useEffect } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from "react-native";
import RecipeCard from "../components/RecipeCard";
import API from "../api";

export default function SavedScreen() {
  const [saved,   setSaved]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/recipes/saved")
       .then(r => setSaved(r.data))
       .catch(() => {})
       .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    Alert.alert("Remove Recipe",
      "Remove this from saved?", [
      { text:"Cancel", style:"cancel" },
      { text:"Remove", style:"destructive",
        onPress: async () => {
          await API.delete(`/recipes/saved/${id}`);
          setSaved(p => p.filter(r => r._id !== id));
        }
      }
    ]);
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#e94560" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          💾 Saved Recipes
        </Text>
        <Text style={styles.headerCount}>
          {saved.length}
        </Text>
      </View>

      <FlatList
        data={saved}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View>
            <RecipeCard recipe={item}
              showSave={false} />
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item._id)}>
              <Text style={styles.deleteBtnText}>
                🗑 Remove
              </Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>
              No saved recipes yet
            </Text>
            <Text style={styles.emptyDesc}>
              Save recipes you love to find them later
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex:1, backgroundColor:"#0f0f1a" },
  center:       { flex:1, justifyContent:"center",
                  alignItems:"center",
                  backgroundColor:"#0f0f1a" },
  header:       { flexDirection:"row",
                  justifyContent:"space-between",
                  alignItems:"center",
                  padding:16, paddingBottom:8 },
  headerTitle:  { color:"white", fontSize:18,
                  fontWeight:"800" },
  headerCount:  { color:"#e94560", fontWeight:"700",
                  fontSize:16,
                  backgroundColor:"rgba(233,69,96,0.1)",
                  paddingHorizontal:10,
                  paddingVertical:3,
                  borderRadius:12 },
  list:         { padding:16 },
  deleteBtn:    { backgroundColor:"rgba(233,69,96,0.1)",
                  borderWidth:1,
                  borderColor:"rgba(233,69,96,0.3)",
                  borderRadius:8, padding:10,
                  alignItems:"center",
                  marginTop:-8, marginBottom:16 },
  deleteBtnText:{ color:"#e94560", fontWeight:"600",
                  fontSize:13 },
  emptyBox:     { alignItems:"center", padding:60 },
  emptyEmoji:   { fontSize:44, marginBottom:14 },
  emptyTitle:   { color:"white", fontSize:17,
                  fontWeight:"700", marginBottom:6 },
  emptyDesc:    { color:"#64748b", fontSize:13,
                  textAlign:"center" },
});