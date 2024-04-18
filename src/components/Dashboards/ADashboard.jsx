import React from "react";
import styles from "./AdminDashboard.module.css"; // Import the CSS module

function AdminDashboard() {
  return (
    <div className={styles.dashboardContainer}>
      <img
        className={styles.logo}
        loading="lazy"
        src="/components/VERIGYLogo.jpg" // Add your logo URL here
        alt="DashboardLogo"
      />
      <button className={styles.button}>Dashboard</button>
      <button className={styles.button}>Edit Quiz</button>
      <button className={styles.button}>Clinicians</button>
      <button className={styles.button}>Statistics</button>
      <button className={styles.button}>Settings</button>
    </div>
  );
}

export default AdminDashboard;
