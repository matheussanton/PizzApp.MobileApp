import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    StyleSheet
} from 'react-native'
import { api } from '../../services/api'
import { useNavigation } from '@react-navigation/native'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../../routes/app.routes'


export default function Dashboard() {

    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    const [table, setTable] = useState('');

    async function openOrder() {
        if (table === '') return;

        const reponse = await api.post('/order', {
            table: Number(table)
        })

        navigation.navigate('Order', {
            table: table,
            orderId: reponse.data.id
        });

        setTable('');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Novo Pedido</Text>
            <TextInput
                style={styles.input}
                placeholder="Número da mesa"
                keyboardType='numeric'
                value={table}
                onChangeText={setTable}
            />
            <TouchableOpacity style={styles.button}
                onPress={openOrder}
            >
                <Text style={styles.buttonText}>Abrir mesa</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        marginBottom: 30,
        fontSize: 36,
        fontWeight: 'bold'
    },
    input: {
        width: '90%',
        height: 60,
        backgroundColor: "#EAEAEA",
        marginBottom: 16,
        borderRadius: 4,
        paddingHorizontal: 12,
        color: "#000",
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    },
    button: {
        width: '90%',
        height: 40,
        backgroundColor: "#c4c84f",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
})
