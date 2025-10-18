import PropTypes from 'prop-types';

const LoadingState = ({ message = 'Carregando conteúdo...' }) => (
  <div className="loading-state" role="status" aria-live="polite">
    <span className="loading-spinner" aria-hidden="true" />
    <span>{message}</span>
  </div>
);

LoadingState.propTypes = {
  message: PropTypes.string,
};

export default LoadingState;
