import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Modal
} from 'react-native';
import { ModalPicker } from '../../components/ModalPicker'
import { api } from '../../services/api'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'

import { Feather } from '@expo/vector-icons'

type RouteDetailParams = {
    Order: {
        table: number | string;
        orderId: string;
    }
};

type OrderRouteProps = RouteProp<RouteDetailParams, 'Order'>;

export type CategoryProps = {
    id: string;
    name: string;
}

export default function Order() {

    const route = useRoute<OrderRouteProps>();
    const navigation = useNavigation();

    const [categoryList, setCategoryList] = useState<CategoryProps[] | []>([]);
    const [categorySelected, setCategorySelected] = useState<CategoryProps>();

    const [amout, setAmount] = useState('1');

    const [modalCategoryVisible, setModalCategoryVisible] = useState(false);

    useEffect(() => {
        async function loadCategories() {

            await api.get('/category')
                .then((res) => {
                    let data = res.data;
                    setCategoryList(data);
                    setCategorySelected(data[0]);

                })
                .catch((err) => {
                    console.log(err);
                    handleCloseOrder();
                })
        }

        loadCategories();
    }, [])

    async function handleCloseOrder() {

        try {

            await api.delete('order', {
                params: {
                    orderId: route.params.orderId
                }
            })

            navigation.goBack();

        } catch (error) {
            console.log(error);
            navigation.goBack();
        }
    }

    return (

        <View style={styles.container}>


            <View style={styles.header}>
                <Text style={styles.title}>
                    Mesa {route.params.table}
                </Text>
                <TouchableOpacity
                    onPress={handleCloseOrder}
                >
                    <Feather name="trash-2" size={28} color="#FF3F4b"></Feather>
                </TouchableOpacity>
            </View>

            {categoryList.length != 0 ? (
                <TouchableOpacity
                    style={styles.comboBox}
                    onPress={() => setModalCategoryVisible(true)}>
                    <Text>
                        {categorySelected?.name}
                    </Text>
                </TouchableOpacity>
            ) : (
                < ActivityIndicator size={25} color="#000" />
            )
            }

            <TouchableOpacity style={styles.comboBox}>
                <Text>Pizza de calabresa</Text>
            </TouchableOpacity>

            <View style={styles.qtdContainer}>
                <Text style={styles.qtdText}>Quantidade</Text>
                <TextInput
                    style={[styles.comboBox, { width: '60%', textAlign: 'center' }]}
                    placeholder="Ex.: 1"
                    keyboardType={"numeric"}
                    value={amout}
                    onChangeText={setAmount}
                />
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.buttonAdd}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Finalizar</Text>
                </TouchableOpacity>
            </View>


            <Modal
                transparent={true}
                visible={modalCategoryVisible}
                animationType="fade"
            >
                <ModalPicker
                    handleCloseModal={() => setModalCategoryVisible(false)}
                    options={categoryList}
                    selectedItem={(item) => { setCategorySelected(item) }}
                />
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: '5%',
        paddingHorizontal: '4%'
    },
    header: {
        flexDirection: 'row',
        marginBottom: 24,
        marginTop: 24,
        alignItems: 'center'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginRight: 14,
    },
    comboBox: {
        width: '100%',
        height: 40,
        backgroundColor: "#EAEAEA",
        marginBottom: 12,
        borderRadius: 4,
        paddingHorizontal: 8,
        color: "#000",
        justifyContent: 'center',
        fontSize: 20
    },
    qtdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginBottom: 12,
        marginTop: 8,
    },
    qtdText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: "space-between"
    },
    buttonAdd: {
        borderRadius: 4,
        backgroundColor: '#3fd1ff',
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        width: '20%',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: "#c4c84f",
        height: 40,
        borderRadius: 4,
        width: '75%',
        justifyContent: 'center',
        alignItems: "center",
    }
})
