import React, { Component } from 'react';
import { StyleSheet,
        ScrollView,
        ActivityIndicator,
        View,
        TextInput,
        Text,
        ListView,
        TouchableOpacity,
        Image } from 'react-native';
import { Button } from 'react-native-elements';
import Database from '../Database';
import DatePicker from 'react-native-datepicker'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-picker';
import fetch_blob from 'rn-fetch-blob';
import Moment from 'moment';


const db = new Database();
const moment = new Moment();
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ProductAddScreen extends Component {

    constructor() {
        super();
        this.state = {
            prodName: '',
            prodPrice: '',
            prodImage: {},
            prodQuantity: '1',
            prodDate: new Date(),
            prodDesc: '',
            isLoading: false,
            searchedAdresses: [],
            isListViewHidden: true,
            films: [{title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'},
            {title: 'jaha', date: '2019'},{title: 'erka', date: '2020'}, {title: 'japar', date: '2034'}] ,
        };
    }

    updateTextInput = (text, field) => {
        const state = this.state
        state[field] = text;
        this.setState(state);
    }
    static navigationOptions = {
        title: 'Нэмэх',
    };

    saveProduct() {
        this.setState({
            isLoading: true,
        });
        let data = {
            prodId: this.state.prodId,
            prodName: this.state.prodName,
            prodDesc: this.state.prodDesc,
            prodImage: this.state.prodImage,
            prodPrice: this.state.prodPrice
        }
        db.addProduct(data).then((result) => {
            console.log(result);
            this.setState({
                isLoading: false,
            });
            this.props.navigation.state.params.onNavigateBack;
            this.props.navigation.goBack();
        }).catch((err) => {
            console.log(err);
            this.setState({
                isLoading: false,
            });
        })
    }

    findFilm(query) {
        console.log(query)
        if (query === '') {
          return [];
        }
    
        const { films } = this.state;
        const regex = new RegExp(`${query.trim()}`, 'i');
        return films.filter(film => film.title.search(regex) >= 0);
      }



    searchedAdresses = (searchedText) => {
        var searchedAdresses = adresses.filter(function(adress) {
            return adress.street.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
        });
        this.setState({searchedAdresses: searchedAdresses});
    };

    renderAdress = (film) => {
        return (
                <TouchableOpacity style={{flex: 1, margin: 5}} onPress={(e) => {
                            this.setState({ prodName: film.title, isListViewHidden: true });
                        }}>
                            <Text>{film.title}, {film.date}</Text>
                        </TouchableOpacity>
                
        );
    };

    selectImage(){
        const options = {
        }
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            } else if (response.error) {
                console.log('Image picker error: ' + response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ' + response.customButton);
            } else {
                const imageDirectory = RNFS.DocumentDirectoryPath + "/awesomeDirectory";
                RNFS.mkdir(imageDirectory).then((res) => {
                    console.log('directory created', res)
                }).catch((err) =>{
                    console.log('error occured while creating directory', err);
                }).finally((e) => {
                    console.log('use image is : ', response);
                
                    const file_path = imageDirectory + "/"+ moment.format('YYYYMMDDHHmmssSSS') + ".txt";
                    console.log('file_path', file_path)
                    const file_data = "data:" + response.type +";base64," + response.data;

                    RNFS.writeFile(file_path, file_data, 'utf8')
                        .then((success) => {
                            console.log('FILE WRITTEN!');
                            RNFS.readFile(file_path, 'utf8').then((r) => {
                                console.log('readFile is ', r);
                                this.setState({prodImage: {data: r, source: file_path}});
                            })
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });
                });
            }
        })

    }

    render() {
        var imageSource = this.state.prodImage.data ? 
            { uri: this.state.prodImage.data } : require('../assets/images/image_upload.png');
        const { prodName } = this.state;
        const films = this.findFilm(prodName);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        if (this.state.isLoading) {
            return (
                <View style={styles.activity}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }
        return (
            <ScrollView style={styles.container}>
                <View style={[styles.subContainer, styles.labelInputRow]}>
                    <Text>Нэр:</Text>
                    <TextInput
                        placeholder='Нэр бичнэ үү'
                        onChangeText={text => this.setState({ prodName: text, isListViewHidden: false })}
                        value={this.state.prodName}
                        />
                    {
                        this.state.isListViewHidden ? null: 
                        <ListView style={{flex: 1}} enableEmptySections = {true}
                                dataSource={films.length === 1 && comp(prodName, films[0].title) ? ds.cloneWithRows([]) : ds.cloneWithRows(films)}
                            renderRow={this.renderAdress} />
                    }
                </View>
                <View style={[styles.subContainer, styles.labelInputRow]}>
                    <Text>Үнэ:</Text>
                    <TextInput
                        placeholder={'Үнэ'}
                        value={this.state.prodPrice}
                        keyboardType='numeric'
                        onChangeText={(text) => this.updateTextInput(text, 'prodPrice')}
                    />
                </View>
                <TouchableOpacity style={styles.rowCenter} onPress={() => this.selectImage()}>
                    <Image
                            style={{
                            paddingVertical: 30,
                            width: 150,
                            height: 150,
                            borderRadius: 75
                            }}
                            resizeMode='cover'
                            source={imageSource}
                            
                        />
                </TouchableOpacity>
                <View style={[styles.subContainer, styles.labelInputRow]}>
                    <Text>Ширхэг: </Text>
                    <TextInput
                        placeholder={'Ширхэг'}
                        value={this.state.prodQuantity}
                        keyboardType='numeric'
                        onChangeText={(text) => this.updateTextInput(text, 'prodQuantity')}
                    />
                </View>
                <View style={styles.subContainer}>
                    <DatePicker
                        style={styles.datePick}
                        date={this.state.prodDate}
                        mode="date"
                        placeholder="Огноо"
                        format="YYYY-MM-DD"
                        maxDate={new Date()}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36,
                            borderWidth: 0
                        }
                        }}
                        onDateChange={(date) => {this.setState({prodDate: date})}}
                    />
                </View>
                <View style={styles.subContainer}>
                    <TextInput
                        multiline={true}
                        numberOfLines={4}
                        placeholder={'Тайлбар'}
                        value={this.state.prodDesc}
                        onChangeText={(text) => this.updateTextInput(text, 'prodDesc')}
                    />
                </View>
                
                <View style={styles.button}>
                    <Button
                        large
                        leftIcon={{ name: 'save' }}
                        title='Хадгалах'
                        onPress={() => this.saveProduct()} />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    subContainer: {
        flex: 1,
        marginBottom: 20,
        padding: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#CCCCCC',
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
    datePick: {
        width: '100%', 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
      },
    itemText: {
        fontSize: 15,
        margin: 2
    },
    labelInputRow: {
        flex: 1, 
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    rowCenter: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
})