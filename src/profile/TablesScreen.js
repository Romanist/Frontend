import React from 'react';
import { Col, Row, Container } from 'reactstrap';
import ProfitChart from './ProfitChart';
import Feedback from './Feedback';
import CurrencySettings from './CurrencySettings';
import TradeHistory from './TradeHistory';

class TablesScreen extends React.Component {
  render() {
    return (
      <Col xs="12" sm="12" md className="item-screen table-screen">
        <Container fluid className="h-100">
          <Row className="justify-content-center h-100">
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
              <Container fluid className="h-custom-100">
                <Row className="table-row">
                  <ProfitChart trades={(this.props.profile.trades ? this.props.profile.trades.asTrader : []) || [] }
                    rates={this.props.rates}
                    dt={this.props.profile.dt}
                    tradesAsInvestor={(this.props.profile.trades ? this.props.profile.trades.asInvestor : []) || [] }
                  />
                  <Feedback
                    comments={this.props.profile.feedbacks || []}
                  />
                </Row>
                <Row className="d-none d-md-block">
                  <Col xs="12" className="gap-card"></Col>
                </Row>
                <Row className="table-row">
                  <CurrencySettings
                    own={this.props.own}
                    onCurrencyToggle={this.props.onCurrencyToggle}
                    currencies={this.props.profile.currencies}
                  />
                  <TradeHistory
                    trades={this.props.profile.trades || {asTrader: [], asInvestor:[]}}
                  />
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </Col>
    );
  }
}

export default TablesScreen;
