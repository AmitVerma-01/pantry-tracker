import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-c1 to-c2 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-scale-in">
            <div className="mb-6 animate-pulse">
              <svg
                className="mx-auto h-20 w-20 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              We encountered an unexpected error. Please try reloading the page.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full bg-c4 hover:bg-c3 text-white font-bold py-3 px-4 rounded-lg transition-smooth hover:shadow-xl active:scale-95"
            >
              Reload Page
            </button>
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-c4 transition-colors">
                  Error Details (Development Only)
                </summary>
                <div className="mt-2 p-4 bg-gray-100 rounded-lg text-xs overflow-auto max-h-64">
                  <p className="font-semibold text-red-600 mb-2">
                    {this.state.error.toString()}
                  </p>
                  <pre className="text-gray-700 whitespace-pre-wrap">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
