import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    detailContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    mainBalanceContainer: {
        alignSelf: 'stretch',
        alignItems: 'center',
        marginBottom: 15,
        paddingLeft: 20,
        paddingRight: 20
    },
    mainBalance: {
        fontSize: 26,
        fontWeight: '500',
        marginBottom: 10,
    },
    mainBalancePrice: {
        fontSize: 18,
        color: 'grey',
        fontWeight: '400'
    },
});


export default styles;
