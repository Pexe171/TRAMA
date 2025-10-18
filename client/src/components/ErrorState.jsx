import PropTypes from 'prop-types';
import { formatErrorMessage } from '../utils/format';

const ErrorState = ({
  title = 'Ops! Algo deu errado.',
  message,
  error,
  onRetry,
  compact = false,
}) => (
  <div className={`error-state${compact ? ' error-state--compact' : ''}`} role="alert">
    <h3>{title}</h3>
    <p>{message || formatErrorMessage(error)}</p>
    {onRetry ? (
      <button type="button" className="primary-button" onClick={onRetry}>
        Tentar novamente
      </button>
    ) : null}
  </div>
);

ErrorState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onRetry: PropTypes.func,
  compact: PropTypes.bool,
};

export default ErrorState;
