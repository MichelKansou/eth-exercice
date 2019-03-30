import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';

import { isValidEthereum } from '@utils/ledgerEthUtils';

export default class BarcodeScanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
        };
    }

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    handleBarCodeScanned = async ({ type, data }) => {  
        if (isValidEthereum(data)) {
            await this.props.navigation.state.params.updateHistory(data);
            this.props.navigation.navigate('Details', {address: data.toLowerCase()});
        }
    }

    render() {
        const { hasCameraPermission } = this.state;

        if (hasCameraPermission === null) {
            return <Text>Requesting for camera permission</Text>;
        }
        if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        }
        return (
            <View style={{ flex: 1 }}>
                <BarCodeScanner
                    onBarCodeScanned={this.handleBarCodeScanned}
                    style={StyleSheet.absoluteFill}
                />
            </View>
        );
    }
}