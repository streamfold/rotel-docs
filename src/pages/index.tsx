import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from "@site/src/components/CodeBlock";
import PrismCodeBlock from "@site/src/components/PrismCodeBlock";
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import BenchmarkChart from '@site/src/components/BenchmarkChart'; // Assuming BenchmarkChart props are typed in its own file

import styles from './index.module.css';

// Define types for Chart.js data structures
interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor: string | string[];
  borderWidth: number;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

// Define type for example repository items
interface ExampleRepo {
  title: string;
  description: string;
  link: string;
}

function HomepageHeader(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/"> {/* Updated to docs root */}
            Get Started - 5min ⏱️
          </Link>
          <Link
            className={clsx('button button--outline button--lg margin-left--md', styles.githubButton)}
            href="https://github.com/streamfold/rotel" // Main project repo
            target="_blank"
            rel="noopener noreferrer">
            View on GitHub <span aria-label="external link icon">↗️</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

// --- REPLACE WITH ACTUAL BENCHMARK DATA ---
const coldStartData: ChartData = {
  labels: ['Rotel Lambda', 'Collector A', 'Collector B'],
  datasets: [{
    label: 'Cold Start Time (ms) - Lower is Better',
    data: [30, 180, 250], // EXAMPLE DATA
    backgroundColor: 'rgba(227, 116, 0, 0.6)', // Rotel primary color, semi-transparent
    borderColor: 'rgb(227, 116, 0)',
    borderWidth: 1,
  }],
};

const memoryUsageData: ChartData = {
  labels: ['Rotel', 'Collector A', 'Collector B'],
  datasets: [{
    label: 'Memory Usage (MB) - Lower is Better',
    data: [8, 45, 60], // EXAMPLE DATA
    backgroundColor: 'rgba(75, 192, 192, 0.6)',
    borderColor: 'rgb(75, 192, 192)',
    borderWidth: 1,
  }],
};
// --- END BENCHMARK DATA ---

const exampleRepos: ExampleRepo[] = [
  {
    title: "Rotel with Python FastAPI",
    description: "Integrating Rotel for telemetry in a Python FastAPI application.",
    link: "https://github.com/streamfold/rotel-example-fastapi" // UPDATE LINK
  },
  {
    title: "Rotel on AWS Lambda (Python)",
    description: "Using the rotel-lambda-extension for efficient telemetry in Python AWS Lambda.",
    link: "https://github.com/streamfold/rotel-example-lambda-python" // UPDATE LINK
  },
  {
    title: "Custom Python Processor with Rotel",
    description: "Building and using a custom telemetry processor in Python with Rotel.",
    link: "https://github.com/streamfold/rotel-example-custom-processor" // UPDATE LINK
  }
];

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description="High-performance, Rust-powered OpenTelemetry collector with low memory overhead, Python integration, and serverless optimization.">
      <HomepageHeader />
      <main>
        {/* <HomepageFeatures /> */}
          <section className={clsx('container padding-vert--sm text--center', styles.sectionShorter)}>
              {/*<h2>Why Choose Rotel?</h2>*/}
              <div className="row margin-top--lg">
                  <div className="col col--offset-2 col--8">
                      <div className={styles.whyRotelItem}>
                          <h3>🦀 Written in Rust</h3>
                          <p>Designed for bare-metal performance, leading to lower resource consumption and operational costs.</p>
                      </div>
                      <div className={styles.whyRotelItem}>
                          <h3>📉 Low Memory Overhead</h3>
                          <p>Without a garbage collector, Rotel maintains low memory overhead important for serverless environments.</p>
                      </div>
                      <div className={styles.whyRotelItem}>
                          <h3>⏱️ Optimized for Low Cold-Starts</h3>
                          <p>Specifically tailored for serverless environments like AWS Lambda, ensuring your functions start fast.</p>
                      </div>
                      <div className={styles.whyRotelItem}>
                          <h3>🐍 Native Python Integration</h3>
                          <p>Develop custom telemetry processors in Python, leveraging its rich ecosystem without performance compromises for the core collector.</p>
                      </div>
                  </div>
              </div>
          </section>

        <section className={clsx('container padding-vert--lg text--center', styles.sectionShorter)}>
          <h2>High performance and low overhead ⚡</h2>
          <p className={styles.sectionSubtitle}>Rotel is engineered for speed and efficiency. See how it compares:</p>
          <div className="row">
            <div className={clsx('col col-6', styles.chartContainer)}>
              <BenchmarkChart data={memoryUsageData} title="Memory Overhead Comparison" />
            </div>
          </div>
           <div className="text--center margin-top--md">
             <p><em>Note: Benchmark charts show illustrative data. Refer to specific benchmark runs for precise numbers.</em></p>
           </div>
        </section>

        <section className={clsx('container padding-vert--lg text--center', styles.sectionShorter)}>
          <h2>Ideal for serverless environments 📦</h2>
          <p className={styles.sectionSubtitle}>Small package size and low cold-start times are ideal for serverless environments</p>
          <div className="row">
            <div className={clsx('col col-6', styles.chartContainer)}>
              {/* Assuming BenchmarkChart component is properly typed to accept ChartData */}
              <BenchmarkChart data={coldStartData} title="Serverless Cold Start Comparison" />
            </div>
          </div>
           <div className="text--center margin-top--md">
             <p><em>Note: Benchmark charts show illustrative data. Refer to specific benchmark runs for precise numbers.</em></p>
           </div>
        </section>

        <section className={clsx('container padding-vert--lg text--center', styles.sectionShorter)}>
          <h2>Developer friendly with native language integrations ⚙️</h2>
          <p className={styles.sectionSubtitle}>Rotel is engineered for speed and efficiency. See how it compares (example data):</p>
          <div className="row">
              <div className="col col--8 col--offset-2">
                  <h3 className="text-lg font-medium mb-2">Python Processor</h3>
                  <PrismCodeBlock title="example.py" language="python" theme="dark">
                      {`import re

from rotel_sdk.open_telemetry.common.v1 import AnyValue
from rotel_sdk.open_telemetry.logs.v1 import ResourceLogs

email_pattern = r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b'


def process(resource_logs: ResourceLogs):
    for scope_log in resource_logs.scope_logs:
        for log_record in scope_log.log_records:
            if log_record.body is not None and log_record.body.value is not None:
                if re.search(email_pattern, log_record.body.value):
                    log_record.body = redact_emails(log_record.body.value)


def redact_emails(text: str):
    """
    Searches for email addresses in a string and replaces them with '*** redacted'
    
    Args:
        text (str): The input string to search for email addresses
        
    Returns:
        str: The string with email addresses replaced by '*** redacted'
    """
    new_body = AnyValue()
    new_body.string_value = re.sub(email_pattern, '**[email redacted]**', text)
    return new_body`}
                  </PrismCodeBlock>
              </div>
          </div>
 
        </section>

        <section className={clsx('container padding-vert--xl text--center', styles.sectionShorter, styles.altSectionBackground)}>
          <h2>Explore Rotel in Action 🛠️</h2>
          <p className={styles.sectionSubtitle}>Check out these example repositories for integrations and use cases.</p>
          <div className="row">
            {exampleRepos.map((repo, idx) => (
              <div key={idx} className={clsx('col col--4 margin-bottom--lg', styles.exampleCardWrapper)}>
                <div className={clsx('card shadow--md', styles.exampleCard)}>
                  <div className="card__header">
                    <h3>{repo.title}</h3>
                  </div>
                  <div className="card__body">
                    <p>{repo.description}</p>
                  </div>
                  <div className="card__footer">
                    <Link
                      className="button button--primary button--block"
                      href={repo.link}
                      target="_blank"
                      rel="noopener noreferrer">
                      View on GitHub <span aria-label="external link icon">↗️</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
           <div className="text--center margin-top--lg"> {/* Increased margin */}
             <Link className="button button--outline button--secondary button--lg" to="/docs/examples/overview">
                See More Examples
             </Link>           
           </div>
        </section>

      </main>
    </Layout>
  );
}
