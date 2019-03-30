import React, { PureComponent } from 'react';
import { Text, FlatList, View} from 'react-native';
import BigNumber from "bignumber.js"

import styles from './styles';

export default class TokenList extends PureComponent {

    renderItem = ({item}) => {
        const {summary} = this.props;

        if (item !== "ETH") {
            return  (
                <View style={styles.rowContainer}>
                    <Text style={styles.tokenBalance}>
                        {
                            item.toString() + ' ' + 
                            new BigNumber(summary.balances[item])
                            .dividedBy(10**(summary.tokensMagnitude[item]))
                            .toFixed(4)
                            .toString()
                        }
                    </Text>
                    <Text style={styles.tokenPrice}>{"$ " + summary.prices[item].toFixed(4).toString()}</Text>
                </View>
            );
        }
    }

    render() {
        const balances = Object.keys(this.props.summary.balances);

        return (
            <View style={styles.tokenContainer}>
                <Text style={styles.title}>Tokens ({balances.length - 1})</Text>
                <FlatList
                    style={styles.flatList}
                    data={balances}
                    keyExtractor={(item, _) => item.toString()}
                    renderItem={this.renderItem}
                />
            </View>
        );
        
    }
}
