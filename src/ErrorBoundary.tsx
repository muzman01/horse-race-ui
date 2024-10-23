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
    // Bir hata olduğunda durumu güncelle
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Hata yakalandığında burada loglama yapabilirsiniz
    console.error("Error caught by ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI (Yedek kullanıcı arayüzü)
      return <h1>Bir hata oluştu.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
