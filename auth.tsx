import { createContext, useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Auth } from "aws-amplify";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export function useAuth() {
  const {
    data: user,
    error: queryError,
    isLoading,
  } = useQuery("user", fetchUser);
  //const queryClient = useQueryClient(); // Get the existing query client instance

  const refreshToken = async () => {
    try {
      // Refresh the user's tokens
      await Auth.refreshSession();
      //queryClient.invalidateQueries('user'); // Invalidate the 'user' query after refreshing tokens
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  };

  return useContext(AuthContext);
}

async function fetchUser() {
  try {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

async function login(credentials) {
  try {
    const user = await Auth.signIn(credentials.username, credentials.password);

    // Save user to AsyncStorage
    await AsyncStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

async function logout() {
  try {
    await Auth.signOut();

    // Remove user from AsyncStorage
    await AsyncStorage.removeItem("user");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const { data: user, error, isLoading } = useQuery("user", fetchUser);

  const loginMutation = useMutation(login, {
    onSuccess: (user) => {
      queryClient.setQueryData("user", user);
    },
  });

  const logoutMutation = useMutation(logout, {
    onSuccess: () => {
      queryClient.setQueryData("user", null);
    },
  });

  useEffect(() => {
    if (user) {
      queryClient.setQueryData("user", user);
    }
  }, [queryClient, user]);

  const isUserLoggedIn = user === undefined ? undefined : !!user;

  const value = {
    user,
    error,
    isLoading,
    isUserLoggedIn,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
