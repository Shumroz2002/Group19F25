import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/Dashboard';
import SummaryScreen from '../screens/SummaryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

function MyTabBar({ state, descriptors, navigation }) {
    const { colors } = useTheme();

    return (
        <View style={[styles.bottomNav, { backgroundColor: colors.tabBar, borderTopColor: colors.tabBarBorder }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                let icon = '❓';
                if (route.name === 'Home') icon = '🏠';
                else if (route.name === 'Summary') icon = '📊';
                else if (route.name === 'Settings') icon = '⚙️';

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.navItem}
                    >
                        {isFocused && <View style={[styles.activeIndicator, { backgroundColor: colors.activeTab, shadowColor: colors.activeTab }]} />}
                        <Text style={[styles.navIcon, !isFocused && { opacity: 0.5, color: colors.inactiveTab }]}>
                            {icon}
                        </Text>
                        <Text style={[
                            styles.navLabel,
                            { color: isFocused ? colors.activeTab : colors.inactiveTab }
                        ]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            tabBar={(props) => <MyTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="Home" component={DashboardScreen} />
            <Tab.Screen name="Summary" component={SummaryScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 16,
        paddingBottom: 30,
        borderTopWidth: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navItem: {
        alignItems: 'center',
        position: 'relative',
        paddingTop: 8,
        flex: 1,
    },
    activeIndicator: {
        position: 'absolute',
        top: 0,
        width: 40,
        height: 3,
        borderRadius: 2,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 5,
    },
    navIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    navLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
});
