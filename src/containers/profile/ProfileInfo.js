import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import RatingBar from './RatingBar';
import Stats from '../../components/Stats';
import ContractSettings from './ContractSettings';
import SendRequestBlock from './SendRequestBlock';
import { FormattedMessage } from 'react-intl';

class ProfileInfo extends React.Component {

  getHeader() {
    return (
      <Row className="justify-content-center">
        <Col xs="12" className="text-center align-middle info-screen-title title-text">
          @{this.props.profile.name}
        </Col>
      </Row>
    );
  }

  getHeaderSeparator() {
    return (
      <Row className="justify-content-center">
        <Col md="12" lg="12" xl="12" style={{display: (this.props.profile.available ? 'block' : 'none')}} className="accept-request-title-block">
          <div className="accept-request-title-text">
            <FormattedMessage
              id="profile.acceptingRequests"
              defaultMessage="accepting requests"
            />
          </div>
        </Col>
        <Col md="12" lg="12" xl="12" style={{display: (!this.props.profile.available ? 'block' : 'none')}}  className="no-accept-request-title-block">
          <div className="no-accept-request-title-text">
            <FormattedMessage
              id="profile.notAcceptingRequests"
              defaultMessage="not Accepting requests"
            />
          </div>
        </Col>
      </Row>
    );
  }

  render() {
    const profile = this.props.profile;
    const contractSettings = profile.contractSettings;
    if(this.props.own) {
      return (
        <Col xs="12" md="auto" sm="12" className="item-screen info-screen contract-block">
          <Container fluid>
            <Row className="justify-content-center">
              <Col xs="12">
                {this.getHeader()}
                {this.getHeaderSeparator()}
                {/*<RatingBar rating={0}/>*/}
                <Stats
                  traderRating={profile.topTraders}
                  investorRating={profile.topInvesters}
                  roiInBTC={profile.roiInBTC}
                  roiInUSD={profile.roiInUSD}
                  totalInBTC={profile.totalInBTC}
                  totalInUSDT={profile.totalInUSDT}
                />
                <ContractSettings
                  onSaveChangesClick={this.props.onSaveChangesClick}
                  onToggleClick={this.props.onToggleClick}
                  duration={contractSettings.duration}
                  amount={contractSettings.minAmount}
                  currency={contractSettings.currency}
                  maxLoss={contractSettings.maxLoss}
                  roiInBTC={profile.roiInBTC}
                  roiInUSD={profile.roiInUSD}
                  fee={contractSettings.fee}
                  availableForOffers={profile.available}
                  roi={contractSettings.roi}
                />
              </Col>
            </Row>
          </Container>
        </Col>
      );
    } else {
      return (
        <Col xs="12" md="auto" sm="12" className="item-screen info-screen contract-block">
          <Container fluid>
            <Row className="justify-content-center">
              <Col xs="12">
                {this.getHeader()}
                {this.getHeaderSeparator()}
                <RatingBar rating={0}/>
                <Stats
                  traderRating={profile.topTraders}
                  investorRating={profile.topInvesters}
                  roi={15}
                  roiInBTC={profile.roiInBTC}
                  roiInUSD={profile.roiInUSD}                        
                  totalInBTC={profile.totalInBTC}
                  totalInUSDT={profile.totalInUSDT}
                />
                <SendRequestBlock profile={profile} />
              </Col>
            </Row>
          </Container>
        </Col>
      );
    }
  }
}


export default ProfileInfo;
