import React, { useState } from "react";
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import API from "../api";

const QUESTIONS = [
  { id:"cuisine", q:" What cuisine do you enjoy?",
    opts:[{v:"italian",e:"🍝",l:"Italian"},
          {v:"asian",e:"🍜",l:"Asian"},
          {v:"american",e:"🍔",l:"American"},
          {v:"indian",e:"🍛",l:"Indian"},
          {v:"mexican",e:"🌮",l:"Mexican"},
          {v:"any",e:"🌈",l:"Any/Mix"}] },
  { id:"mealType", q:" What meal do you want?",
    opts:[{v:"breakfast",e:"🌅",l:"Breakfast"},
          {v:"lunch",e:"☀️",l:"Lunch"},
          {v:"dinner",e:"🌙",l:"Dinner"},
          {v:"snack",e:"🍎",l:"Snack"},
          {v:"dessert",e:"🍰",l:"Dessert"}] },
  { id:"cookingTime", q:" Time you can cook?",
    opts:[{v:"quick",e:"⚡",l:"<15 mins"},
          {v:"medium",e:"🕐",l:"15-30 mins"},
          {v:"normal",e:"🕑",l:"30-60 mins"},
          {v:"long",e:"🕒",l:">1 hour"}] },
  { id:"diet", q:"Dietary preference?",
    opts:[{v:"none",e:"😊",l:"No restriction"},
          {v:"vegetarian",e:"🥦",l:"Vegetarian"},
          {v:"vegan",e:"🌱",l:"Vegan"},
          {v:"low_calorie",e:"💪",l:"Low Calorie"},
          {v:"high_protein",e:"🏋️",l:"High Protein"}] },
  { id:"spiceLevel", q:" How spicy?",
    opts:[{v:"mild",e:"😌",l:"Mild"},
          {v:"medium",e:"😋",l:"Medium"},
          {v:"spicy",e:"🌶️",l:"Spicy"},
          {v:"very_spicy",e:"🔥",l:"Very Spicy"}] },
  { id:"healthGoal", q:" Your health goal?",
    opts:[{v:"lose_weight",e:"⚖️",l:"Lose Weight"},
          {v:"build_muscle",e:"💪",l:"Build Muscle"},
          {v:"eat_healthy",e:"🥗",l:"Eat Healthy"},
          {v:"enjoy_food",e:"😍",l:"Enjoy Food"},
          {v:"no_goal",e:"🤷",l:"No Goal"}] },
  { id:"allergies", q:" Any allergies?",
    opts:[{v:"none",e:"✅",l:"None"},
          {v:"nuts",e:"🥜",l:"No Nuts"},
          {v:"dairy",e:"🥛",l:"No Dairy"},
          {v:"gluten",e:"🌾",l:"No Gluten"},
          {v:"seafood",e:"🦐",l:"No Seafood"}] },
  { id:"cookingSkill", q:" Cooking skill?",
    opts:[{v:"beginner",e:"🌱",l:"Beginner"},
          {v:"intermediate",e:"👍",l:"Intermediate"},
          {v:"advanced",e:"⭐",l:"Advanced"},
          {v:"chef",e:"👨‍🍳",l:"Chef"}] },
  { id:"servings", q:" Cooking for how many?",
    opts:[{v:"1",e:"🧑",l:"Just Me"},
          {v:"2",e:"👫",l:"2 People"},
          {v:"4",e:"👨‍👩‍👧‍👦",l:"Family"},
          {v:"many",e:"🎉",l:"Large Group"}] },
  { id:"favoriteIngredient",
    q:" Favourite ingredient?",
    opts:[{v:"chicken",e:"🍗",l:"Chicken"},
          {v:"beef",e:"🥩",l:"Beef"},
          {v:"fish",e:"🐟",l:"Fish"},
          {v:"vegetable",e:"🥦",l:"Vegetables"},
          {v:"pasta",e:"🍝",l:"Pasta"},
          {v:"egg",e:"🥚",l:"Eggs"}] },
];

