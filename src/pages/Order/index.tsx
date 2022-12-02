import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Modal,
    FlatList
} from 'react-native';
import { ModalPicker } from '../../components/ModalPicker'
import { api } from '../../services/api'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { ListItem } from '../../components/ListItem'

import { Feather } from '@expo/vector-icons'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../../routes/app.routes'

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
    price: any;
}

export type ProductProps = {
    id: string;
    name: string;
    price: string | undefined;
}

type ItemProps = {
    id: string;
    productId: string;
    name: string;
    amount: string | number;
    price: number;
}

export default function Order() {

    const route = useRoute<OrderRouteProps>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    const [categoryList, setCategoryList] = useState<CategoryProps[] | []>([]);
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>();
    const [modalCategoryVisible, setModalCategoryVisible] = useState(false);

    const [productList, setProductList] = useState<ProductProps[] | []>([]);
    const [productSelected, setProductSelected] = useState<ProductProps | undefined>();
    const [modalProductVisible, setModalProductVisible] = useState(false);


    const [amount, setAmount] = useState('1');

    const [items, setItems] = useState<ItemProps[] | []>([]);

    const [price, setPrice] = useState(0);


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

    useEffect(() => {

        async function loadCategoryItems() {

            await api.get('/product/by-category', {
                params: {
                    categoryId: categorySelected?.id
                }
            })
                .then((res) => {
                    setProductList(res.data);
                    setProductSelected(res.data[0]);

                })
                .catch(err => {
                    console.log(err);
                })

        }

        loadCategoryItems()

    }, [categorySelected]);


    // Adicionar um item na mesa
    async function handleAddItemToList() {
        const response = await api.post('/orderItem', {
            orderId: route.params?.orderId,
            productId: productSelected?.id,
            amount: Number(amount)
        })

        let { id } = response?.data;

        // let orderItemPrice = (productSelected * amount);
        let data = {
            id: id,
            productId: productSelected?.id as string,
            name: productSelected?.name as string,
            amount: amount,
            price: (parseInt(productSelected?.price) * parseInt(amount))
        }

        setItems(allItems => [...allItems, data]);
    }

    async function handleDeleteItem(itemId: string) {
        await api.delete('/orderItem', {
            params: {
                orderItemId: itemId
            }
        });

        //Após delete, remove item da lista

        let newItemList = items.filter(item => {
            return (item.id != itemId)
        })

        setItems(newItemList);
    }

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

    function handleFinishOrder() {
        let totalPrice = 0;
        items.map((item) => {
            totalPrice += item.price;
        });

        navigation.navigate("FinishOrder", {
            table: route.params?.table,
            orderId: route.params?.orderId,
            totalPrice: totalPrice
        });

    }

    return (

        <View style={styles.container}>


            <View style={styles.header}>
                <Text style={styles.title}>
                    Mesa {route.params.table}
                </Text>
                <TouchableOpacity
                    style={{ opacity: items.length > 0 ? 0.5 : 1 }}
                    disabled={items.length > 0}
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

            {productList.length != 0 ? (
                <TouchableOpacity
                    style={styles.comboBox}
                    onPress={() => setModalProductVisible(true)}>
                    <Text>
                        {productSelected?.name}
                    </Text>
                </TouchableOpacity>
            ) : (
                < ActivityIndicator size={25} color="#000" />
            )
            }

            <View style={styles.qtdContainer}>
                <Text style={styles.qtdText}>Quantidade</Text>
                <TextInput
                    style={[styles.comboBox, { width: '60%', textAlign: 'center' }]}
                    placeholder="Ex.: 1"
                    keyboardType={"numeric"}
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.buttonAdd}
                    onPress={handleAddItemToList}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { opacity: items.length === 0 ? 0.5 : 1 }]}
                    disabled={items.length === 0}
                    onPress={handleFinishOrder}
                >
                    <Text style={styles.buttonText}>Finalizar</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, marginTop: 24 }}
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) =>
                    <ListItem
                        data={item}
                        deleteItem={handleDeleteItem}
                    />}
            />


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


            <Modal
                transparent={true}
                visible={modalProductVisible}
                animationType="fade"
            >
                <ModalPicker
                    handleCloseModal={() => setModalProductVisible(false)}
                    options={productList}
                    selectedItem={(item) => { setProductSelected(item) }}
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
        fontSize: 20,
        borderWidth: 1,
        borderColor: "#D3D3D3"
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
        backgroundColor: '#4DB023',
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
