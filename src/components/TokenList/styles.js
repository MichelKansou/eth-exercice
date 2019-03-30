import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    tokenContainer: {
        flex: 1,
        alignSelf: 'stretch',
        maxHeight: 230,
        marginBottom: 20,
        paddingLeft: 20,
        paddingRight: 20
    },
    title: {
        color: 'gray',
        fontSize: 20,
        marginBottom: 15
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
        padding: 10,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
    },
    tokenPrice: {
        fontWeight: '400',
        color: 'grey'
    }
});

export default styles;
