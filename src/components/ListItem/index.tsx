import React from 'react';
import { View, Text, StyleSheet } from 'react-native'


interface ItemProps {
    data: {
        id: string;
        productId: string;
        name: string;
        amount: string | number;
    }
}

export function ListItem({ data }: ItemProps) {

    return (
        <View style={styles.container}>
            <Text>{data.name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    }
})
