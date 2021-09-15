import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, KeyboardAvoidingView, TouchableWithoutFeedback, TextInput, View, Button, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../components/Context'
import axios from 'axios';

export default function Login() {

    const [data, setData] = useState({
        email: '',
        password: ''
    })

    const { signIn } = useContext(AuthContext)

    const [loading, setLoading] = useState(false)

    const validate = async (userName, password) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        let foundUser;
        if (reg.test(userName) === false) {
            alert("Veuillez saisir un email valide");
        }
        else {
            setLoading(true)
            await axios
                .post(`http://thezitaclub.xyz/api/login`, {
                    "email": userName,
                    "password": password
                })
                .then(res => {
                    signIn(res.data)
                    setLoading(false)
                })
                .catch(e => {
                    alert('L\'email ou le mot de passe est incorrect.')
                    setLoading(false)
                })
        }
    }

    return (
        <View style={styles.container} >
            <LinearGradient
                // Background Linear Gradient
                colors={['#7F00FF', '#E100FF']}
                style={styles.background}
            />
            <View>
                <Image
                    source={require('../assets/tomorrowland-logo.png')}
                    style={{ width: 200, height: 230, tintColor: 'white', marginBottom: 80 }}
                />
            </View>
            <View>
                <TextInput
                    placeholder='E-mail'
                    placeholderTextColor='rgba(255,255,255,0.7)'
                    style={{ ...styles.textInput, marginBottom: 30 }}
                    onChangeText={email => { setData({ ...data, email: email }) }}
                />
                <TextInput
                    placeholder='Mot de passe'
                    placeholderTextColor='rgba(255,255,255,0.7)'
                    style={styles.textInput}
                    secureTextEntry
                    onChangeText={password => { setData({ ...data, password: password }) }}
                />
                <View style={{ marginTop: 30 }}>
                    {
                        loading ?
                            <ActivityIndicator size="small" color="white" />
                            :
                            <Button
                                onPress={() => {
                                    if (data.email === '' && data.password === '')
                                        alert('Veuillez saisir votre email et mot de passe')
                                    else if (data.password === '')
                                        alert('Veuillez saisir votre mot de passe')
                                    else if (data.email === '')
                                        alert('Veuillez saisir votre email')
                                    else
                                        validate(data.email, data.password)
                                }}
                                title='Se connecter'
                                color='white'
                            />
                    }
                </View>
            </View>
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
    }
});