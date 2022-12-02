import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import { Feather } from '@expo/vector-icons'

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { StackParamList } from "../../routes/app.routes"

import { api } from '../../services/api'

type RouteDetailParams = {
    FinishOrder: {
        table: string | number;
        orderId: string;
        totalPrice: string | number;
    }
}


type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>


export default function FinishOrder() {
    const route = useRoute<FinishOrderRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    async function handleFinish() {
        try {
            await api.put("/order/send", {
                orderId: route.params?.orderId
            })

            navigation.popToTop();
        } catch (error) {
            alert("Ocorreu um erro, tente mais tarde.")
            console.log(error);
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.alert}>Você deseja finalizar esse pedido?</Text>
            <Text style={styles.title}>
                Mesa {route.params?.table}
            </Text>
            <Text style={styles.alert}>Total: R${route.params?.totalPrice}</Text>
            <TouchableOpacity style={styles.button} onPress={handleFinish}>
                <Text style={styles.textButton}>Finalizar pedido</Text>
                <Feather name="shopping-cart" size={20} color="#1d1d2e" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: '5%',
        paddingHorizontal: '4%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    alert: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#c4c84f',
        flexDirection: 'row',
        width: '65%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    textButton: {
        fontSize: 18,
        marginRight: 8,
        fontWeight: 'bold',
    }
})
