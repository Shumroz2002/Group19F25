import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Animated,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";

const RegisterScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});

  // ✅ Password Requirements
  const passwordRequirements = [
    { text: "At least 8 characters", test: (p) => p.length >= 8 },
    { text: "At least 1 uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { text: "At least 1 lowercase letter", test: (p) => /[a-z]/.test(p) },
    { text: "At least 1 number", test: (p) => /[0-9]/.test(p) },
    { text: "At least 1 special character", test: (p) => /[!@#$%^&*(),.?\":{}|<>]/.test(p) },
  ];

  // ✅ Validation
  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
      if (formData.fullName.length < 2)
        newErrors.fullName = "Name must be at least 2 characters";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Enter a valid email";
    } else if (step === 2) {
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    } else if (step === 3) {
      if (!formData.agreeTerms)
        newErrors.agreeTerms = "You must agree to the terms and conditions";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep((p) => p + 1);
  };

  const handlePrevious = () => setCurrentStep((p) => p - 1);

  const handleSubmit = async () => {
    if (validateStep(3)) {
      try {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        Alert.alert("Account Created!", `Welcome, ${formData.fullName}!`);
        navigation.navigate("Login");
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    }
  };

  // ✅ Progress line width calculation
  const progressWidth = (currentStep / 3) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.header}>Create Account</Text>

          {/* Horizontal Progress Line */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View
                style={[styles.progressBar, { width: `${progressWidth}%` }]}
              />
            </View>
            <Text style={styles.stepText}>Step {currentStep} of 3</Text>
          </View>

          {/* =============== STEP 1 =============== */}
          {currentStep === 1 && (
            <>
              <Text style={styles.subtitle}>Basic Information</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={formData.fullName}
                onChangeText={(t) => setFormData({ ...formData, fullName: t })}
              />
              {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#999"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(t) => setFormData({ ...formData, email: t })}
              />
              {errors.email && <Text style={styles.error}>{errors.email}</Text>}

              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextText}>Next →</Text>
              </TouchableOpacity>
            </>
          )}

          {/* =============== STEP 2 =============== */}
          {currentStep === 2 && (
            <>
              <Text style={styles.subtitle}>Create Password</Text>

              {/* Password field */}
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Create Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(t) => setFormData({ ...formData, password: t })}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#666"
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.error}>{errors.password}</Text>}

              {/* Confirm password */}
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  value={formData.confirmPassword}
                  onChangeText={(t) =>
                    setFormData({ ...formData, confirmPassword: t })
                  }
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#666"
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.error}>{errors.confirmPassword}</Text>
              )}

              {/* Password Requirements */}
              <View style={styles.requirementsBox}>
                <Text style={styles.requirementsTitle}>Your password must contain:</Text>
                {passwordRequirements.map((req, i) => {
                  const met = req.test(formData.password);
                  return (
                    <Text key={i} style={{ color: met ? "#10b981" : "#6b7280" }}>
                      {met ? "✓" : "✗"} {req.text}
                    </Text>
                  );
                })}
              </View>

              <View style={styles.row}>
                <TouchableOpacity style={styles.backButton} onPress={handlePrevious}>
                  <Text style={styles.backText}>← Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                  <Text style={styles.nextText}>Next →</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* =============== STEP 3 =============== */}
          {currentStep === 3 && (
            <>
              <Text style={styles.subtitle}>Terms & Conditions</Text>
              <ScrollView style={styles.termsBox}>
                <Text style={styles.termsText}>
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                  {"\n\n"}
                  1. You are responsible for maintaining confidentiality of your account.
                  {"\n\n"}
                  2. Any misuse or violation may lead to account suspension.
                  {"\n\n"}
                  3. Please review our Privacy Policy to understand how we use your data.
                </Text>
              </ScrollView>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() =>
                  setFormData((p) => ({ ...p, agreeTerms: !p.agreeTerms }))
                }
              >
                <View
                  style={[
                    styles.checkbox,
                    formData.agreeTerms && styles.checkboxChecked,
                  ]}
                >
                  {formData.agreeTerms && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text style={styles.checkboxLabel}>
                  I agree to the Terms of Service and Privacy Policy
                </Text>
              </TouchableOpacity>
              {errors.agreeTerms && (
                <Text style={styles.error}>{errors.agreeTerms}</Text>
              )}

              <View style={styles.row}>
                <TouchableOpacity style={styles.backButton} onPress={handlePrevious}>
                  <Text style={styles.backText}>← Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
                  <Text style={styles.nextText}>Create Account ✓</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f8" },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#111827",
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  progressBackground: {
    height: 8,
    width: "100%",
    backgroundColor: "#e5e7eb",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#4f46e5",
    borderRadius: 5,
  },
  stepText: {
    marginTop: 6,
    fontWeight: "500",
    color: "#4f46e5",
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#111",
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  eyeIcon: { paddingHorizontal: 8 },
  requirementsBox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
  },
  requirementsTitle: { fontWeight: "600", marginBottom: 5 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#4f46e5",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  nextText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  backButton: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  backText: { color: "#111", fontWeight: "600" },
  termsBox: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    height: 140,
  },
  termsText: { color: "#444", fontSize: 13, lineHeight: 18 },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#4f46e5",
    borderRadius: 4,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: "#4f46e5" },
  checkmark: { color: "#fff", fontWeight: "bold" },
  checkboxLabel: { color: "#333", flexShrink: 1 },
  error: { color: "#ef4444", fontSize: 13, marginBottom: 5 },
});

export default RegisterScreen;
