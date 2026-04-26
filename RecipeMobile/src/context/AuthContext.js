import React, { createContext, useContext,
                useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAuth(); }, []);

  const loadAuth = async () => {
    try {
      const t = await AsyncStorage.getItem("token");
      const u = await AsyncStorage.getItem("user");
      if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    } finally {
      setLoading(false);
    }
  };

  const login = async (token, user) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    setToken(token); setUser(user);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    setToken(null); setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);