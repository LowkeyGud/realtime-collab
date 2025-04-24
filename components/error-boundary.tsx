"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { type ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

const ErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resetErrorBoundary = () => {
    setHasError(false);
    setError(null);
    window.location.reload();
  };

  const handleError = (error: Error) => {
    setHasError(true);
    setError(error);
    console.error("Error caught by ErrorBoundary:", error);
    // You could also log to an error reporting service here
    // logErrorToService(error);
  };

  if (hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-4 max-w-md">
          {error?.message || "An unexpected error occurred"}
        </p>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </div>
    );
  }

  return (
    <ErrorBoundaryWrapper onError={handleError}>
      {children}
    </ErrorBoundaryWrapper>
  );
};

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  onError: (error: Error) => void;
}

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({
  children,
  onError,
}) => {
  try {
    return <>{children}</>;
  } catch (error) {
    if (error instanceof Error) {
      onError(error);
    }
    return null;
  }
};

export default ErrorBoundary;
