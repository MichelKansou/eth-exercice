import React, { Component } from 'react';
import { Text, View, TextInput, Button } from 'react-native';

import HistoryList from '@components/HistoryList';
import { isValidEthereum } from '@utils/ledgerEthUtils';
import styles from './styles';

export default class Home extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "ETH Explorer",
            headerRight: (
                <Button
                    onPress={() => navigation.navigate('BarcodeScanner', {
                        updateHistory: navigation.state.params.updateHistory
                    })}
                    title="QRCode"
                />
            )
        };
      };

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            history: [
                "0xa910f92acdaf488fa6ef02174fb86208ad7722ba",
                "0x4e9ce36e442e55ecd9025b9a6e0d88485d628a67",
                "0xa158154a8c4ea134cc5ea64e11229198024af123",
                "0xdb7a773655039574ade896e61649bd04e04daeea",
                "0x7042ff382abc29fa36767610494eead9b272afca",
                "0x22951d71bb26f41743d74174434c9d8cf48a10ec"
            ]
        };
    }


    onSubmit = async (address) => {
        if (isValidEthereum(address)) {
            await this.updateHistory(address);
            this.props.navigation.navigate('Details', {address: address.toLowerCase()});
        }
    };

    // update addresses history position
    updateHistory = (address) => {
        return new Promise ((resolve) => {
            // if address don't exist add new adress in history
            if (this.state.history.indexOf(address) === -1) {
                this.setState(
                    prevState => ({
                        history: [...prevState.history, address]
                    }),
                    () => resolve()
                );
            } else {
                // make a copy of current history state
                const historyCopy = [...this.state.history];

                // remove address from the cloned history array
                historyCopy.splice(historyCopy.indexOf(address), 1);

                // add address to the beginning of the cloned history array
                historyCopy.unshift(address);

                // replace history state
                this.setState({ history: historyCopy }, () => resolve());
            }
        });
    }

    componentDidMount() {
        this.props.navigation.setParams({updateHistory: this.updateHistory});
    }
    
    render() {
        const {history, text} = this.state;
        
        return (
            <View style={styles.homeContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.title}>Open an Ethereum account!</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ethereum address"
                            onChangeText={(text) => this.setState({text})}
                            onSubmitEditing={this.onSubmit}
                            value={text}
                            editable = {true}
                            maxLength = {40}
                        />
                </View>
                <View style={styles.historyContainer}>
                    <Text style={styles.title}>History</Text>
                    <HistoryList onPress={this.onSubmit} addresses={history} />
                </View>
            </View>
        );
    }
}
