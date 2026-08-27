import PropTypes from 'prop-types';

const Input = ({type, label, id, placeholder, onChange, value, disabled, onBlur}) => {
  return (
    <div className="flex flex-col gap-y-1.5">
        <label htmlFor={id} className="font-semibold text-ink text-sm">{label}</label>
        <input 
          type={type} 
          id={id} 
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          disabled={disabled}
          className="input-field disabled:opacity-50 disabled:cursor-not-allowed" 
          placeholder={placeholder} 
          minLength={8}
        />
    </div>
  )
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onBlur: PropTypes.func
};

export default Input
