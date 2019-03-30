import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    transactionContainer: {
        flex: 1,
        alignSelf: 'stretch',
    },
    title: {
        color: 'gray',
        fontSize: 20,
        marginBottom: 15,
        marginLeft: 20,
    },
    flatList: {
        flex: 1,
        alignSelf: 'stretch',
    },
    rowContainer: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    transactionValueContainer: {
        textAlign: 'right',
        justifyContent: 'flex-end'
    },
    transactionPrice: {
        color: 'grey',
        textAlign: 'right',
    },
    transactionValue: {
        textAlign: 'right',
    },
    transactionTypeContainer: {
        borderRadius: 4,
        padding: 5
    },
    transactionType: {
        fontWeight: '600',
        width: 40,
        textAlign: 'center',
        color: '#fff',
    },
    transactionDate: {
        fontSize: 12,
        color: 'grey'
    }
});

export default styles;
