import React, { Component } from 'react';
import { TextInput, StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
//import apiKey from './google_api_key';

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      error: "",
      latitude: 0,
      longitude: 0,
      destination: "",
      predictions: []
    };
  }

  componentDidMount() {
    //Get current location and get initial region to this
    navigator.geolocation.getCurrentPosition(
      position =>{
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000}
    );
  }

  async onChangeDestination(destination) {
    this.setState({destination});
    const apiUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyB83SfaccVha2jO_M3UD9_ly5x7I2nbMpo&input=${destination}&location=${this.state.latitude}, ${this.state.longitude}&radius=2000';
    try {
      const result = await fetch(apiUrl);
      const json = await result.jason();
      console.log(json);
      this.setState({
        predictions: json.predictions
      });
    } catch (err) {
      console.error(err);
    }
    
  }

  render(){

    const predictions = this.state.predictions.map(prediction => (
    <Text>key={predictions.id}>{predictions.description}</Text>
    ));

    return(
      <View style={styles.container}>
        <TextInput 
          placeholder="Enter Location..."
          style={styles.destinationInput}
          value={this.state.destination}
          onChangeText={destination => this.onChangeDestination(destination)}
        />
        {predictions}
        <MapView
          style={styles.map}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          showsUserLocation={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  destinationInput: {
    marginVertical:50,
    alignSelf: 'center',
    height: 40,
    borderWidth: 0.5,
    marginTop: 200,
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    backgroundColor: 'white',
  },
  container: {
    //....StyleSheet.absoluteFillObject
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    //...StyleSheet.absoluteFillObject
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
