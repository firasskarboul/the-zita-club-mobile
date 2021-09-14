import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../components/Context'

export default function Home() {

    const { signOut } = useContext(AuthContext)

    return (
        <View style={styles.container} >
            <LinearGradient
                // Background Linear Gradient
                colors={['#7F00FF', '#E100FF']}
                style={styles.background}
            />
            <TouchableOpacity style={{ ...styles.navButton, marginBottom: 50 }}>
                <Text style={{ color: 'white', fontSize: 40 }}>PAIEMENT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton}>
                <Text style={{ color: 'white', fontSize: 40, textAlign: 'center' }}>SCAN QR CODE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 50 }} onPress={() => { signOut() }}>
                <Text style={{ fontSize: 25, color: 'white', fontWeight: 'bold' }}>SIGN OUT</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: Dimensions.get('screen').height,
    },
    navButton: {
        backgroundColor: '#74b9ff',
        width: 230,
        height: 230,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,

        elevation: 12,
    }
});