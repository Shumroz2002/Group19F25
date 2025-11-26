import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Switch,
    Alert,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../firebaseConfig';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = ({ navigation }) => {
    const { isDarkMode, toggleTheme, colors } = useTheme();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Reset navigation stack to Login screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            Alert.alert("Logout Error", error.message);
        }
    };

    const handleChangePassword = async () => {
        if (!auth.currentUser?.email) return;

        Alert.alert(
            "Change Password",
            `Send a password reset email to ${auth.currentUser.email}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Send",
                    onPress: async () => {
                        try {
                            await sendPasswordResetEmail(auth, auth.currentUser.email);
                            Alert.alert("Email Sent", "Check your inbox to reset your password.");
                        } catch (error) {
                            Alert.alert("Error", error.message);
                        }
                    }
                }
            ]
        );
    };

    const SettingItem = ({ title, type, value, onValueChange, color }) => (
        <View style={styles.settingItem}>
            <Text style={[styles.settingText, { color }]}>{title}</Text>
            {type === 'switch' && (
                <Switch
                    trackColor={{ false: "#767577", true: "#5A5CFF" }}
                    thumbColor={value ? "#FFFFFF" : "#f4f3f4"}
                    onValueChange={onValueChange}
                    value={value}
                />
            )}
            {type === 'arrow' && (
                <Text style={styles.arrow}>›</Text>
            )}
        </View>
    );

    return (
        <LinearGradient
            colors={colors.background}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.section}>
                        <Text style={[styles.sectionHeader, { color: colors.subText }]}>PREFERENCES</Text>
                        <View style={[styles.card, { borderColor: colors.cardBorder, backgroundColor: isDarkMode ? 'transparent' : colors.cardBg[0] }]}>
                            <LinearGradient
                                colors={colors.cardBg}
                                style={styles.cardGradient}
                            >
                                <SettingItem
                                    title="Dark Mode"
                                    type="switch"
                                    value={isDarkMode}
                                    onValueChange={toggleTheme}
                                    color={colors.text}
                                />
                            </LinearGradient>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionHeader, { color: colors.subText }]}>ACCOUNT</Text>
                        <View style={[styles.card, { borderColor: colors.cardBorder, backgroundColor: isDarkMode ? 'transparent' : colors.cardBg[0] }]}>
                            <LinearGradient
                                colors={colors.cardBg}
                                style={styles.cardGradient}
                            >
                                <TouchableOpacity onPress={handleChangePassword}>
                                    <SettingItem
                                        title="Change Password"
                                        type="arrow"
                                        color={colors.text}
                                    />
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <LinearGradient
                            colors={['#FF5C5C', '#E63946']}
                            style={styles.logoutGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.logoutText}>Log Out</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    content: {
        padding: 24,
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 10,
        letterSpacing: 1,
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
    },
    cardGradient: {
        padding: 0,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    settingText: {
        fontSize: 16,
        fontWeight: '500',
    },
    arrow: {
        fontSize: 24,
        color: '#A0A0A0',
        fontWeight: '300',
    },
    logoutButton: {
        marginTop: 20,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#FF5C5C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    logoutGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SettingsScreen;
