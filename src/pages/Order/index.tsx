import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useRoute, RouteProp } from '@react-navigation/native'

type RouteDetailParams = {
    Order: {
        table: number | string;
        orderId: string;
    }
};

type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>;

export default function Order() {

    const route = useRoute<OrderRouteProps>();

    return (

        <View>
            <Text>terste texto</Text>
            <Text>{route.params.table}</Text>
            <Text>{route.params.orderId}</Text>
        </View>

    )
}

const styles = StyleSheet.create({

    container: {

    }

})
