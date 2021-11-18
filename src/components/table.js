import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { deleteExpense, editExpense, getCurrentExchange } from '../actions/index';
import './table.css';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.editButtonShouldExist = this.editButtonShouldExist.bind(this);
    this.renderExpensesTable = this.renderExpensesTable.bind(this);
    this.handleDeleteExpense = this.handleDeleteExpense.bind(this);
    this.handleEditExpense = this.handleEditExpense.bind(this);
    this.deleteButtonShouldExist = this.deleteButtonShouldExist.bind(this);
  }

  handleDeleteExpense(id) {
    const { deleteExpenseAction } = this.props;
    deleteExpenseAction(id);
  }

  handleEditExpense(expense) {
    const { editExpenseAction, getCurrentExchangeAction } = this.props;
    editExpenseAction(expense);
    getCurrentExchangeAction(expense.exchangeRates);
  }

  deleteButtonShouldExist(expense) {
    const { editMode } = this.props;
    if (!editMode) {
      return (
        <button
          type="button"
          onClick={ () => this.handleDeleteExpense(expense.id) }
          data-testid="delete-btn"
          className="delete-btn"
        >
          {' '}
          Deletar
          {' '}
        </button>);
    }
  }

  editButtonShouldExist(expense) {
    const { editMode } = this.props;
    if (!editMode) {
      return (
        <button
          type="button"
          data-testid="edit-btn"
          onClick={ () => this.handleEditExpense(expense) }
          className="edit-btn"
        >
          Edit
        </button>);
    }
  }

  renderExpensesTable() {
    const { getWalletState } = this.props;
    return getWalletState.map((expense) => {
      let getCurrency = expense.exchangeRates[expense.currency];
      const getAsk = expense.exchangeRates[expense.currency];
      let ask = '';
      let value = Number.parseFloat(expense.value);
      let rawAsk = '';
      ask = getAsk.ask * 100;
      rawAsk = getAsk.ask;
      ask = (Math.round(ask) / 100).toFixed(2);
      value *= Number.parseFloat(rawAsk);
      value = (Math.round(value * 100) / 100);
      getCurrency = [getCurrency.name.split('/')[0]]; // array destructuring
      return (
        <tr key={ expense.id }>
          <td>{expense.description}</td>
          <td>{expense.tag}</td>
          <td>{expense.method}</td>
          <td>{expense.value}</td>
          <td>{getCurrency}</td>
          <td>{ask}</td>
          <td>{value}</td>
          <td>Real</td>
          <td>
            { this.deleteButtonShouldExist(expense) }
            { this.editButtonShouldExist(expense)}
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Tag</th>
            <th>Método de pagamento</th>
            <th>Valor</th>
            <th>Moeda</th>
            <th>Câmbio utilizado</th>
            <th>Valor convertido</th>
            <th>Moeda de conversão</th>
            <th>Editar/Excluir</th>
          </tr>
        </thead>
        <tbody>{this.renderExpensesTable()}</tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => ({
  getWalletState: state.wallet.expenses,
  storeCurrencies: state.wallet.currencies,
  editIndex: state.wallet.editIndex,
  editMode: state.wallet.editMode,
});

const mapDispatchToProps = (dispatch) => ({
  deleteExpenseAction: (id) => dispatch(deleteExpense(id)),
  editExpenseAction: (id) => dispatch(editExpense(id)),
  getCurrentExchangeAction: (coins) => dispatch(getCurrentExchange(coins)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Table);

Table.propTypes = {
  deleteExpenseAction: PropTypes.func.isRequired,
  getWalletState: PropTypes.arrayOf(
    PropTypes.shape({
      currency: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      exchangeRates: PropTypes.objectOf.isRequired,
      id: PropTypes.number.isRequired,
      method: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  editExpenseAction: PropTypes.func.isRequired,
  getCurrentExchangeAction: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
};
