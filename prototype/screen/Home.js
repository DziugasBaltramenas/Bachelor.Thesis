import React, { Component } from 'react';
import { View, Text, Platform, Image } from 'react-native';
import NfcManager, { Ndef } from 'react-native-nfc-manager';
import { withNavigationFocus } from "react-navigation";

import { api } from '.././axios';

const RtdType = {
    URL: 0,
    TEXT: 1,
};

class HomeScreenComponent extends Component {
    static navigationOptions = {
        headerStyle: {
          backgroundColor: '#517fa4',
        },
        headerTintColor: '#fff',
      };

    constructor(props) {
        super(props);
        this.state = {
            supported: true,
            enabled: false,
            isWriting: false,
            urlToWrite: 'https://www.google.com',
            rtdType: RtdType.URL,
            tag: {},
            treamentPlan: [],
        }
    }

    componentDidUpdate(prevProps) {
        const {
            isFocused
        } = this.props;

        const {
            isFocused: prevIsFocused
        } = prevProps;

        if(isFocused !== prevIsFocused){
            isFocused 
                ? this.startDetection()
                : this.stopDetection()
        }
    }

    componentDidMount() {
        NfcManager.isSupported()
            .then(supported => {
                this.setState({ supported });
                if (supported) {
                    this.startNfc();
                }
            })            
    }

    componentWillUnmount() {
        console.log("unmount")
        this.stopDetection();
        if (this._stateChangedSubscription) {
            this._stateChangedSubscription.remove();
        }
    }

    render() {
        let { tag, isWriting, urlToWrite, parsedText, rtdType } = this.state;
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20  }}>
                <Image 
                    source={require('../images/nfc.png')} 
                    style={{ width: 150, height: 150, marginBottom: 20 }}
                />
                <View style={{margin: 20, }}>
                    <Text style={{fontSize: 18, textAlign: 'center'}}>
                        Pridėkite mobilųjį įrenginį prie paciento ALR žymos
                    </Text>
                </View>
            </View>
        )
    }

    startNfc() {
        NfcManager.start()
            .then(this.startDetection)
            .catch(error => {
                console.warn('start fail', error);
                this.setState({supported: false});
            })

        if (Platform.OS === 'android') {
            NfcManager.getLaunchTagEvent()
                .then(tag => {
                    console.log('launch tag', tag);
                    if (tag) {
                        this.setState({ tag });
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            NfcManager.isEnabled()
                .then(enabled => {
                    this.setState({ enabled });
                })
                .catch(err => {
                    console.log(err);
                })
            NfcManager.onStateChanged(
                event => {
                    if (event.state === 'on') {
                        this.setState({enabled: true});
                    } else if (event.state === 'off') {
                        this.setState({enabled: false});
                    } else if (event.state === 'turning_on') {
                        // do whatever you want
                    } else if (event.state === 'turning_off') {
                        // do whatever you want
                    }
                }
            )
                .then(sub => {this._stateChangedSubscription = sub})
                .catch(err => {
                    console.warn(err);
                })
        }
    }

    onTagDiscovered = tag => {
        const {
            navigation: {
                navigate
            }
        } = this.props;

        const nfcData = JSON.parse(this.parseText(tag))
        
        if(nfcData.type === "patient"){
            api.get(`/treatment/${nfcData.data.id}`)
            .then(res => {
                this.setState({
                    treamentPlan: res.data.treatmentPlan,
                }, () => {
                    console.log( res.data.treatmentPlan)
                    navigate('Menu', { 
                        treatmentPlan: res.data.treatmentPlan,
                        patientId: nfcData.data.id,
                     })
                })
            })
            .catch(error => {
                console.warn('treatment plan fail', error)
            })
        }
        
        
        this.setState({ tag });
        this.setState({parsedText: nfcData});
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
}

const Home = withNavigationFocus(HomeScreenComponent);

export { Home }