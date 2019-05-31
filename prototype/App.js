import { createStackNavigator, createAppContainer } from "react-navigation";

import { Home } from './screen/Home';
import { Menu } from './screen/Menu';
import { CheckHealth } from './screen/CheckHealth';
import { VerifyDrugs } from './screen/VerifyDrugs';

const AppNavigator = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            title: "Nuskaityti žymą"
        }
    },
    Menu: {
        screen: Menu,
        navigationOptions: {
            title: "Atlikti procedūrą"
        }
    },
    CheckPatient: {
        screen: CheckHealth,
        navigationOptions: {
            title: "Fiksuoti paciento būklę"
        }
    },
    VerifyDrugs: {
        screen: VerifyDrugs,
        navigationOptions: {
            title: "Nuskaityti žymą"
        }
    },
});

const App = createAppContainer(AppNavigator);

export default App;