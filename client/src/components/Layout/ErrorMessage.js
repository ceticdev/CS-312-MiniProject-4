const ErrorMessage = ({ errors }) => {
  if (!errors || errors.filter(e => e).length === 0) return null;

  const validErrors = errors.filter(e => e);

  return (
    <div className="error-messages">
      {validErrors.length > 1 && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>Please fix the following errors:</p>
      )}
      <ul style={{ color: 'red', paddingLeft: validErrors.length > 1 ? '20px' : '0', listStyle: validErrors.length > 1 ? 'disc' : 'none' }}>
        {validErrors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorMessage;