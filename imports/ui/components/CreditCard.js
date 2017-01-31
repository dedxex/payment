import React from 'react';
import Payment from 'payment';
import { Row, Col, FormGroup, ControlLabel, Button, Alert } from 'react-bootstrap';
import { Bert } from 'meteor/themeteorchef:bert';
import { getStripeToken } from '../../modules/get-stripe-token.js';
import { Meteor } from 'meteor/meteor';
import {Link,browserHistory} from 'react-router';

export class CreditCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: null,
      exp_month: null,
      exp_year: null,
      cvc: null,
      token: null,
      numberError : '',
      expirationError : '',
      cvcError : ''

    };
    this.setCardType = this.setCardType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetCard = this.resetCard.bind(this);
  }

  resetCard() {
    this.setState({ number: null, exp_month: null, exp_year: null, cvc: null, token: null });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.resetCard();

    const { refs } = this;
    const number = refs.number.value;
    if(!number){
      this.setState({ numberError : 'CreditCard number is required' });
    }
    const expiration = refs.expiration.value.split('/');
    if(!(refs.expiration.value)){
      this.setState({ expirationError : 'Expiry Date is required' });
    }
    const exp_month = parseInt(expiration[0], 10);
    if(!exp_month){
      this.setState({ expirationError : 'ExpiryDate is required' });
    }
    const exp_year = parseInt(expiration[1], 10);
    if(!exp_year){
      this.setState({ expirationError : 'ExpiryDate is required' });
    }
    const cvc = refs.cvc.value;
    if(!cvc){
      this.setState({ cvcError : "cvc number is required " });
    }
    if(cvc && refs.expiration.value && number){
      console.log("validation is okay");
      const card = { number, exp_month, exp_year, cvc };
    getStripeToken(card)
    .then((token) => {
      console.log("got the token",token);
      card.token = token;
      Meteor.call('tokens.insert',token);
      browserHistory.push('/thankyou');
      this.setState(card);
    }).catch((error) => {
      console.log("token not got",error);
      Bert.alert(error, 'danger');
    });
    }
  }

  setCardType(event) {
    const type = Payment.fns.cardType(event.target.value);
    const cards = document.querySelectorAll('[data-brand]');

    [].forEach.call(cards, (element) => {
      if (element.getAttribute('data-brand') === type) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
  }

  renderCardList() {
    return (<ul className="credit-card-list clearfix">
      <li><i data-brand="visa" className="fa fa-cc-visa"></i></li>
      <li><i data-brand="amex" className="fa fa-cc-amex"></i></li>
      <li><i data-brand="mastercard" className="fa fa-cc-mastercard"></i></li>
      <li><i data-brand="jcb" className="fa fa-cc-jcb"></i></li>
      <li><i data-brand="discover" className="fa fa-cc-discover"></i></li>
      <li><i data-brand="dinersclub" className="fa fa-cc-diners-club"></i></li>
    </ul>);
  }
  NumberChanged() {
    this.setState({ numberError : '' });
  }
  ExpiryChanged(){
    this.setState({ expirationError : '' });
  }
  CvcChanged() {
    this.setState({ cvcError : '' });
  }

  renderCardForm() {
    return (<form className="CardForm" onSubmit={ this.handleSubmit }>
      <Row>
        <Col xs={ 12 }>
          <FormGroup>
            <ControlLabel>Card Number</ControlLabel>
            <input
              onKeyUp={ this.setCardType }
              className="form-control"
              type="text"
              ref="number"
              onChange={this.NumberChanged.bind(this)}
              placeholder="Card Number"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col xs={ 6 } sm={ 5 }>
          <FormGroup>
            <ControlLabel>Expiration</ControlLabel>
            <input
              className="form-control text-center"
              type="text"
              ref="expiration"
              onChange={this.ExpiryChanged.bind(this)}
              placeholder="MM/YYYY"
            />
          </FormGroup>
        </Col>
        <Col xs={ 6 } sm={ 4 } smOffset={ 3 }>
          <FormGroup>
            <ControlLabel>CVC</ControlLabel>
            <input
              className="form-control text-center"
              type="text"
              ref="cvc"
              onChange={this.CvcChanged.bind(this)}
              placeholder="CVC"
            />
          </FormGroup>
        </Col>
      </Row>
      <Button type="submit" bsStyle="success" block>Generate Token</Button>
    </form>);
  }

  renderCard() {
    const { number, exp_month, exp_year, cvc, token } = this.state;
    return number ? (<Alert bsStyle="info">
      <h5>{ number }</h5>
      <p className="exp-cvc">
        <span>{ exp_month }/{ exp_year }</span>
        <span>{ cvc }</span>
      </p>
      <em>{ token }</em>
    </Alert>) : '';
  }

  componentDidMount() {
    const { number, expiration, cvc } = this.refs;
    Payment.formatCardNumber(number);
    Payment.formatCardExpiry(expiration);
    Payment.formatCardCVC(cvc);
  }
  renderErrors() {
    return (
      <div>
        <div>
        {this.state.numberError}
      </div>
      <div>
        {this.state.expirationError}
      </div>
      <div>
        {this.state.cvcError}
      </div>
      </div>
    );
  }

  render() {
    return (<div className="CreditCard">
      { this.renderCardList() }
      { this.renderCardForm() }
      { this.renderCard() }
      {this.renderErrors()}
    </div>);
  }
}

CreditCard.propTypes = {};
