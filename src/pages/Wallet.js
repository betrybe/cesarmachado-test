import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FormExpenses from '../components/form';
import Table from '../components/table';
import Icon from '../assets/header.png';
import './wallet.css';

class Wallet extends React.Component {
  constructor() {
    super();
    this.calculateTotal = this.calculateTotal.bind(this);
  }

  calculateTotal() {
    const { expensesList } = this.props;
    let total = 0;
    if (expensesList.length > 0) {
      total = expensesList.map((expense) => {
        const expenseNumber = Number.parseFloat(expense.value);
        const { ask } = (expense.exchangeRates[expense.currency]);
        total += (expenseNumber * ask) * 100;
        total = Math.round(total);
        return (total / 100);
      });
      total = total[total.length - 1];
    }
    return total;
  }

  render() {
    const { email, currentCurrency } = this.props;
    return (
      <>
        <header className="header-container">
          <img src={ Icon } alt="icon" width="200" height="70" />
          <div className="user">
            <p>Usuário:  </p>
            <span data-testid="email-field" className="span-user">
              {email}
            </span>
            <span data-testid="total-field">
              R$
              { this.calculateTotal() }
              <span data-testid="header-currency-field" className="span-currency">
                { currentCurrency }
              </span>
            </span>
          </div>
        </header>
        <FormExpenses />
        <Table />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.user.email,
  currentCurrency: state.wallet.currentCurrency,
  expensesList: state.wallet.expenses,
});

export default connect(mapStateToProps)(Wallet);

Wallet.propTypes = {
  email: PropTypes.string.isRequired,
  currentCurrency: PropTypes.string,
  expensesList: PropTypes.arrayOf(
    PropTypes.shape({
      currency: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      exchangeRates: PropTypes.objectOf.isRequired,
      id: PropTypes.number.isRequired,
      method: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

Wallet.defaultProps = {
  currentCurrency: null,
};
