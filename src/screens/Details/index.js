import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import BigNumber from "bignumber.js";

import { isValidEthereum, getBalance } from '@utils/ledgerEthUtils';
import TokenList from '@components/TokenList';
import styles from './styles';
import TransationList from '@components/TransationList';

export default class Details extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
          title: navigation.getParam('address', 'Detail View'),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            address: '',
            summary: {},
            ops: [],
            loading: true,
        };
    }

    async componentWillMount() {
        const { navigation } = this.props;
        const address = navigation.getParam('address');
        if (isValidEthereum(address)) {
            const { summary, ops } = await getBalance(address)
            this.setState({
                address: address,
                summary: summary,
                ops: ops,
                loading: false
            });
        }
    }

    render() {
        const {summary, ops, loading} = this.state;
        if (!loading) {
            return (
                <View style={styles.detailContainer}>
                    <View style={styles.mainBalanceContainer}>
                        <Text style={styles.mainBalance}>
                            {
                                "ETH " +
                                new BigNumber(summary.balances["ETH"])
                                .dividedBy(10**(summary.tokensMagnitude["ETH"]))
                                .toFixed(4)
                                .toString()
                            }
                        </Text>
                        <Text style={styles.mainBalancePrice}>{"$ " + summary.prices["ETH"].toFixed(4).toString()}</Text>
                    </View>
                    {(Object.keys(summary.balances).length - 1) > 0 && <TokenList style={styles.tokenListWrapper} summary={summary} />}
                    <TransationList style={styles.transactionListWrapper} ops={ops} />
                </View>
            );
        } else {
            return (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator style={{marginBottom : 20}} size="large" color="#1abc9c" />
                    <Text>Fetching ...</Text>
                </View>
            );
        }
    }
}
