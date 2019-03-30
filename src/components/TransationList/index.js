import React, { PureComponent } from 'react';
import { Text, FlatList, View} from 'react-native';
import BigNumber from "bignumber.js";
import moment from "moment";

import styles from './styles';

export default class TransationList extends PureComponent {

    renderTransation = ({item}) => {

        return  (
            <View style={styles.rowContainer}>
                <View style={[{backgroundColor: item.type.toString() === "OUT" ? '#f39c12' : '#27ae60'}, styles.transactionTypeContainer]}>
                    <Text style={styles.transactionType}>{item.type.toString()}</Text>
                </View>
                <Text style={styles.transactionDate}>{moment(item.date).format('lll').toString()}</Text>
                <View style={styles.transactionValueContainer}>
                    <Text style={[{color: item.type.toString() === "OUT" ? '#f39c12' : '#27ae60'}, styles.transactionValue]}>
                        {
                            (item.type.toString() === "OUT" ? '- ' : '+ ') +
                            new BigNumber(item.value)
                            .dividedBy(10**(item.magnitude))
                            .toFixed(4)
                            .toString() + ' ' + item.symbol.toString()
                        }
                    </Text>
                    <Text style={styles.transactionPrice}>{"$ " + item.price.toFixed(4).toString()}</Text>
                </View>
            </View>
        );
    }

    render() {
        const { ops } = this.props;
        return (
            <View style={styles.transactionContainer}>
                <Text style={styles.title}>Transations ({ops.length})</Text>
                <FlatList
                    style={styles.flatList}
                    data={ops}
                    keyExtractor={(op, _) => op.id.toString()}
                    renderItem={this.renderTransation}
                />
            </View>
        );
        
    }
}
