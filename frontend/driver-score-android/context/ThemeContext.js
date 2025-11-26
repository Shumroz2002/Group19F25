import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebaseConfig';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        profilePicture: null,
        initials: 'JD'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load Theme
            const storedTheme = await AsyncStorage.getItem('darkMode');
            if (storedTheme !== null) {
                setIsDarkMode(JSON.parse(storedTheme));
            }

            // Load User Data
            const storedUser = await AsyncStorage.getItem('userData');
            if (storedUser !== null) {
                setUserData(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error("Failed to load data", e);
        }
    };

    const toggleTheme = async (value) => {
        setIsDarkMode(value);
        try {
            await AsyncStorage.setItem('darkMode', JSON.stringify(value));
        } catch (e) {
            console.error("Failed to save theme", e);
        }
    };



    // ... (keep existing code)

    const updateUserData = async (data) => {
        // Calculate initials
        let initials = 'JD';
        if (data.firstName && data.lastName) {
            initials = `${data.firstName[0]}${data.lastName[0]}`.toUpperCase();
        }

        const newData = { ...userData, ...data, initials };
        setUserData(newData);
        try {
            await AsyncStorage.setItem('userData', JSON.stringify(newData));
        } catch (e) {
            console.error("Failed to save user data", e);
        }
    };

    const saveUserProfile = async (formData, localImageUri) => {
        // 1. Optimistic Update
        const optimisticData = {
            ...userData,
            ...formData,
            profilePicture: localImageUri, // Use local URI immediately
        };
        updateUserData(optimisticData); // This updates state and AsyncStorage

        // 2. Background Sync
        // We don't await this in the UI, but we run it here
        try {
            if (!auth.currentUser) return;

            let profilePictureUrl = localImageUri;

            // Upload if it's a local file
            if (localImageUri && (localImageUri.startsWith('file://') || localImageUri.startsWith('content://'))) {
                const response = await fetch(localImageUri);
                const blob = await response.blob();
                const filename = `profile_pictures/${auth.currentUser.uid}`;
                const storageRef = ref(storage, filename);
                await uploadBytes(storageRef, blob);
                profilePictureUrl = await getDownloadURL(storageRef);
            }

            // Update Firestore
            const userRef = doc(db, "users", auth.currentUser.uid);
            const finalData = {
                ...formData,
                profilePicture: profilePictureUrl,
                updatedAt: new Date(),
            };
            await setDoc(userRef, finalData, { merge: true });

            // 3. Final Update (with remote URL)
            // Only update if the URL changed (i.e., we uploaded a new one)
            if (profilePictureUrl !== localImageUri) {
                updateUserData({ ...optimisticData, profilePicture: profilePictureUrl });
            }
        } catch (error) {
            console.error("Background save failed:", error);
            // In a real app, we might want to show a toast or revert state
        }
    };

    const theme = React.useMemo(() => ({
        isDarkMode,
        toggleTheme,
        userData,
        updateUserData,
        saveUserProfile,
        colors: isDarkMode ? {
            background: ['#0B0C1E', '#181A3A'],
            text: '#FFFFFF',
            cardBg: ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)'],
            cardBorder: 'rgba(255, 255, 255, 0.05)',
            subText: '#A0A0A0',
            tabBar: 'rgba(11, 12, 30, 0.98)',
            tabBarBorder: 'rgba(255, 255, 255, 0.1)',
            activeTab: '#5A5CFF',
            inactiveTab: '#A0A0A0',
        } : {
            background: ['#F0F2F5', '#FFFFFF'],
            text: '#000000',
            cardBg: ['#FFFFFF', '#F8F9FA'],
            cardBorder: '#E0E0E0',
            subText: '#666666',
            tabBar: '#FFFFFF',
            tabBarBorder: '#E0E0E0',
            activeTab: '#5A5CFF',
            inactiveTab: '#999999',
        }
    }), [isDarkMode, userData]);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
