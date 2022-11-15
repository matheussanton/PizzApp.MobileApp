import React, { useContext } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    StyleSheet
} from 'react-native'

import { AuthContext } from '../../contexts/AuthContext'

export default function Dashboard() {

    const { signOut } = useContext(AuthContext);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Novo Pedido</Text>
            <TextInput
                style={styles.input}
                placeholder="Número da mesa"
                keyboardType='numeric'
            // value={email}
            // onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.button}>
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
