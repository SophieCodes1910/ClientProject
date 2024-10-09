import React from "react";
import {ErrorBoundary} from "react-error-boundary";

const ErrorFallback = ({error, resetErrorBoundary}) => {
    return (
        <div role="alert">
            <p>:Server not working</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
};

export const MyErrorBoundary = ({children}) => {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {

                // reset the state of your app here if needed


            }}
        >
            {children}
        </ErrorBoundary>
    );
};
