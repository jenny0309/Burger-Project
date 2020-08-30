import React, { Component } from 'react'
import { connect } from 'react-redux'

import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'
import classes from './ContactData.module.css'
import axios from '../../../axios-orders'
import Input from '../../../components/UI/Input/Input'

class ContactData extends Component {
    state = {
        // Set Up for Form Validation
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}                    
                    ]
                },
                value: 'fastest', // if it remains empty string like other state variables, the browser sends empty data to the server!
                valid: true
                // validation: {} // if empty validation, it returns undefined and fixes the error!
            }
        },
        formIsValid: false,
        loading: false
    }

    // send ingredients data as JSON
    orderHandler = (event) => {
        event.preventDefault();
        // console.log(this.props.ingredients);
        this.setState({loading: true});
        const formData = {}
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData
        }
        axios.post('/orders.json', order) // orders: table name <- baseURL is set on axios-orders.js
            .then(response => {
                this.setState({loading: false});
                this.props.history.push('/'); // redirect to the home page after ordering
            })
            .catch(error => {
                this.setState({loading: false});
            });
    }

    checkValidity(value, rules) {
        let isValid = true

        // always returns true when there's no validation rules on the state
        if (!rules) {
            return true
        }

        if (rules.required) {
            isValid = value.trim() !== '' && isValid // true or false
        }

        // other validation rules can be created like this!
        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid // add "&& isValid" because isValid only applies the last rules!
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }

        return isValid
    }

    inputChangedHandler = (event, inputIdentifier) => {
        // console.log(event.target.value) // event.target.value <- get input value from the text field on the browser!
        const updatedOrderForm = {
            ...this.state.orderForm
        }
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        }
        updatedFormElement.value = event.target.value
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
        updatedFormElement.touched = true
        updatedOrderForm[inputIdentifier] = updatedFormElement
        // console.log(updatedFormElement) // valid becomes true when typing values on the input field!

        let formIsValid = true
        for (let inputIdentifiers in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifiers].valid && formIsValid
        }
        // console.log(formIsValid) // becomes true when all inputs are valid

        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid})
    }

    render () {
        const formElementsArray = []
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {/* make Input tags dynamically with map() */}
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                    />
                ))}
                <Button 
                    btnType="Success"
                    clicked={this.orderHandler}
                    disabled={!this.state.formIsValid}
                >ORDER</Button>
            </form>
        )
        if (this.state.loading) {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

export default connect(mapStateToProps)(ContactData)