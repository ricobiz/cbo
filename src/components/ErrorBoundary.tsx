
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to monitoring service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, componentName } = this.props;

    if (hasError) {
      // Custom fallback UI if provided
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800">
              <AlertTriangle className="mr-2 h-5 w-5" />
              {componentName ? `Error in ${componentName}` : "Something went wrong"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-red-800">
            <p className="font-medium mb-2">This component encountered an error.</p>
            {process.env.NODE_ENV !== "production" && (
              <div className="mt-4">
                <p className="font-mono text-xs">{error?.toString()}</p>
                {errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer">Stack trace</summary>
                    <pre className="mt-2 text-xs overflow-auto max-h-[300px] p-2 bg-red-100 rounded">
                      {errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={this.resetError} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
