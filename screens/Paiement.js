import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Linking, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import axios from "axios";
import Item from '../components/Item.js'

export default function Paiement({ navigation }) {

    const [loadingReservation, setLoadingReservation] = useState(false)

    const renderItem = ({ item }) => {

        const date = new Date(item.created_at)

        return (
            <Item
                id={item.id}
                reservationCode={item.reservationCode}
                fullName={item.fullName}
                email={item.email}
                phoneNumber={item.phoneNumber}
                payment={item.payment}
                broughtBy={item.broughtBy}
                date={date}
            />
        )
    };

    const search = async () => {
        if (searchText.length == 0)
            alert('Vous devez insérer un code de réservation')
        else {
            setLoadingReservation(true)
            await axios.get(`https://thezitaclub.xyz/api/reservations/${searchText}`)
                .then(res => {
                    setReservations(res.data)
                    if (res.data.length == 0)
                        setNoDataMessage('Aucune réservation avec ce code, vérifier le une autre fois')
                    setLoadingReservation(false)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }

    const [searchText, setSearchText] = useState('')
    const [reservations, setReservations] = useState([])
    const [noDataMessage, setNoDataMessage] = useState('')

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

            <View style={{ flex: 1, alignItems: 'center' }}>
                <TextInput
                    style={{ ...styles.textInput, width: Dimensions.get('screen').width / 1.1, marginTop: 20 }}
                    placeholder='Taper le numéro de réservation'
                    placeholderTextColor='rgba(255,255,255,0.7)'
                    onChangeText={text => { setSearchText(text) }}
                />
                {
                    loadingReservation ? (
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                width: Dimensions.get('screen').width / 1.1,
                                height: 45,
                                backgroundColor: '#00a8ff',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 20,
                                borderRadius: 10
                            }}
                            disabled
                        >
                            <ActivityIndicator size='small' color='white' />
                        </TouchableOpacity>
                    )
                        : (
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    width: Dimensions.get('screen').width / 1.1,
                                    height: 45,
                                    backgroundColor: '#00a8ff',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 20,
                                    borderRadius: 10
                                }}
                                onPress={search}
                            >
                                <FontAwesome name="search" size={25} color="white" />
                                <Text style={{ color: 'white', fontSize: 30, marginLeft: 8 }}>Recherche</Text>
                            </TouchableOpacity>
                        )
                }
                <SafeAreaView style={{ marginTop: 50 }}>
                    {reservations.length == 0 ?
                        <Text style={{ fontSize: 25, textAlign: 'center', margin: 20, color: 'white' }}>{noDataMessage}</Text>
                        :
                        <FlatList
                            data={reservations}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        />
                    }
                </SafeAreaView>
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
    item: {
        backgroundColor: '#ecf0f1',
        padding: 20,
        width: Dimensions.get('screen').width / 1.1,
        marginVertical: 8,
        borderRadius: 7,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 30,
        marginTop: 10
    },
});