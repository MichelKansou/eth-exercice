import { createStackNavigator, createAppContainer } from "react-navigation";

import Home from '@screens/Home';
import Details from '@screens/Details';
import BarcodeScanner from '@screens/BarcodeScanner';


const AppNavigator = createStackNavigator(
    {
        Home: {
            screen: Home,
        },
        Details:  Details,
        BarcodeScanner: BarcodeScanner
    },
    {
        initialRouteName: 'Home',
        defaultNavigationOptions: {
            headerStyle: {
                borderBottomWidth: 0,
                marginBottom: 30,
            },
        },
    }
);

export default createAppContainer(AppNavigator);