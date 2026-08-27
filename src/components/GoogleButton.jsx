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
      className="p-3 bg-white border-2 border-c3 w-full rounded-lg shadow-md hover:bg-c1 hover:shadow-lg font-semibold flex justify-center gap-x-3 items-center transition-smooth disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      aria-label={label}
    >
      {isLoading ? (
        <LoadingSpinner variant="button" size="sm" text="Signing in..." />
      ) : (
        <>
          {label}
          <img src="google.png" alt="Google logo" className="w-5 h-5" />
        </>
      )}
    </button>
  );
};

GoogleButton.propTypes = {
  label: PropTypes.string
};

export default GoogleButton;
