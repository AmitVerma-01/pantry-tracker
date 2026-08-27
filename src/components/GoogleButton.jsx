import { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "./common/Toast";
import LoadingSpinner from "./common/LoadingSpinner";

const GoogleButton = ({ label = "Continue with Google" }) => {
  const { signInWithGoogle, loading } = useAuth();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      toast.error(err.message || "Google sign-in failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || loading;

  return (
    <button
      type="button"
      className="btn-secondary w-full !py-3 gap-3"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      aria-label={label}
    >
      {isLoading ? (
        <LoadingSpinner variant="button" size="sm" text="Signing in..." />
      ) : (
        <>
          <img src="google.png" alt="" className="w-5 h-5" />
          {label}
        </>
      )}
    </button>
  );
};

GoogleButton.propTypes = {
  label: PropTypes.string
};

export default GoogleButton;
