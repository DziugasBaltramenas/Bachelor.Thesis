import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import NfcManager, { Ndef } from 'react-native-nfc-manager';
import { Spinner } from 'native-base';
import { Button } from 'react-native-elements'

import { api } from '.././axios';

class VerifyDrugs extends Component {
    static navigationOptions = {
        headerStyle: {
          backgroundColor: '#517fa4',
        },
        headerTintColor: '#fff',
      };

    constructor(props) {
        super(props);
        this.state = {
            tag: {},
            isLoading: false,
            verification: false,
            data: null,
        }
    }

    componentDidMount() {
        this.startDetection()      
    }

    componentWillUnmount() {
        this.stopDetection();
    }

    render() {
        const {
            tag,
            isLoading,
            verification
        } = this.state;

        if(tag && isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20  }}>
                    <Spinner color='#517fa4' />
                    <View style={{margin: 20, marginTop: 60 }}>
                        <Text style={{fontSize: 18, textAlign: 'center'}}>
                            Medikamentas verifikuojamas
                        </Text>
                    </View>
                </View>
            )
        }

        return tag && verification
            ? this.renderSecondStep()
            : this.renderFirstStep();
    }

    renderFirstStep() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20  }}>
                <Image 
                    source={require('../images/drugs.png')} 
                    style={{ width: 150, height: 150, marginBottom: 20 }}
                />
                <View style={{margin: 20, }}>
                    <Text style={{fontSize: 18, textAlign: 'center'}}>
                        Pridėkite mobilųjį įrenginį prie medikamento ALR žymos
                    </Text>
                </View>
            </View>
        )
    }

    renderSecondStep() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'  }}>
                <Image 
                    source={require('../images/check.png')} 
                    style={{ width: 150, height: 150, marginBottom: 20 }}
                />
                <View style={{margin: 20, }}>
                    <Text style={{fontSize: 18, textAlign: 'center'}}>
                        Medikamentas yra tinkamas pacientui
                    </Text>
                </View>
                <View style={{marginTop: 50, flexDirection: 'row' ,justifyContent: 'space-between'}}>
                        <Button 
                            title="Atšaukti"
                            buttonStyle={{height: 40, width: 150, marginRight: 10, backgroundColor: 'red'}}
                            titleStyle={{fontSize: 24}}
                        />
                        <Button
                            title="Išduoti"
                            buttonStyle={{height: 40, width: 150, marginLeft: 10, backgroundColor: "#517fa4"}}
                            titleStyle={{fontSize: 24}}
                            onPress={() => this.saveEhr()}
                        />
                    </View>  
            </View>
        )
    }

    onTagDiscovered = tag => {
        const {
            navigation
        } = this.props;

        const nfcData = JSON.parse(this.parseText(tag))
        const patientId = navigation.getParam('patientId');
        this.setState({isLoading: true});

        if(nfcData.type === "drug"){
            api.get(`/drugs/${patientId}/${nfcData.data.id}`)
            .then(res => {
                this.setState({
                    verification: res.data.verification,
                    isLoading: false
                })
            })
            .catch(error => {
                console.warn('drug fail', error)
                alert('Medikamentas netinkamas pacientui')
                this.setState({
                    isLoading: false
                })
            })
        }
        
        
        this.setState({ tag, data: nfcData.data });
    }

    startDetection = () => {
        NfcManager.registerTagEvent(this.onTagDiscovered)
        .catch(error => {
            console.warn('registerTagEvent fail', error)
        })
    }

    stopDetection = () => {
        NfcManager.unregisterTagEvent()
            .catch(error => {
                console.warn('unregisterTagEvent fail', error)
            })
    }

    parseText = (tag) => {
        try {
            if (Ndef.isType(tag.ndefMessage[0], Ndef.TNF_WELL_KNOWN, Ndef.RTD_TEXT)) {
                return Ndef.text.decodePayload(tag.ndefMessage[0].payload);
            }
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    saveEhr = () => {
        const {
            data
        } = this.state;

        const {
            navigation
        } = this.props;

        const patientId = navigation.getParam('patientId');

        const ehrs = [{
            title: 'drug',
            id: data.id
        }];

        api.post(`/ehr/${patientId}`, { ehrs })
            .then(() => {
                navigation.popToTop();
                Alert.alert('Išsaugota', 'Medikamentas Patvirtintas')
            })
            .catch(error => {
                console.warn('ehr save fail', error);
            })
    }
}

export { VerifyDrugs }
