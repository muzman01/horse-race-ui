import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary: ", error, errorInfo);
  }

  handleRetry = () => {
    // Reset error state and reload the page
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-center p-4">
          <div className="max-w-sm">
            <div className="text-6xl mb-4 text-[#c25918]">⚠️</div>
            <h1 className="text-2xl font-bold mb-2">Oops! An Error Occurred</h1>
            <p className="text-gray-300 mb-6">
              It seems something unexpected happened. Please try again.
            </p>
            <button
              onClick={this.handleRetry}
              className="bg-[#c25918] hover:bg-[#c25918] text-gray-900 font-semibold py-2 px-4 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
