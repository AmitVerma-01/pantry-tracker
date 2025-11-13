import { useState, useEffect } from "react";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/common/Toast";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { NavLink, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validation";
import { formatAuthError } from "../utils/errorHandler";
import { SUCCESS_MESSAGES } from "../utils/constants";

const Signup = () => {
  const { user, signUp, loading: authLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Real-time email validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (touched.email) {
      const validation = validateEmail(value);
      setEmailError(validation.error || '');
    }
  };

  // Real-time password validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    if (touched.password) {
      const validation = validatePassword(value);
      setPasswordError(validation.error || '');
    }
  };

  // Handle field blur to mark as touched
  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    const validation = validateEmail(email);
    setEmailError(validation.error || '');
  };

  const handlePasswordBlur = () => {
    setTouched(prev => ({ ...prev, password: true }));
    const validation = validatePassword(password);
    setPasswordError(validation.error || '');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate all fields
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation.error || '');
    setPasswordError(passwordValidation.error || '');

    // Check if there are any validation errors
    if (!emailValidation.isValid || !passwordValidation.isValid) {
      return;
    }

    // Check if full name is provided
    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp(email, password);
      toast.success(SUCCESS_MESSAGES.AUTH.SIGNUP);
      navigate('/');
    } catch (error) {
      const errorMessage = formatAuthError(error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full py-6 md:py-10 flex justify-center items-center bg-gradient-to-br from-c1 to-c2 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 md:p-8 animate-scale-in">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">Sign Up</h1>
        <form onSubmit={handleSignUp} className="flex flex-col gap-y-4">
          <div className="transition-smooth">
            <Input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              type="text"
              id="fullname"
              label="Full Name"
              placeholder="Amit Verma"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="transition-smooth">
            <Input
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              value={email}
              type="email"
              id="email"
              label="Email"
              placeholder="example@xyz.com"
              disabled={isSubmitting}
            />
            {emailError && (
              <p className="text-red-600 text-sm mt-1 ml-1 animate-slide-down">{emailError}</p>
            )}
          </div>

          <div className="transition-smooth">
            <PasswordInput
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              value={password}
              disabled={isSubmitting}
            />
            {passwordError && (
              <p className="text-red-600 text-sm mt-1 ml-1 animate-slide-down">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="p-3 bg-c4 w-full rounded-lg mt-4 shadow-lg hover:bg-opacity-90 hover:shadow-xl text-lg md:text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-smooth hover-lift active:scale-95 text-white"
            disabled={isSubmitting || authLoading}
          >
            {isSubmitting ? (
              <LoadingSpinner variant="button" size="sm" text="Signing up..." />
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="text-gray-600 text-center my-4 md:my-6 text-sm md:text-base">
          Already have an account?{' '}
          <NavLink to="/signin" className="text-c4 font-semibold hover:underline transition-all">
            Sign In
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Signup;
