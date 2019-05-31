import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements'

class Menu extends Component {
    static navigationOptions = {
        headerStyle: {
          backgroundColor: '#517fa4',
        },
        headerTintColor: '#fff',
      };

    render() {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch', padding: 20 }}>
            <View style={{marginBottom: 20}}>
                <Button onPress={this.handleVerifyPress} title="Išduoti medikamentus" buttonStyle={{height: 90, backgroundColor: '#517fa4' }} titleStyle={{fontSize: 26}}/>
            </View>
            <View style={{marginTop: 20}}>
                <Button onPress={this.handleCheckPress} title="Fiksuoti paciento būklę"  buttonStyle={{height: 90, backgroundColor: '#517fa4'}} titleStyle={{fontSize: 26}}/>
            </View>
            <View  style={{marginTop: 40, }}>
                <Text style={{fontSize: 20, textAlign: 'center'}}>
                    Pasirinkite pacientui atliekamą procedūrą
                </Text>
            </View>
        </View>
        )
    }

    handleCheckPress = () => {
        const {
            navigation
        } = this.props;

        const treatmentPlan = navigation.getParam('treatmentPlan');
        const patientId = navigation.getParam('patientId');

        navigation.navigate('CheckPatient', { treatmentPlan, patientId })
    }

    handleVerifyPress = () => {
        const {
            navigation
        } = this.props;

        const patientId = navigation.getParam('patientId');

        navigation.navigate('VerifyDrugs', { patientId })
    }
}

export { Menu };
