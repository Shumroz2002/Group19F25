import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset link sent to your email!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#0d1b3a", "#1a3a6e"]}
      style={styles.container}
    >
      {/* Top Blue Circle */}
      <View style={styles.circleTopBlue} />
      
      {/* Bottom Brown Circle */}
      <View style={styles.circleBottomBrown} />

      {/* Main Card Container */}
      <View style={styles.cardContainer}>
        {/* Header with Icon and Title */}
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Ionicons name="lock-closed" size={32} color="#1a3a6e" />
          </View>
          <Text style={styles.title}>Forgot Password</Text>
        </View>

        {/* Blue Card Section */}
        <View style={styles.blueCard}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#7a8a9e"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Brown Card Section */}
        <View style={styles.brownCard}>
          {/* Send Reset Link Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleReset}>
            <Text style={styles.submitButtonText}>SEND RESET LINK</Text>
          </TouchableOpacity>

          {/* Footer Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circleTopBlue: {
    position: "absolute",
    top: -height * 0.15,
    right: -width * 0.2,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: "rgba(26, 58, 110, 0.5)",
  },
  circleBottomBrown: {
    position: "absolute",
    bottom: -height * 0.2,
    left: -width * 0.3,
    width: width * 1.3,
    height: width * 1.3,
    borderRadius: width * 0.65,
    backgroundColor: "rgba(101, 67, 57, 0.6)",
  },
  cardContainer: {
    width: width * 0.88,
    borderRadius: 25,
    overflow: "hidden",
  },
  header: {
    alignItems: "center",
    paddingTop: 35,
    paddingBottom: 25,
    backgroundColor: "rgba(30, 55, 95, 0.75)",
  },
  iconBox: {
    width: 65,
    height: 65,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
  },
  blueCard: {
    backgroundColor: "rgba(30, 55, 95, 0.75)",
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 30,
  },
  inputGroup: {
    marginBottom: 5,
  },
  label: {
    fontSize: 15,
    color: "#ffffff",
    marginBottom: 10,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "rgba(15, 30, 55, 0.7)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#d0d8e5",
    borderWidth: 0,
  },
  brownCard: {
    backgroundColor: "rgba(101, 67, 57, 0.65)",
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 35,
  },
  submitButton: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
    letterSpacing: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#c5c5c5",
    fontSize: 14,
  },
  linkText: {
    color: "#5eb3ff",
    fontSize: 14,
    fontWeight: "600",
  },
});