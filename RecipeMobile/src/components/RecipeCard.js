import React, { useState } from "react";
import {
  View, Text, Image, TouchableOpacity,
  StyleSheet, Alert
} from "react-native";
import API from "../api";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
];

const KEYWORD_IMAGES = {
  chicken: "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&q=80",
  pasta:   "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80",
  salad:   "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  cake:    "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&q=80",
  soup:    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80",
  bread:   "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  beef:    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
  fish:    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
  rice:    "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80",
  pizza:   "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
  burger:  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  cookie:  "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80",
};

function getImage(recipe) {
  const name = (recipe.name || "").toLowerCase();
  for (const [key, url] of Object.entries(KEYWORD_IMAGES)) {
    if (name.includes(key)) return url;
  }
  const idx = (recipe.id || recipe.recipe_idx || 0)
    % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[idx];
}

const NUTRIENT_LABELS = [
  "Cal", "Fat%", "Sugar%", "Na%"
];

export default function RecipeCard({
  recipe, showSave = true
}) {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await API.post("/recipes/save", {
        recipeIdx:   recipe.recipe_idx,
        recipeId:    recipe.id,
        name:        recipe.name,
        ingredients: recipe.ingredients,
        nutrition:   recipe.nutrition,
        score:       recipe.score || 0,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      Alert.alert("Error", "Please login to save recipes");
    }
  };

  return (
    <View style={styles.card}>

      {/* Image section */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: getImage(recipe) }}
          style={styles.image}
        />
        {/* Dark gradient overlay */}
        <View style={styles.imageOverlay} />

        {/* Score badge on image */}
        {recipe.score !== undefined && (
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>
               {recipe.score}
            </Text>
          </View>
        )}
      </View>

      {/* Content section */}
      <View style={styles.content}>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {recipe.name}
        </Text>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <Text style={styles.metaItem}>
            ⏱ {recipe.minutes}m
          </Text>
          <Text style={styles.metaItem}>
            📋 {recipe.n_steps} steps
          </Text>
          <Text style={styles.metaItem}>
            🥦 {recipe.n_ingredients}
          </Text>
        </View>

        {/* Nutrition badges */}
        {recipe.nutrition?.length > 0 && (
          <View style={styles.nutritionRow}>
            {recipe.nutrition.slice(0, 4).map((val, i) => (
              <View key={i} style={styles.nutBadge}>
                <Text style={styles.nutText}>
                  {NUTRIENT_LABELS[i]}:{" "}
                  {typeof val === "number"
                    ? val.toFixed(1) : val}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Ingredients preview */}
        {recipe.ingredients?.length > 0 && (
          <Text style={styles.ingredients}
            numberOfLines={2}>
            🧂 {recipe.ingredients.slice(0, 4).join(", ")}
            {recipe.ingredients.length > 4 ? "..." : ""}
          </Text>
        )}

        {/* Save button */}
        {showSave && (
          <TouchableOpacity
            style={[
              styles.saveBtn,
              saved && styles.saveBtnSaved
            ]}
            onPress={handleSave}>
            <Text style={[
              styles.saveBtnText,
              saved && styles.saveBtnTextSaved
            ]}>
              {saved ? "✅ Saved!" : "💾 Save Recipe"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius:    14,
    overflow:        "hidden",
    marginBottom:    16,
    borderWidth:     1,
    borderColor:     "#2a2a45",
    elevation:       4,
    shadowColor:     "#000",
    shadowOffset:    { width:0, height:2 },
    shadowOpacity:   0.3,
    shadowRadius:    4,
  },
  imageWrapper: {
    height:   180,
    position: "relative",
  },
  image: {
    width:      "100%",
    height:     "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position:        "absolute",
    bottom:          0,
    left:            0,
    right:           0,
    height:          80,
    backgroundColor: "transparent",
    // Simple fade effect
    borderBottomLeftRadius:  14,
    borderBottomRightRadius: 14,
  },
  scoreBadge: {
    position:        "absolute",
    top:             10,
    right:           10,
    backgroundColor: "rgba(15,15,26,0.85)",
    borderRadius:    20,
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderWidth:     1,
    borderColor:     "rgba(74,222,128,0.4)",
  },
  scoreText: {
    color:      "#4ade80",
    fontSize:   12,
    fontWeight: "700",
  },
  content: {
    padding: 14,
  },
  title: {
    color:        "white",
    fontSize:     15,
    fontWeight:   "700",
    marginBottom: 8,
    lineHeight:   22,
  },
  metaRow: {
    flexDirection: "row",
    gap:           12,
    marginBottom:  8,
  },
  metaItem: {
    color:    "#64748b",
    fontSize: 12,
  },
  nutritionRow: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           4,
    marginBottom:  8,
  },
  nutBadge: {
    backgroundColor: "rgba(96,165,250,0.1)",
    borderRadius:    6,
    paddingHorizontal: 8,
    paddingVertical:   2,
    borderWidth:     1,
    borderColor:     "rgba(96,165,250,0.2)",
  },
  nutText: {
    color:    "#60a5fa",
    fontSize: 11,
  },
  ingredients: {
    color:        "#475569",
    fontSize:     12,
    marginBottom: 12,
    lineHeight:   18,
  },
  saveBtn: {
    backgroundColor: "rgba(233,69,96,0.1)",
    borderRadius:    8,
    padding:         10,
    alignItems:      "center",
    borderWidth:     1,
    borderColor:     "rgba(233,69,96,0.3)",
  },
  saveBtnSaved: {
    backgroundColor: "rgba(74,222,128,0.1)",
    borderColor:     "rgba(74,222,128,0.3)",
  },
  saveBtnText: {
    color:      "#e94560",
    fontWeight: "600",
    fontSize:   14,
  },
  saveBtnTextSaved: {
    color: "#4ade80",
  },
});