/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => App);

import React from 'react';
import Dashboard from './components/dashboard/index.js';
const App = () => {
  return (
    <Dashboard/>
  );
};
export default App;

import React from 'react'
import {Text, View, Button, NativeModules} from 'react-native';
import styles from "./styles.css";
export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            foundDeviceName: 'None',
            deviceBondLevel: 0,
            heartBeatRate: 0
        };
    }
    searchBluetoothDevices = () => {
        NativeModules.DeviceConnector.enableBTAndDiscover( (error, deviceBondLevel)=>{
            this.setState({ deviceBondLevel: deviceBondLevel});
        })
        setInterval(this.getDeviceBondLevel, 2000)
    }
    getDeviceBondLevel = () => {
        NativeModules.DeviceConnector.getDeviceBondLevel( (error, deviceBondLevel)=>{
            this.setState({ deviceBondLevel: deviceBondLevel}, () => {
                this.getDeviceBondLevel
            });
        })
    }
    activateHeartRateCalculation = () => {
        NativeModules.HeartBeatMeasurer.startHeartRateCalculation( (error, heartBeatRate)=>{
            this.setState({ heartBeatRate: heartBeatRate});
        })
        setInterval(this.getHeartRate, 2000)
    }
    getHeartRate = () => {
        NativeModules.HeartBeatMeasurer.getHeartRate( (error, heartBeatRate)=>{
            this.setState({ heartBeatRate: heartBeatRate});
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.package}>
                    <Text style={styles.sensorField}>Heart Beat:</Text>
                    <Text style={styles.sensorField}>{this.state.heartBeatRate + ' Bpm'}</Text>
                </View>
                <View style={styles.package}>
                    <Text style={styles.sensorField}>Device BL:</Text>
                    <Text style={styles.sensorField}>{this.state.deviceBondLevel}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Button onPress={this.searchBluetoothDevices} title='Link With MiBand' /> 
                    <View style={styles.spacing}/>
                    <Button onPress={this.activateHeartRateCalculation} title='Get Heart Rate' /> 
                </View>
            </View>
        );
    }
}
