import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import ProductScreen from './components/ProductScreen';
import ProductDetailsScreen from './components/ProductDetailsScreen';
import ProductAddScreen from './components/ProductAddScreen';
import ProductEditScreen from './components/ProductEditScreen';
import CacheStore from 'react-native-cache-store';
import Database from './Database';
const db = new Database();

const RootStack = createStackNavigator(
  {
    Product: ProductScreen,
    ProductDetails: ProductDetailsScreen,
    AddProduct: ProductAddScreen,
    EditProduct: ProductEditScreen,
  },
  {
    initialRouteName: 'Product',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#777777',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  },
);

export default class App extends React.Component {

  constructor(){
    super();
    this.state = {
      userId: '',
      phoneNumber: '',
      isLoading: true,
    }
  }

  componentWillMount(){
    CacheStore.get('userState').then((userState) => {
      if(userState) {
        console.log('userState is found', userState)
        this.setState({ 'userId': userState.userId, 'phoneNumber': userState.phoneNumber, 'isLoading': false });
      }else {
        console.log('user state did not found');
        this.setState({'isLoading' : false})
      }
    });
  }

  onLogoutPressed() {
    console.log('logout pressed');
    CacheStore.remove('userState');
    this.setState({
      userId: '',
      phoneNumber: ''
    })
  }

  renderUserLogged() {
    return <RootContainer />;
    // return (
    //   <View>
    //     <TouchableOpacity style={styles.button} onPress={() => this.onLogoutPressed()}>
    //       <Text style={styles.buttonText}>Logout</Text>
    //     </TouchableOpacity>

    //     <Text style={styles.label}>Phone Number</Text>
    //     <Text style={styles.text}>{this.state.phoneNumber}</Text>
    //   </View>
    // )
  }

  renderLogin() {
    //Login with phone AccoutKit
    db.userLoggedIn().then((data) =>{
      this.setState({
        phoneNumber: data.phoneNumber,
        userId: data.userId
      })
    });
    
    return (
      <View>
        <Text>AccoutKit</Text>
      </View>
    )
  }
  

  render() {
    console.log('statate', this.state);
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }else if(this.state.phoneNumber){
      const RootContainer = createAppContainer(RootStack);
      return <RootContainer />;
    } else {
      return (
        <View style={styles.container}>
          { this.renderLogin() }
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});