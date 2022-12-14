import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Dashboard from '../pages/Dashboard';
import Order from '../pages/Order';
import FinishOrder from '../pages/FinishOrder';

export type StackParamList = {
    Dashboard: undefined,
    Order: {
        table: number | string;
        orderId: string;
    },
    FinishOrder: {
        table: number | string;
        orderId: string;
    };
}

const Stack = createNativeStackNavigator<StackParamList>();


function AppRoutes() {


    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Order"
                component={Order}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="FinishOrder"
                component={FinishOrder}
                options={{
                    headerShown: true,
                    title: 'Finalizando',
                    headerStyle: {
                        backgroundColor: '#f2f2f2'
                    }
                }}
            />
        </Stack.Navigator>
    )
}

export default AppRoutes;
