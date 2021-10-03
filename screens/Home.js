import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../components/Context'
import { SimpleLineIcons } from '@expo/vector-icons';

export default function Home({ navigation }) {

    const { signOut } = useContext(AuthContext)

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                // Background Linear Gradient
                colors={['#7F00FF', '#E100FF']}
                style={styles.background}
            />
            <TouchableOpacity style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                
            }} onPress={() => { signOut() }}>
                <SimpleLineIcons name="logout" size={30} color="white" style={{ padding: 10, marginRight: 10 }} />
            </TouchableOpacity>
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <TouchableOpacity style={{ ...styles.navButton, marginBottom: 50 }} onPress={() => navigation.navigate('Paiement')}>
                    <Text style={{ color: 'white', fontSize: 40 }}>PAIEMENT</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Scan')}>
                    <Text style={{ color: 'white', fontSize: 40, textAlign: 'center' }}>SCAN QR CODE</Text>
                </TouchableOpacity> */}
            </View>


            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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