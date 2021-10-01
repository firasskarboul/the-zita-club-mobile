import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Button, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Scan({ navigation }) {

    const [hasPermission, setHasPermission] = useState(null)
    const [scanned, setScanned] = useState(false)
    const [loading, setLoading] = useState(false)
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

    const handleQrCodeScanned = async ({ type, data }) => {
        setScanned(true)
        setLoading(true)

        let token

        token = await AsyncStorage.multiGet(['userToken']);

        const config = {
            headers: { Authorization: `Bearer ${token[0][1]}` }
        };

        await axios
            .get(`https://thezitaclub.xyz/api/orders/${data}`, config)
            .then(async res => {
                if (res.data.length == 0) {
                    setText('-1')
                } else if (res.data[0].attendance == false) {
                    await axios
                        .put(`https://thezitaclub.xyz/api/orders/${res.data[0].id}`, {
                            'orderCode': res.data[0].orderCode,
                            'user_id': res.data[0].user_id,
                            'reservation_id': res.data[0].reservation_id,
                        }, config)
                        .then(async res => {
                            setText('1')
                        })
                        .catch(e => {
                            console.log(e)
                        })
                } else if (res.data[0].attendance == true)
                    setText('0')

            })
            .catch(e => {
                console.log(e)
            })
        setLoading(false)
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
                <TouchableOpacity
                    onPress={() => { navigation.goBack() }}
                    style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 14 }}
                >
                    <Ionicons name="ios-arrow-back-outline" size={40} color="white" />
                    <Text style={{ fontSize: 25, color: 'white' }}>Retour</Text>
                </TouchableOpacity>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
        <SafeAreaView style={styles.container} >
            <LinearGradient
                // Background Linear Gradient
                colors={['#7F00FF', '#E100FF']}
                style={styles.background}
            />
            <TouchableOpacity
                onPress={() => { navigation.goBack() }}
                style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 14 }}
            >
                <Ionicons name="ios-arrow-back-outline" size={40} color="white" />
                <Text style={{ fontSize: 25, color: 'white' }}>Retour</Text>
            </TouchableOpacity>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.qrcodebox}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleQrCodeScanned}
                        style={{ height: 400, width: 400 }}
                    />
                </View>

                {
                    loading ?
                        <View style={{ marginTop: 30, marginBottom: 30 }}>
                            <ActivityIndicator size='large' color='white' />
                        </View>
                        :
                        <View style={text == '0' ?
                            {
                                borderRadius: 5,
                                backgroundColor: '#e74c3c',
                                color: '#ecf0f1',
                                marginTop: 30,
                                paddingLeft: 20,
                                paddingRight: 20,
                                alignSelf: 'center'
                            }
                            : text == '1' ?
                                {
                                    borderRadius: 5,
                                    backgroundColor: '#2ecc71',
                                    color: '#ecf0f1',
                                    marginTop: 30,
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    alignSelf: 'center'
                                }
                                : text == '-1' ?
                                    {
                                        borderRadius: 5,
                                        backgroundColor: '#c23616',
                                        color: '#ecf0f1',
                                        marginTop: 30,
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                        alignSelf: 'center'
                                    }
                                    : null
                        }>
                            <Text style={styles.mainText}>
                                {text == '0' ?
                                    'QR CODE EST UTILISÉ' :
                                    text == '1' ?
                                        'QR CODE EST VALIDE' : text == '-1' ?
                                            'QR CODE INVALIDE'
                                            : null}
                            </Text>

                        </View>
                }
                {
                    loading ?
                        null :
                        scanned &&
                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                marginTop: 30,
                                backgroundColor: '#273c75',
                                padding: 15,
                                borderRadius: 30
                            }}
                            onPress={() => {
                                setScanned(false)
                                setText('')
                            }}
                        >
                            <AntDesign name="scan1" size={25} color="white" />
                            <Text style={{ color: 'white', fontSize: 29, marginLeft: 8 }}>SCAN</Text>
                        </TouchableOpacity>
                }
                {/* <Button title='Scan Again' onPress={() => setScanned(false)} color='white' /> */}
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
        fontSize: 30,
        margin: 20,
        color: '#ecf0f1',
    }
});