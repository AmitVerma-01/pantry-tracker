import { useState, useEffect } from "react";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/common/Toast";
import LoadingSpinner from "../components/common/LoadingSpinner";
import GoogleButton from "../components/GoogleButton";
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
    <div className="page-bg w-full py-8 md:py-12 flex justify-center items-center px-4">
      <div className="w-full max-w-md card-elevated p-6 md:p-8 animate-scale-in">
        <div className="text-center mb-8">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-c4 to-c5 text-2xl shadow-soft mb-4">✨</span>
          <h1 className="text-3xl font-extrabold text-ink tracking-tight">Create account</h1>
          <p className="text-ink-muted mt-1.5 text-sm">Start tracking your pantry today</p>
        </div>
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
            className="btn-primary w-full !py-3 text-base mt-2"
            disabled={isSubmitting || authLoading}
          >
            {isSubmitting ? (
              <LoadingSpinner variant="button" size="sm" text="Signing up..." />
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-c3" />
          <span className="text-ink-faint text-sm">or</span>
          <div className="flex-1 h-px bg-c3" />
        </div>

        <GoogleButton label="Sign up with Google" />

        <p className="text-ink-muted text-center mt-6 text-sm">
          Already have an account?{' '}
          <NavLink to="/signin" className="link-accent">
            Sign In
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Signup;
