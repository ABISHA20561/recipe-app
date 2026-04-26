import React from "react";
import {
  View, Text, TouchableOpacity,
  ScrollView, StyleSheet, StatusBar
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content"
        backgroundColor="#0f0f1a" />

      {/* Hero section */}
      <LinearGradient
        colors={["#1a1a2e", "#0f0f1a"]}
        style={styles.hero}>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
             AI-POWERED RECIPE RECOMMENDATION
          </Text>
        </View>

        <Text style={styles.heroTitle}>
          Discover Recipes{"\n"}
          <Text style={styles.heroAccent}>
            Made For You
          </Text>
        </Text>

        <Text style={styles.heroSubtitle}>
          Powered by P2D — a hypergraph neural network
          that understands your healthy & hedonic food
          preferences.
        </Text>

        {/* Action buttons */}
        <TouchableOpacity
          style={styles.primaryBtnWrapper}
          onPress={() => navigation.navigate(
            user?.modelUserId ? "ForYou" : "Quiz"
          )}>
          <LinearGradient
            colors={["#e94560", "#a855f7"]}
            style={styles.primaryBtn}
            start={{ x:0, y:0 }}
            end={{ x:1, y:0 }}>
            <Text style={styles.primaryBtnText}>
              {user?.modelUserId
                ? " Get AI Recommendations"
                : "Take the Quiz"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate("Search")}>
          <Text style={styles.secondaryBtnText}>
             Browse Recipes
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {[
          { val:"41K+", label:"Recipes"     },
          { val:"25K+", label:"Users"       },
          { val:"9K+",  label:"Ingredients" },
          { val:"3",    label:"AI Modes"    },
        ].map((s, i) => (
          <View key={i} style={styles.statItem}>
            <Text style={styles.statValue}>{s.val}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Features grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Why P2D Recipes?
        </Text>
        <View style={styles.featuresGrid}>
          {[
            { icon:"🧠", title:"AI-Powered",
              desc:"Hypergraph neural network" },
            { icon:"🥗", title:"Healthy Mode",
              desc:"Nutrition-based picks" },
            { icon:"🍟", title:"Hedonic Mode",
              desc:"Taste preferences" },
            { icon:"❔", title:"Quiz",
              desc:"10 questions → recipes" },
          ].map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* User info card */}
      {user && (
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarLetter}>
              {user.username?.[0]?.toUpperCase()}
            </Text>
          </View>
          <View style={{ flex:1 }}>
            <Text style={styles.userName}>
              {user.username}
            </Text>
            <Text style={styles.userSub}>
              {user.modelUserId
                ? `Dataset User #${user.modelUserId}`
                : "Quiz-based recommendations"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height:24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:       { flex:1, backgroundColor:"#0f0f1a" },
  hero:            { padding:24, paddingTop:36,
                     paddingBottom:28 },
  badge:           { backgroundColor:"rgba(233,69,96,0.1)",
                     borderWidth:1,
                     borderColor:"rgba(233,69,96,0.3)",
                     borderRadius:20, paddingHorizontal:12,
                     paddingVertical:5,
                     alignSelf:"flex-start",
                     marginBottom:14 },
  badgeText:       { color:"#e94560", fontSize:9,
                     fontWeight:"700", letterSpacing:1 },
  heroTitle:       { color:"white", fontSize:26,
                     fontWeight:"800", lineHeight:34,
                     marginBottom:10 },
  heroAccent:      { color:"#e94560" },
  heroSubtitle:    { color:"#94a3b8", fontSize:13,
                     lineHeight:20, marginBottom:24 },
  primaryBtnWrapper:{ borderRadius:12, overflow:"hidden",
                      marginBottom:10 },
  primaryBtn:      { padding:16, alignItems:"center" },
  primaryBtnText:  { color:"white", fontWeight:"700",
                     fontSize:15 },
  secondaryBtn:    { backgroundColor:"rgba(255,255,255,0.05)",
                     borderWidth:1, borderColor:"#2a2a45",
                     borderRadius:12, padding:14,
                     alignItems:"center" },
  secondaryBtnText:{ color:"white", fontWeight:"600",
                     fontSize:14 },
  statsRow:        { flexDirection:"row",
                     borderTopWidth:1,
                     borderBottomWidth:1,
                     borderColor:"#2a2a45",
                     paddingVertical:16,
                     paddingHorizontal:12 },
  statItem:        { flex:1, alignItems:"center" },
  statValue:       { color:"#e94560", fontSize:16,
                     fontWeight:"800", marginBottom:2 },
  statLabel:       { color:"#64748b", fontSize:10 },
  section:         { padding:20 },
  sectionTitle:    { color:"white", fontSize:18,
                     fontWeight:"800", marginBottom:14,
                     textAlign:"center" },
  featuresGrid:    { flexDirection:"row", flexWrap:"wrap",
                     gap:10 },
  featureCard:     { backgroundColor:"#1a1a2e",
                     borderWidth:1, borderColor:"#2a2a45",
                     borderRadius:10, padding:14,
                     width:"47%" },
  featureIcon:     { fontSize:22, marginBottom:6 },
  featureTitle:    { color:"white", fontWeight:"700",
                     fontSize:13, marginBottom:3 },
  featureDesc:     { color:"#64748b", fontSize:11,
                     lineHeight:16 },
  userCard:        { margin:16, backgroundColor:"#1a1a2e",
                     borderRadius:12, padding:14,
                     flexDirection:"row",
                     alignItems:"center", gap:10,
                     borderWidth:1, borderColor:"#2a2a45" },
  userAvatar:      { width:40, height:40, borderRadius:20,
                     backgroundColor:"#e94560",
                     justifyContent:"center",
                     alignItems:"center" },
  userAvatarLetter:{ color:"white", fontWeight:"800",
                     fontSize:16 },
  userName:        { color:"white", fontWeight:"700",
                     fontSize:14 },
  userSub:         { color:"#64748b", fontSize:11 },
  logoutBtn:       { backgroundColor:"rgba(233,69,96,0.1)",
                     borderWidth:1,
                     borderColor:"rgba(233,69,96,0.3)",
                     borderRadius:8, padding:7,
                     paddingHorizontal:12 },
  logoutText:      { color:"#e94560", fontWeight:"600",
                     fontSize:12 },
});