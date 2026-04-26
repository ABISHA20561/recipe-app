import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator }
  from "@react-navigation/stack";
import { createBottomTabNavigator }
  from "@react-navigation/bottom-tabs";
import { useAuth } from "../context/AuthContext";

import HomeScreen            from "../screens/HomeScreen";
import LoginScreen           from "../screens/LoginScreen";
import RegisterScreen        from "../screens/RegisterScreen";
import RecommendationsScreen
  from "../screens/RecommendationsScreen";
import SearchScreen          from "../screens/SearchScreen";
import SavedScreen           from "../screens/SavedScreen";
import QuizScreen            from "../screens/QuizScreen";
import QuizResultsScreen
  from "../screens/QuizResultsScreen";

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={{ alignItems:"center", paddingTop:4 }}>
      <Text style={{ fontSize:18 }}>{emoji}</Text>
      <Text style={{
        fontSize:9, marginTop:1,
        color: focused ? "#e94560" : "#64748b"
      }}>
        {label}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerStyle:      { backgroundColor:"#0f0f1a" },
      headerTintColor:  "white",
      headerTitleStyle: { fontWeight:"800" },
      tabBarStyle:      { backgroundColor:"#0f0f1a",
                          borderTopColor:"#2a2a45",
                          height:58, paddingBottom:6 },
      tabBarShowLabel:  false,
    }}>
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ title:"P2D Recipes",
          tabBarIcon:({ focused }) =>
            <TabIcon emoji="🏠" label="Home"
                     focused={focused} /> }} />
      <Tab.Screen name="Search" component={SearchScreen}
        options={{ title:"Search",
          tabBarIcon:({ focused }) =>
            <TabIcon emoji="🔍" label="Search"
                     focused={focused} /> }} />
      <Tab.Screen name="ForYou"
        component={RecommendationsScreen}
        options={{ title:"For You",
          tabBarIcon:({ focused }) =>
            <TabIcon emoji="✨" label="For You"
                     focused={focused} /> }} />
      <Tab.Screen name="Quiz" component={QuizScreen}
        options={{ title:"Quiz",
          tabBarIcon:({ focused }) =>
            <TabIcon emoji="🎯" label="Quiz"
                     focused={focused} /> }} />
      <Tab.Screen name="Saved" component={SavedScreen}
        options={{ title:"Saved",
          tabBarIcon:({ focused }) =>
            <TabIcon emoji="💾" label="Saved"
                     focused={focused} /> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { token, loading } = useAuth();

  if (loading) return (
    <View style={{ flex:1, backgroundColor:"#0f0f1a",
                   justifyContent:"center",
                   alignItems:"center" }}>
      <ActivityIndicator size="large" color="#e94560" />
    </View>
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown:false }}>
        {token ? (
          <>
            <Stack.Screen name="Main"
              component={MainTabs} />
            <Stack.Screen name="QuizResults"
              component={QuizResultsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login"
              component={LoginScreen} />
            <Stack.Screen name="Register"
              component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}