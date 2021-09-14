import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Linking, ActivityIndicator } from 'react-native';
import { Foundation, MaterialIcons } from '@expo/vector-icons';
import axios from "axios";

export default function Item({ id, reservationCode, fullName, email, phoneNumber, payment, broughtBy, date }) {

    const [loadingPaiement, setLoadingPaiement] = useState(false)
    const [paiement, setPaiement] = useState(payment)

    return (
        <View style={styles.item}>
            <Text>Code de réservation: {reservationCode}</Text>
            <Text style={styles.title}>{fullName}</Text>

            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 4 }}
                onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
            >
                <Foundation name="telephone" size={25} color="green" />
                <Text style={{ fontSize: 19, marginLeft: 10, textDecorationLine: 'underline' }}>{phoneNumber}</Text>
            </TouchableOpacity>

            <View
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
            >
                <MaterialIcons name="email" size={25} color="green" />
                <Text style={{ fontSize: 19, marginLeft: 10 }}>{email}</Text>
            </View>

            {
                !paiement ?
                    (
                        loadingPaiement ? (
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 40,
                                }}
                            >
                                <ActivityIndicator size='large' color='#2ecc71' />
                            </View>
                        ) :
                            (
                                <TouchableOpacity
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: 40,
                                        backgroundColor: '#2ecc71',
                                        height: 50,
                                        borderRadius: 10,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 6,
                                        },
                                        shadowOpacity: 0.37,
                                        shadowRadius: 7.49,

                                        elevation: 12,
                                    }}
                                    onPress={async () => {
                                        setLoadingPaiement(true)
                                        await axios.put(`http://thezitaclub.xyz/api/reservations/${id}`, {
                                            'fullName': fullName,
                                            'email': email,
                                            'phoneNumber': phoneNumber,
                                            'broughtBy': broughtBy,
                                            'payment': 1,
                                        })
                                            .then(async res => {

                                                await axios.post(`http://thezitaclub.xyz/api/orders`, {
                                                    'orderCode': 'ASKJHSJHKJHSKJ',
                                                    'user_id': 1,
                                                    'reservation_id': 1,
                                                    'attendance': false
                                                })
                                                    .then(res => {
                                                        setPaiement(!payment)
                                                        setLoadingPaiement(false)
                                                    })
                                                    .catch(e => {
                                                        console.log(e)
                                                    })
                                            })
                                            .catch(e => {
                                                console.log(e)
                                            })
                                    }}
                                >
                                    <MaterialIcons name="payment" size={25} color="#ecf0f1" />
                                    <Text style={{ fontSize: 30, color: '#ecf0f1', marginLeft: 8 }}>Payer</Text>
                                </TouchableOpacity>
                            )
                    )
                    :
                    (
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 40,
                                backgroundColor: '#7f8c8d',
                                height: 50,
                                borderRadius: 10
                            }}
                            disabled
                        >
                            <MaterialIcons name="payment" size={25} color="#ecf0f1" />
                            <Text style={{ fontSize: 30, color: '#ecf0f1', marginLeft: 8 }}>Payé</Text>
                        </TouchableOpacity>
                    )
            }

            <View style={{ marginTop: 40, alignItems: 'flex-end' }}>
                <Text>Date de réservation: {date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}
                    -
                    {
                        date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
                    }
                    -
                    {date.getFullYear()}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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