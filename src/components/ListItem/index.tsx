import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'


interface ItemProps {
    data: {
        id: string;
        productId: string;
        name: string;
        amount: string | number;
    };
    deleteItem: (orderItemId: string) => void;
}

export function ListItem({ data, deleteItem }: ItemProps) {

    function handleDeleteItem() {
        deleteItem(data.id)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.item}>{data.amount}x {data.name}</Text>
            <TouchableOpacity onPress={handleDeleteItem}>
                <Feather name="trash-2" size={23} color="#FF3F4b" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: "#EAEAEA",
        borderWidth: 1,
        borderColor: "#D3D3D3",
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 12
    },
    item: {
        fontWeight: 'bold',
        fontSize: 16
    }
})
