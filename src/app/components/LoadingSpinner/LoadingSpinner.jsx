import React from "react";
import styles from './styles.module.scss'

const LoadingSpinner = () => {
  return (
    <div className={styles.spinner_container}>
        <p>Loading ...</p>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LoadingSpinner;