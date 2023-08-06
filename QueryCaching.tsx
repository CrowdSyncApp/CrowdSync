import { createContext, useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Auth, graphqlOperation } from "aws-amplify";
import { getUserProfile } from "../src/graphql/mutations";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export function useAuth() {
  const {
    data: user,
    error: queryError,
    isLoading,
  } = useQuery("user", fetchUser);

  const { fetchUserProfile, refreshToken } = useContext(AuthContext);

  return useContext(AuthContext);
}

async function fetchUserProfile(userId) {
  try {
    const { data } = await API.graphql(
      graphqlOperation(getUserProfile, { userId })
    );

    if (data && data.getUserProfile) {
      return data.getUserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
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

  const fetchUserProfileData = async () => {
    if (user && user.userId) {
      const userProfileData = await fetchUserProfile(user.userId);
      return userProfileData;
    }
    return null;
  };

  const refreshToken = async () => {
    try {
      // Refresh the user's tokens
      await Auth.refreshSession();
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  };

  const value = {
    user,
    error,
    isLoading,
    isUserLoggedIn,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    fetchUserProfile: fetchUserProfileData,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
