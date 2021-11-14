import React from 'react';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import Form from '../components/form';
import Header from '../components/header';
import Table from '../components/table';

class Wallet extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Header />
          <main>
            <Form />
            <Table />
          </main>
        </div>
      </div>
    );
  }
}

export default Wallet;
