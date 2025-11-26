import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useTheme } from '../context/ThemeContext';

const ProfileScreen = ({ navigation }) => {
    const { colors, isDarkMode, updateUserData, userData, saveUserProfile } = useTheme();

    // Initialize loading based on whether we have cached data
    const [loading, setLoading] = useState(!userData?.firstName);
    const [saving, setSaving] = useState(false);
    const [image, setImage] = useState(userData?.profilePicture || null);

    const [formData, setFormData] = useState({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        dateOfBirth: userData?.dateOfBirth || '',
        address: userData?.address || '',
        insuranceNumber: userData?.insuranceNumber || '',
        insuranceCompany: userData?.insuranceCompany || '',
        licenseNumber: userData?.licenseNumber || '',
        contactNumber: userData?.contactNumber || '',
    });

    useEffect(() => {
        console.log("ProfileScreen mounted, checking cache...");
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const docRef = doc(db, "users", user.uid);
            // Handle offline/unavailable errors gracefully
            const docSnap = await getDoc(docRef).catch(err => {
                console.log("Error fetching doc (possibly offline):", err);
                return null;
            });

            if (docSnap && docSnap.exists()) {
                const data = docSnap.data();
                setFormData(prev => ({
                    ...prev,
                    firstName: data.firstName || prev.firstName,
                    lastName: data.lastName || prev.lastName,
                    dateOfBirth: data.dateOfBirth || prev.dateOfBirth,
                    address: data.address || prev.address,
                    insuranceNumber: data.insuranceNumber || prev.insuranceNumber,
                    insuranceCompany: data.insuranceCompany || prev.insuranceCompany,
                    licenseNumber: data.licenseNumber || prev.licenseNumber,
                    contactNumber: data.contactNumber || prev.contactNumber,
                }));
                if (data.profilePicture) {
                    setImage(data.profilePicture);
                }

                // Update context with fresh data
                updateUserData(data);
            } else if (!userData?.firstName) {
                // Pre-fill display name if available and no cached data
                const names = user.displayName ? user.displayName.split(' ') : [];
                if (names.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        firstName: names[0],
                        lastName: names.slice(1).join(' ')
                    }));
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            try {
                const manipResult = await manipulateAsync(
                    result.assets[0].uri,
                    [{ resize: { width: 500 } }],
                    { compress: 0.7, format: SaveFormat.JPEG }
                );
                setImage(manipResult.uri);
            } catch (error) {
                console.error("Error resizing image:", error);
                setImage(result.assets[0].uri);
            }
        }
    };

    const handleSave = async () => {
        if (!formData.firstName || !formData.lastName) {
            Alert.alert("Error", "First Name and Last Name are required.");
            return;
        }

        // Optimistic Save:
        // 1. Trigger background save in context
        saveUserProfile(formData, image);

        // 2. Immediate feedback
        Alert.alert("Success", "Profile updated successfully.");
        navigation.goBack();
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background[0] }]}>
                <ActivityIndicator size="large" color="#5A5CFF" />
            </View>
        );
    }

    return (
        <LinearGradient
            colors={colors.background}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={[styles.backButtonText, { color: colors.text }]}>←</Text>
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.profileImage} />
                            ) : (
                                <View style={[styles.placeholderImage, { backgroundColor: colors.cardBg[0], borderColor: colors.cardBorder }]}>
                                    <Text style={[styles.placeholderText, { color: colors.subText }]}>Add Photo</Text>
                                </View>
                            )}
                            <View style={styles.editIconContainer}>
                                <Text style={styles.editIcon}>📷</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionHeader, { color: colors.subText }]}>PERSONAL DETAILS</Text>
                        <InputField label="First Name" value={formData.firstName} onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))} placeholder="John" colors={colors} isDarkMode={isDarkMode} />
                        <InputField label="Last Name" value={formData.lastName} onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))} placeholder="Doe" colors={colors} isDarkMode={isDarkMode} />
                        <InputField label="Date of Birth" value={formData.dateOfBirth} onChangeText={(text) => setFormData(prev => ({ ...prev, dateOfBirth: text }))} placeholder="YYYY-MM-DD" colors={colors} isDarkMode={isDarkMode} />
                        <InputField label="Contact Number" value={formData.contactNumber} onChangeText={(text) => setFormData(prev => ({ ...prev, contactNumber: text }))} placeholder="+1 234 567 8900" keyboardType="phone-pad" colors={colors} isDarkMode={isDarkMode} />
                        <InputField label="Address" value={formData.address} onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))} placeholder="123 Main St, City, Country" colors={colors} isDarkMode={isDarkMode} />
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionHeader, { color: colors.subText }]}>DRIVER INFO</Text>
                        <InputField label="License Number" value={formData.licenseNumber} onChangeText={(text) => setFormData(prev => ({ ...prev, licenseNumber: text }))} placeholder="DL-12345678" colors={colors} isDarkMode={isDarkMode} />
                        <InputField label="Insurance Company" value={formData.insuranceCompany} onChangeText={(text) => setFormData(prev => ({ ...prev, insuranceCompany: text }))} placeholder="SafeDrive Inc." colors={colors} isDarkMode={isDarkMode} />
                        <InputField label="Insurance Policy Number" value={formData.insuranceNumber} onChangeText={(text) => setFormData(prev => ({ ...prev, insuranceNumber: text }))} placeholder="POL-987654321" colors={colors} isDarkMode={isDarkMode} />
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, saving && { opacity: 0.7 }]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        <LinearGradient
                            colors={['#5A5CFF', '#7B7DFF']}
                            style={styles.saveButtonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            {saving ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <ActivityIndicator color="#FFF" style={{ marginRight: 8 }} />
                                    <Text style={styles.saveButtonText}>{savingStatus}</Text>
                                </View>
                            ) : (
                                <Text style={styles.saveButtonText}>Save Profile</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        fontSize: 24,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    imageWrapper: {
        position: 'relative',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 1,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 14,
        fontWeight: '500',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#5A5CFF',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#181A3A',
    },
    editIcon: {
        fontSize: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 16,
        letterSpacing: 1,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    saveButton: {
        marginTop: 16,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#5A5CFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

const InputField = ({ label, value, onChangeText, placeholder, keyboardType = 'default', colors, isDarkMode }) => (
    <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.subText }]}>{label}</Text>
        <TextInput
            style={[styles.input, {
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#F5F5F5',
                color: colors.text,
                borderColor: colors.cardBorder
            }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#999"
            keyboardType={keyboardType}
        />
    </View>
);

export default ProfileScreen;