export default function QuizScreen({ navigation }) {
  const [step,    setStep]    = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const current  = QUESTIONS[step];
  const progress = ((step) / QUESTIONS.length) * 100;

  const handlePick = async (value) => {
    const newAnswers = { ...answers,
                         [current.id]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        await API.post("/quiz/save",
          { answers: newAnswers });
        navigation.navigate("QuizResults");
      } catch {
        navigation.navigate("QuizResults");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return (
    <View style={styles.loadingPage}>
      <Text style={styles.loadingEmoji}>🍳</Text>
      <Text style={styles.loadingTitle}>
        Cooking up your recommendations...
      </Text>
      <Text style={styles.loadingSub}>
        Analyzing your preferences
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Progress bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBg}>
          <LinearGradient
            colors={["#e94560", "#a855f7"]}
            style={[styles.progressBar,
                    { width:`${progress}%` }]}
            start={{ x:0, y:0 }}
            end={{ x:1, y:0 }} />
        </View>
        <Text style={styles.progressLabel}>
          {step + 1} / {QUESTIONS.length}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <Text style={styles.question}>
          {current.q}
        </Text>

        <View style={styles.optionsGrid}>
          {current.opts.map(opt => (
            <TouchableOpacity
              key={opt.v}
              onPress={() => handlePick(opt.v)}
              style={[
                styles.optionBtn,
                answers[current.id] === opt.v &&
                  styles.optionBtnSelected
              ]}>
              <Text style={styles.optionEmoji}>
                {opt.e}
              </Text>
              <Text style={[
                styles.optionLabel,
                answers[current.id] === opt.v &&
                  { color:"#e94560" }
              ]}>
                {opt.l}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Back button */}
      {step > 0 && (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setStep(step - 1)}>
          <Text style={styles.backBtnText}>
            ← Back
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex:1, backgroundColor:"#0f0f1a" },
  progressSection: { padding:14, paddingBottom:6 },
  progressBg:      { backgroundColor:"#2a2a45",
                     borderRadius:8, height:5,
                     marginBottom:6,
                     overflow:"hidden" },
  progressBar:     { height:5, borderRadius:8 },
  progressLabel:   { color:"#64748b", fontSize:11,
                     textAlign:"right" },
  content:         { padding:18, paddingTop:6 },
  question:        { color:"white", fontSize:19,
                     fontWeight:"800", marginBottom:20,
                     lineHeight:27 },
  optionsGrid:     { flexDirection:"row", flexWrap:"wrap",
                     gap:10 },
  optionBtn:       { width:"47%", backgroundColor:"#1a1a2e",
                     borderWidth:1, borderColor:"#2a2a45",
                     borderRadius:12, padding:14,
                     alignItems:"center" },
  optionBtnSelected:{ borderColor:"#e94560",
                      backgroundColor:
                        "rgba(233,69,96,0.08)" },
  optionEmoji:     { fontSize:22, marginBottom:6 },
  optionLabel:     { color:"#94a3b8", fontSize:12,
                     fontWeight:"600",
                     textAlign:"center" },
  backBtn:         { margin:14, backgroundColor:"#1a1a2e",
                     borderRadius:10, padding:13,
                     alignItems:"center", borderWidth:1,
                     borderColor:"#2a2a45" },
  backBtnText:     { color:"#94a3b8", fontWeight:"600" },
  loadingPage:     { flex:1, backgroundColor:"#0f0f1a",
                     justifyContent:"center",
                     alignItems:"center", padding:30 },
  loadingEmoji:    { fontSize:48, marginBottom:14 },
  loadingTitle:    { color:"white", fontSize:17,
                     fontWeight:"700", marginBottom:8,
                     textAlign:"center" },
  loadingSub:      { color:"#64748b", fontSize:13 },
});