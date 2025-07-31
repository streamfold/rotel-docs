import React from 'react';
import Layout from '@theme/Layout';
import styles from './about.module.css';

export default function About(): JSX.Element {
  return (
    <Layout
      title="About Streamfold: The team behind Rotel"
      description="Learn about Streamfold and the team behind Rotel">
      <div className={styles.aboutContainer}>
        <div className={styles.heroSection}>
          <h1>🌶️<br/>About Streamfold: The team behind Rotel</h1>
          <p className={styles.mission}>
            Streamfold is on a mission to create the most resource efficient, high performance collection data plane for OpenTelemetry. 
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
              <h3>Ray Jenkins</h3>
              <div className={styles.founderBio}>
                <p>
                  Ray is a veteran distributed systems engineer with three decades of experience building fault-tolerant, scalable infrastructure. 
                  He specializes in stream processing, large-scale distributed databases, and high-scale observability systems.
                </p>
                <p>
                  Previously, Ray held senior engineering and leadership roles at Segment, Snowflake, Librato, and IBM, 
                  where he led teams through hypergrowth phases and architected critical infrastructure for data processing and observability platforms.
                </p>
              </div>
              <div className={styles.socialLinks}>
                <a href="https://github.com/rjenkins" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/ray-jenkins-2186819/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>
                <a href="https://x.com/_rayjenkins" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://bsky.app/profile/ramond.bsky.social" target="_blank" rel="noopener noreferrer" aria-label="Bluesky">
                  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 01-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className={styles.founderCard}>
              <img 
                src="/img/mheffner.jpg" 
                alt="Mike - Founder" 
                className={styles.founderImage}
              />
              <h3>Mike Heffner</h3>
              <div className={styles.founderBio}>
                <p>
                  Mike is an accomplished systems engineer with over two decades of experience building high-performance infrastructure for observability and telemetry. 
                  He specializes in distributed systems, stream processing, and high-scale observability systems.
                </p>
                <p>
                  Previously, Mike held senior engineering and leadership roles at Librato and Netlify, where he architected critical infrastructure 
                  and data pipelines. His deep expertise in modern observability practices drives his mission to make 
                  monitoring more accessible and resource-efficient.
                </p>
              </div>
              <div className={styles.socialLinks}>
                <a href="https://github.com/mheffner" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/mike-heffner/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>
                <a href="https://x.com/mheffner" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://bsky.app/profile/mike.heffner.io" target="_blank" rel="noopener noreferrer" aria-label="Bluesky">
                  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 01-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/>
                  </svg>
                </a>
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
