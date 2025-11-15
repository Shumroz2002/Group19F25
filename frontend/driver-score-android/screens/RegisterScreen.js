import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

  // Password Requirements
  const passwordRequirements = [
    { text: "At least 8 characters", test: (p) => p.length >= 8 },
    { text: "At least 1 uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { text: "At least 1 lowercase letter", test: (p) => /[a-z]/.test(p) },
    { text: "At least 1 number", test: (p) => /[0-9]/.test(p) },
    {
      text: "At least 1 special character",
      test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
    },
  ];

  // Validation
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
      const allRequirementsMet = passwordRequirements.every((req) =>
        req.test(formData.password)
      );
      if (!allRequirementsMet)
        newErrors.password = "Password does not meet all requirements";
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
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        Alert.alert("Account Created!", `Welcome, ${formData.fullName}!`);
        navigation.navigate("Login");
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background circles - EXACT colors from LoginScreen */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Card - EXACT style from LoginScreen */}
          <View style={styles.card}>
            {/* Icon container - EXACT from LoginScreen */}
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={32} color="#3d5a80" />
            </View>
            
            <Text style={styles.title}>Register</Text>

            {/* Progress indicator */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Step {currentStep}/3</Text>
            </View>

            {/* =============== STEP 1 =============== */}
            {currentStep === 1 && (
              <>
                <Text style={styles.label}>Full Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#7a8fa8"
                  value={formData.fullName}
                  onChangeText={(t) =>
                    setFormData({ ...formData, fullName: t })
                  }
                />
                {errors.fullName && (
                  <Text style={styles.error}>{errors.fullName}</Text>
                )}

                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#7a8fa8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(t) => setFormData({ ...formData, email: t })}
                />
                {errors.email && <Text style={styles.error}>{errors.email}</Text>}

                <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
                  <Text style={styles.submitButtonText}>NEXT</Text>
                </TouchableOpacity>
              </>
            )}

            {/* =============== STEP 2 =============== */}
            {currentStep === 2 && (
              <>
                <Text style={styles.label}>Password:</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    placeholderTextColor="#7a8fa8"
                    secureTextEntry={!showPassword}
                    value={formData.password}
                    onChangeText={(t) =>
                      setFormData({ ...formData, password: t })
                    }
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#a0b4cc"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}

                <Text style={styles.label}>Confirm Password:</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    placeholderTextColor="#7a8fa8"
                    secureTextEntry={!showConfirmPassword}
                    value={formData.confirmPassword}
                    onChangeText={(t) =>
                      setFormData({ ...formData, confirmPassword: t })
                    }
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color="#a0b4cc"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text style={styles.error}>{errors.confirmPassword}</Text>
                )}

                {/* Password Requirements */}
                <View style={styles.requirementsBox}>
                  <Text style={styles.requirementsTitle}>
                    Password must contain:
                  </Text>
                  {passwordRequirements.map((req, i) => {
                    const met = req.test(formData.password);
                    return (
                      <Text
                        key={i}
                        style={[
                          styles.requirementText,
                          { color: met ? "#4ade80" : "#a0b4cc" },
                        ]}
                      >
                        {met ? "○" : "○"} {req.text}
                      </Text>
                    );
                  })}
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handlePrevious}
                  >
                    <Text style={styles.secondaryButtonText}>PREVIOUS</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleNext}
                  >
                    <Text style={styles.submitButtonText}>NEXT</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* =============== STEP 3 =============== */}
            {currentStep === 3 && (
              <>
                <Text style={styles.termsTitle}>
                  Terms of Service and Privacy Policy.
                </Text>
                
                <View style={styles.termsBox}>
                  <Text style={styles.termsText}>
                    1. You are responsible for maintaining confidentiality of your account.
                    {"\n"}
                    2. Any misuse or violation may lead to account suspension.
                    {"\n"}
                    3. Please review our Privacy Policy to understand how we use your data.
                  </Text>
                </View>

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
                      <Ionicons name="checkmark" size={16} color="#3d5a80" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    I agree to the Terms and Privacy Policy
                  </Text>
                </TouchableOpacity>
                {errors.agreeTerms && (
                  <Text style={styles.error}>{errors.agreeTerms}</Text>
                )}

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handlePrevious}
                  >
                    <Text style={styles.secondaryButtonText}>PREVIOUS</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.submitButtonText}>CREATE ACCOUNT</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Divider line - EXACT from LoginScreen */}
            <View style={styles.dividerLine} />

            {/* Login link */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e3a5f",
  },
  circle1: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(79, 109, 155, 0.3)",
    top: -100,
    left: -50,
  },
  circle2: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "rgba(139, 92, 71, 0.4)",
    bottom: -100,
    right: -80,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 30,
  },
  card: {
    backgroundColor: "rgba(60, 75, 100, 0.75)",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 15,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(100, 120, 150, 0.5)",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "center",
  },
  progressText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "500",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    width: "100%",
    padding: 16,
    borderWidth: 0,
    borderRadius: 12,
    backgroundColor: "rgba(35, 50, 75, 0.7)",
    fontSize: 15,
    color: "#b0c4d8",
    marginBottom: 8,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(35, 50, 75, 0.7)",
    borderRadius: 12,
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 15,
    color: "#b0c4d8",
  },
  eyeButton: {
    paddingHorizontal: 14,
  },
  requirementsBox: {
    backgroundColor: "rgba(35, 50, 75, 0.6)",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  requirementsTitle: {
    fontWeight: "600",
    marginBottom: 10,
    color: "#ffffff",
    fontSize: 14,
  },
  requirementText: {
    fontSize: 13,
    marginBottom: 5,
  },
  termsTitle: {
    fontSize: 15,
    color: "#d0dae8",
    marginBottom: 12,
    lineHeight: 22,
  },
  termsBox: {
    backgroundColor: "rgba(35, 50, 75, 0.5)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  termsText: {
    color: "#b8c5d6",
    fontSize: 13,
    lineHeight: 22,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 6,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "#ffffff",
  },
  checkboxLabel: {
    color: "#ffffff",
    fontSize: 14,
    flexShrink: 1,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  submitButtonText: {
    color: "#1e3a5f",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: "rgba(45, 65, 95, 0.8)",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "rgba(160, 180, 204, 0.3)",
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dividerLine: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(160, 180, 204, 0.3)",
    marginVertical: 20,
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#b8c5d6",
    fontSize: 14,
  },
  loginLink: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  error: {
    color: "#fca5a5",
    fontSize: 12,
    marginBottom: 8,
    marginTop: 2,
  },
});

export default RegisterScreen;