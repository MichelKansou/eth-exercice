import React, { PureComponent } from 'react';
import { Text, ScrollView, TouchableOpacity } from 'react-native';

import styles from './styles';

export default class HistoryList extends PureComponent {
    replaceAt(string, index, replace) {
        return string.substring(0, index) + replace + string.substring(index*2);
    }

    render() {
        const addresses = this.props.addresses.map((address, index) =>
            <TouchableOpacity style={styles.row} key={index} onPress={() => this.props.onPress(address)}>
                <Text style={styles.text}>{this.replaceAt(address, 15, "...").toLowerCase()}</Text>
            </TouchableOpacity>
        );
        return (
            <ScrollView style={styles.listContainer}>
               {addresses} 
            </ScrollView>
        );
        
    }
}
