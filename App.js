import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Image, Button, Alert, Keyboard } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {API_TOKEN} from '@env';

export default function App() {

  // textinput 
  const [amount, setAmount] = useState('');
  // getting currencies to the picker
  const [currencies, setCurrencies] = useState([]);
  // getting rates to euro
  const [euro, setEuro] = useState('');
  // calculating the result
  const [selected, setSelected] = useState('');

  // getting the data from given url, using apikey as a header. Apikey stored in .env file
  const getData = async () => {
    const url = 'https://api.apilayer.com/exchangerates_data/latest';
    const options = {
      headers: {
        apikey: API_TOKEN
      }
    };
    try {
        const response = await fetch(url, options);
        const currencyData = await response.json();
        setCurrencies(currencyData.rates);
    } catch (e) {
        Alert.alert('Error fetching data');
    }
  }

  // when app is loaded, getting the data for picker
  useEffect(() => { getData()}, []);

  // calculating the convertion between chosen currency to euros
  const convert = () => {
    const amountEuro = Number(amount) / currencies[selected];
    setEuro(`${amountEuro.toFixed(2)}€`);
    Keyboard.dismiss()
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('./euro.png')} />
      <Text style={styles.text}>{euro}</Text>
      <View styles={styles.row}>
        <TextInput
          style={styles.input}
          placeholder='amount'
          onChangeText={text => setAmount(text)}
          value={amount}
          keyboardType='numeric'
        />
        <View style={{ weight: 50, width: 150, paddingTop: 10}}>
         <Picker
          selectedValue={selected}
          onValueChange={(itemValue, itemIndex) => {
            setSelected(itemValue);
          }}
        >
          {Object.keys(currencies).sort().map(key => (<Picker.Item label={key} value={key} key={key} />))}
        </Picker>
        </View>
      </View>
      <Button style={styles.button} onPress={convert} title='CONVERT'></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
  },
  button: {
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 120,
  },
  input: {
    borderColor: "grey",
    borderWidth: 1,
    padding: 4,
  }
});
