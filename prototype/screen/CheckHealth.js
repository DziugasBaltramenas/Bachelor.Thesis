import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import {  List, ListItem, Text, Left, Right, Icon, Form, Item, Input, Body } from 'native-base';
import { Button, Icon as NativeIcon } from 'react-native-elements';

import { api } from '.././axios';

export  class CheckHealth extends Component {
    static navigationOptions = {
        headerStyle: {
          backgroundColor: '#517fa4',
        },
        headerTintColor: '#fff',
      };

    constructor(props) {
        super(props);

        this.state = {
            selectedType: null,
            values: {},
            error: false,
        }
    }

    render() {
        const {
            selectedType
        } = this.state;

        return selectedType
            ? this.renderForm(selectedType)
            : this.renderList()
    }

    renderList = () => {
        const {
            values
        } = this.state;

        const {
            navigation
        } = this.props;

        const treatmentPlan = navigation.getParam('treatmentPlan');
        
        return (
            <View style={{flex: 1, justifyContent: 'space-evenly', padding: 20}}>
                <View>
                    <List>
                        {treatmentPlan.map((type) => (
                            <ListItem icon  key={type.title} onPress={() => this.handleSelect(type.title)}>
                                { values[type.title] && values[type.title] !== "" &&
                                    <Left>
                                        <NativeIcon name="check-circle" color="green" />
                                    </Left>
                                }
                                <Body>
                                    <Text>{`${type.title} ${values[type.title] && values[type.title] !== "" ? values[type.title] + ' ' + type.postfix : ''}`}</Text>
                                </Body>
                                <Right>
                                    <Icon name="arrow-forward" />
                                </Right>
                            </ListItem>
                        ))}
                    </List>
                </View>

                <View style={{marginTop: 40, flex: 1, flexDirection: 'row' ,justifyContent: 'space-between', alignItems: 'flex-end'}}>
                    <Button 
                        title="Atšaukti"
                        buttonStyle={{height: 40, width: 150, backgroundColor: 'red'}}
                        titleStyle={{fontSize: 24}}
                        onPress={() => navigation.goBack()}
                    />
                    <Button
                        title="Saugoti"
                        buttonStyle={{height: 40, width: 150, backgroundColor: "#517fa4"}}
                        titleStyle={{fontSize: 24}}
                        onPress={this.saveEhr}
                    />
                </View>  
            </View>
        )
    }

    renderForm = (type) => {
        const {
            error,
            values
        } = this.state;

        return (
            <View style={{flex: 1, justifyContent: 'space-evenly', padding: 20}}>
                <View>
                    <Form style={{marginTop: -50}}>
                        <Item regular error={error}>
                            <Input
                                placeholder={type}
                                onChangeText={(value) => this.handleInputChange(value, type)}
                                defaultValue={values[type]}
                                keyboardType="phone-pad"
                            />
                        </Item>
                    </Form>
                    <View style={{marginTop: 50, flex: 1, flexDirection: 'row' ,justifyContent: 'space-between'}}>
                        <Button 
                            title="Atšaukti"
                            buttonStyle={{height: 40, width: 150, backgroundColor: 'red'}}
                            titleStyle={{fontSize: 24}}
                            onPress={() => this.handleSelect(null)}
                        />
                        <Button
                            title="Patvirtinti"
                            buttonStyle={{height: 40, width: 150, backgroundColor: "#517fa4"}}
                            titleStyle={{fontSize: 24}}
                            onPress={() => this.handleSubmit(type)}
                        />
                    </View>  
                </View>
            </View>
        )
    }

    handleSelect = (type) => {
        this.setState({
            selectedType: type
        })
    }

    handleInputChange = (value, type) => {
        this.setState({
            values: {
                ...this.state.values,
                [type]: value
            },
            error: false,
        });
    }

    handleSubmit = (type) => {
        const {
            values
        } = this.state;

        if(!values[type] || values[type] === ""){
            this.setState({
                error: true,
            })
        } else {
            this.handleSelect(null);
        }
    } 

    saveEhr = () => {
        const {
            values
        } = this.state;

        const {
            navigation
        } = this.props;

        const patientId = navigation.getParam('patientId');

        const ehrs = Object.keys(values).map(key => ({
            title: key,
            value: values[key],
        }))

        api.post(`/ehr/${patientId}`, { ehrs })
            .then(() => {
                Alert.alert('Išsaugota', 'Paciento būklę užfiksuota')
                navigation.popToTop();
            })
            .catch(error => {
                console.warn('ehr save fail', error);
            })
    }
}