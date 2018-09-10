import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

class RoundSelect extends React.Component {
  static propTypes = {
    onSelectClick: PropTypes.func,
    rounds: PropTypes.arrayOf(PropTypes.number),
  };

  static defaultProps = {
    rounds: [],
    onSelectClick: () => null,
  };


  render() {
    return (
      <div className="leaderboard__select-wrapper">
        <div className="leaderboard__select-value">
          {
            <FormattedMessage
              id="leaderboard.round"
              defaultMessage="Round {count}"
              values={{count: this.props.currentValue}}
            /> ||
            <FormattedMessage
              id="leaderboard.selectRound"
              defaultMessage="Place"
            />
          }
          <div className="leaderboard__select-value-bg" />
        </div>
        <div className="leaderboard__select-values-wrapper">
          <ul className="leaderboard__select-ul">
            {this.renderRound()}
          </ul>
        </div>
      </div>
    );
  }

  renderRound() {
    const {rounds, onSelectClick} = this.props;
    return rounds.map(round => (
      <li value={round}
        key={round}
        className="leaderboard__select-li upper"
        onClick={() => onSelectClick(round)}
      > <FormattedMessage
          id="leaderboard.round"
          defaultMessage="Round {count}"
          values={{count: round}}
        /></li>
    ));
  }

}

export default RoundSelect;