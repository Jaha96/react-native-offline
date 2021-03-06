import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import Database from '../Database';
import RNRestart from 'react-native-restart';
import CacheStore from 'react-native-cache-store';


const db = new Database();

export default class ProductScreen extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            products: [],
            notFound: 'Хоосон байна.\n(+) товчийг дарж нэмнэ үү.'
        };
    }

    componentDidMount() {
        this._subscribe = this.props.navigation.addListener('didFocus', () => {
          this.getProducts();
        });
    }

    getProducts() {
        let products = [];
        db.listProduct().then((data) => {
            products = data;
            this.setState({
            products,
            isLoading: false,
            });
        }).catch((err) => {
            console.log(err);
            this.setState({ isLoading: false })
        })
    }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Жагсаалт',
      headerRight: (
        <Button
          buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
          icon={{ name: 'add-circle', style: { marginRight: 0, fontSize: 28 } }}
          onPress={() => { 
            //logout code
            // CacheStore.flush().then((x) => {
            //   RNRestart.Restart();
            // })
            navigation.navigate('AddProduct', {
              onNavigateBack: this.handleOnNavigateBack
            }); 
          }}
        />
      ),
    };
  };


  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      leftAvatar={{
        source: item.sd && { uri: item.prodImage },
        title: item.name[0]
      }}
      onPress={() => {
        this.props.navigation.navigate('ProductDetails', {
          prodId: `${item.product_id}`,
        });
      }}
      chevron
      bottomDivider
    />
  )

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    if(this.state.products.length === 0){
      return(
        <View>
          <Text style={styles.message}>{this.state.notFound}</Text>
        </View>
      )
    }
    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={this.state.products}
        renderItem={this.renderItem}
      />
    );
  }
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     paddingBottom: 22
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
    activity: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    },
    message: {
      padding: 16,
      fontSize: 18,
      color: 'red'
    }
  });