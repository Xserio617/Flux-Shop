import React from 'react';
import styles from './LoadingWave.module.css';

export default function LoadingWave() {
  return (
    <div className={styles.container}>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
      <div className={styles.bar}></div>
    </div>
  );
}