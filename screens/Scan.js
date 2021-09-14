import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function Login() {

    const [hasPermission, setHasPermission] = useState(null)
    const [scanned, setScanned] = useState(false)
    const [text, setText] = useState('Not yet scanned')

    const askForCameraPermission = () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status == 'granted')
        })();
    }

    // Request Camera Permission

    useEffect(() => {
        askForCameraPermission()
    }, []);

    // What happends when we scan the QR Code

    const handleQrCodeScanned = ({ type, data }) => {
        setScanned(true)
        setText(data)
    }

    // Check permissions and return the screens

    if (hasPermission === null) {
        return (
            <View style={styles.container} >
                <LinearGradient
                    // Background Linear Gradient
                    colors={['#7F00FF', '#E100FF']}
                    style={styles.background}
                />
                <Text>Requesting for camera permissions...</Text>
                <StatusBar style="auto" />
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container} >
                <LinearGradient
                    // Background Linear Gradient
                    colors={['#7F00FF', '#E100FF']}
                    style={styles.background}
                />
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 28, color: '#ecf0f1', marginBottom: 40 }}>No access to camera...</Text>
                    {/* <TouchableOpacity
                        onPress={() => askForCameraPermission()}
                        style={{
                            width: 300,
                            height: 50,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#ecf0f1',
                        }}
                    >
                        <Text style={{ fontSize: 20 }}>Allow Camera</Text>
                    </TouchableOpacity> */}
                </View>

                <StatusBar style="auto" />
            </View>
        );
    }

    return (
        <View style={styles.container} >
            <LinearGradient
                // Background Linear Gradient
                colors={['#7F00FF', '#E100FF']}
                style={styles.background}
            />
            <View style={styles.qrcodebox}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleQrCodeScanned}
                    style={{ height: 400, width: 400 }}
                />
            </View>
            <Text style={styles.mainText}>{text}</Text>
            {scanned && <Button title='Scan Again?' onPress={() => setScanned(false)} color='tomato' />}
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
    textInput: {
        borderWidth: 3,
        borderColor: 'white',
        color: 'white',
        borderRadius: 3,
        width: Dimensions.get('screen').width / 1.3,
        height: 40,
        paddingLeft: 10
    },
    qrcodebox: {
        backgroundColor: '#ecf0f1',
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        width: 300,
        overflow: 'hidden',
        borderRadius: 30
    },
    mainText: {
        fontSize: 16,
        margin: 20
    }
});