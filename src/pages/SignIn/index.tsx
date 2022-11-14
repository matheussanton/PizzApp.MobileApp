import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native'

import { AuthContext } from '../../contexts/AuthContext'

export default function SignIn() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { signIn } = useContext(AuthContext);

    async function handleLogin() {
        if (email == '' || password == '') return;

        await signIn({ email, password });
    }

    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        marginBottom: 18,
    },
    inputContainer: {
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 34,
        paddingHorizontal: 14
    },
    input: {
        width: '95%',
        height: 40,
        backgroundColor: "#EAEAEA",
        marginBottom: 12,
        borderRadius: 4,
        paddingHorizontal: 8,
        color: "#000"
    },
    button: {
        width: '95%',
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
