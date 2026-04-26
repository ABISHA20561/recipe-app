import React, { useState, useEffect } from "react";
import {
  View, Text, TextInput, FlatList,
  StyleSheet, TouchableOpacity,
  ActivityIndicator
} from "react-native";
import RecipeCard from "../components/RecipeCard";
import API from "../api";

const SUGGESTIONS = [
  "chicken", "pasta", "salad", "cake",
  "soup",    "beef",  "rice",  "pizza"
];

export default function SearchScreen() {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await API.get(
          `/recipes/search?q=${
            encodeURIComponent(query)
          }&limit=20`
        );
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <View style={styles.container}>

      {/* Search input */}
      <View style={styles.searchRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search 41K+ recipes..."
          placeholderTextColor="#475569"
          value={query}
          onChangeText={setQuery}
        />
        {loading && (
          <ActivityIndicator
            size="small" color="#e94560" />
        )}
        {query !== "" && (
          <TouchableOpacity
            onPress={() => setQuery("")}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick suggestions */}
      {query === "" && (
        <View style={styles.suggestSection}>
          <Text style={styles.suggestTitle}>
            Popular searches:
          </Text>
          <View style={styles.suggestRow}>
            {SUGGESTIONS.map(s => (
              <TouchableOpacity
                key={s}
                onPress={() => setQuery(s)}
                style={styles.chip}>
                <Text style={styles.chipText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Result count */}
      {results.length > 0 && (
        <Text style={styles.resultCount}>
          {results.length} results for "{query}"
        </Text>
      )}

      {/* Results list */}
      <FlatList
        data={results}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) =>
          <RecipeCard recipe={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && query ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>😕</Text>
              <Text style={styles.emptyText}>
                No results for "{query}"
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex:1, backgroundColor:"#0f0f1a" },
  searchRow:    { flexDirection:"row", alignItems:"center",
                  backgroundColor:"#1a1a2e", margin:14,
                  borderRadius:12, paddingHorizontal:12,
                  borderWidth:1, borderColor:"#2a2a45",
                  gap:8 },
  searchIcon:   { fontSize:15 },
  input:        { flex:1, padding:13, color:"white",
                  fontSize:14 },
  clearBtn:     { color:"#64748b", fontSize:16,
                  padding:4 },
  suggestSection:{ paddingHorizontal:14,
                   marginBottom:8 },
  suggestTitle: { color:"#64748b", fontSize:12,
                  marginBottom:8 },
  suggestRow:   { flexDirection:"row", flexWrap:"wrap",
                  gap:8 },
  chip:         { backgroundColor:"#1a1a2e",
                  borderWidth:1, borderColor:"#2a2a45",
                  borderRadius:18, paddingHorizontal:12,
                  paddingVertical:6 },
  chipText:     { color:"#94a3b8", fontSize:12 },
  resultCount:  { color:"#64748b", fontSize:12,
                  paddingHorizontal:14,
                  marginBottom:4 },
  list:         { padding:14 },
  emptyBox:     { alignItems:"center", padding:50 },
  emptyEmoji:   { fontSize:36, marginBottom:10 },
  emptyText:    { color:"#64748b", fontSize:15 },
});