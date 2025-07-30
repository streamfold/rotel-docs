import React from 'react';
import Layout from '@theme/Layout';
import styles from './about.module.css';

export default function About(): JSX.Element {
  return (
    <Layout
      title="About Rotel"
      description="Learn about Rotel and the team behind it">
      <div className={styles.aboutContainer}>
        <div className={styles.heroSection}>
          <h1>🌶️<br/>About Rotel</h1>
          <p className={styles.mission}>
            Rotel is on a mission to create the most resource efficient, high performance collection data plane for OpenTelemetry. 
            We believe that observability should be accessible to everyone without compromising on performance. 
            Rotel ensures minimal resource usage while maintaining the highest standards of reliability and performance.
          </p>
        </div>

        <div className={styles.foundersSection}>
          <h2>Meet the Founders</h2>
          <div className={styles.foundersGrid}>
            <div className={styles.founderCard}>
              <img 
                src="/img/rjenkins.jpg" 
                alt="Ray - Founder" 
                className={styles.founderImage}
              />
              <h3>Ray</h3>
              <p className={styles.founderTitle}>Founder</p>
              <div className={styles.founderBio}>
                <p>
                  Ray is a veteran distributed systems engineer with three decades of experience building fault-tolerant, scalable infrastructure. 
                  He specializes in stream processing, large-scale databases, and observability systems that handle billions of events daily.
                </p>
                <p>
                  Previously, Ray held senior engineering and leadership roles at Segment, Snowflake, Librato, and IBM, 
                  where he led teams through hypergrowth phases and architected critical infrastructure for data processing and observability platforms.
                </p>
              </div>
            </div>
            
            <div className={styles.founderCard}>
              <img 
                src="/img/mheffner.jpg" 
                alt="Mike - Founder" 
                className={styles.founderImage}
              />
              <h3>Mike</h3>
              <p className={styles.founderTitle}>Founder</p>
              <div className={styles.founderBio}>
                <p>
                  Mike is a veteran systems engineer with over two decades of experience building high-performance infrastructure for observability and telemetry. 
                  He specializes in distributed systems, stream processing, and high-scale observability systems.
                </p>
                <p>
                  Previously, Mike held senior engineering and leadership roles at Librato and Netlify, where he architected critical infrastructure 
                  and data pipelines. His deep expertise in OpenTelemetry and modern observability practices drives his mission to make 
                  monitoring infrastructure more accessible and resource-efficient.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.investorsSection}>
          <h2>Our Investors</h2>
          <div className={styles.investorsGrid}>
            <div className={styles.investorItem}>
              <a href="https://www.heavybit.com/" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/img/heavybit.png" 
                  alt="Heavybit" 
                  className={styles.investorLogo}
                />
              </a>
            </div>
            <div className={styles.investorItem}>
              <a href="https://uncorkcapital.com/" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/img/uncork.png" 
                  alt="Uncork Capital" 
                  className={styles.investorLogo}
                />
              </a>
            </div>
            <div className={styles.investorItem}>
              <a href="https://www.essencevc.fund/" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/img/essence.png" 
                  alt="Essence VC" 
                  className={styles.investorLogo}
                />
              </a>
            </div>
            <div className={styles.investorItem}>
              <a href="https://sunflowercapital.co/" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/img/sunflower.png" 
                  alt="Sunflower Ventures" 
                  className={styles.investorLogo}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}