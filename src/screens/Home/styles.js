import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingLeft: 20,
        paddingRight: 20
    },
    inputContainer: {
        flex: 0.2,
        alignSelf: 'stretch',
    },
    historyContainer: {
        flex: 0.8,
        alignSelf: 'stretch',
    },
    title: {
        fontSize: 18,
        marginBottom: 15
    },
    input: {
        borderWidth: 1,
        height: 40, 
        borderColor: 'gray',
        padding: 5,
        alignSelf: 'stretch',
    }
});


export default styles;
