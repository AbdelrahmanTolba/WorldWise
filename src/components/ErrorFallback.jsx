import React from "react";
import Button from "./Button";
import styles from "./ErrorFallback.module.css";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Somthing went wrong 🧐</h1>
        <p>{error.message}</p>
        <Button type="primary" onClick={resetErrorBoundary}>
          Try again
        </Button>
      </div>
    </div>
  );
}
export default ErrorFallback;
