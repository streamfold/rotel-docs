import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock'
import LineChart from "@site/src/components/LineChart";
import {LineChartData} from "@site/src/components/LineChart";
import BarChart from "@site/src/components/BarChart";
import {BarChartData} from "@site/src/components/BarChart";

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

const memUsageBarData: BarChartData = {
    labels: ['Rotel - OTLP/gRPC', 'Rotel - OTLP/HTTP', 'OTEL - OTLP/gRPC', 'OTEL - OTLP/HTTP'],
    datasets: [{
        label: 'Memory Usage (MB)',
        data: [25, 29, 98, 89],
        backgroundColor: ['#3B82F6', '#3B82F6', '#EF4444', '#EF4444'], // First 2 blue, last 2 red
        borderColor: ['#1D4ED8', '#1D4ED8', '#DC2626', '#DC2626'],
        borderWidth: 1
    }]
};

const cpuUsageBarData: BarChartData = {
    labels: ['Rotel - OTLP/gRPC', 'Rotel - OTLP/HTTP', 'OTEL - OTLP/gRPC', 'OTEL - OTLP/HTTP'],
    datasets: [{
        label: 'CPU (%)',
        data: [6.67, 4.33, 11.33, 7.33],
        backgroundColor: ['#3B82F6', '#3B82F6', '#EF4444', '#EF4444'], // First 2 blue, last 2 red
        borderColor: ['#1D4ED8', '#1D4ED8', '#DC2626', '#DC2626'],
        borderWidth: 1
    }]
};

const coldstartData: LineChartData = {
    labels: ['256 MB', '512 MB', '1 GB', '2 GB', '3 GB', '4 GB'],
  datasets: [
    {
      label: 'Rotel Lambda',
        data: [360.565821,
            323.432366,
            29.682875,
            166.006486,
            197.312037,
            150.604963
        ],
        borderColor: '#00D4FF', // Bright cyan
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderWidth: 3,
        tension: 0.2,
        pointRadius: 5,
        pointHoverRadius: 8,
        fill: false,
    },
      {
          label: 'OpenTelemetry Lambda',
          data: [459.143082,
              506.922325,
              261.203130,
              390.840133,
              426.790238,
              539.534966,
          ],
          borderColor: '#FF6B6B', // Bright coral red
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          borderWidth: 3,
          tension: 0.2,
          pointRadius: 5,
          pointHoverRadius: 8,
          fill: false,
      },
      {
          label: 'Datadog Lambda',
          data: [1534.392516,
              1040.621440,
              625.236273,
              530.351242,
              597.770453,
              636.898040,

          ],
          borderColor: '#4ECDC4', // Bright teal
          backgroundColor: 'rgba(78, 205, 196, 0.1)',
          borderWidth: 3,
          tension: 0.2,
          pointRadius: 5,
          pointHoverRadius: 8,
          fill: false,
      },
  ]
};

// --- END BENCHMARK DATA ---

const exampleRepos: ExampleRepo[] = [
  {
    title: "Rotel with Python FastAPI",
    description: "Integrating Rotel for telemetry in a Python FastAPI application.",
    link: "https://github.com/streamfold/fastapi-backend-example"
  },
  {
    title: "AWS Lambda + Clickhouse",
    description: "Using the rotel-lambda-extension to send Lambda logs and application traces to Clickhouse.",
    link: "https://github.com/streamfold/python-aws-lambda-clickhouse-example"
  },
  {
    title: "Node.js Lambda + Honeycomb",
    description: "Use OpenTelemetry Node.js auto-instrumentation and send data to Honeycomb.",
    link: "https://github.com/streamfold/nodejs-aws-lambda-example",
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
          <section className={clsx('container padding-vert--sm text--center', styles.sectionShorter)}>
              <div className="row margin-top--lg">
                  <div className="col col--12">
                      <div className="row">
                          <div className="col col--6 margin-bottom--md">
                              <div className={clsx(styles.whyRotelItem, styles.featureBox)}>
                                  <h2>🦀 Written in Rust</h2>
                                  <p>Designed for bare-metal performance, leading to lower resource consumption and operational costs.</p>
                              </div>
                          </div>
                          <div className="col col--6 margin-bottom--md">
                              <div className={clsx(styles.whyRotelItem, styles.featureBox)}>
                                  <h2>📉 Low Memory Overhead</h2>
                                  <p>Without a garbage collector, Rotel maintains low memory overhead important for serverless environments.</p>
                              </div>
                          </div>
                          <div className="col col--6 margin-bottom--md">
                              <div className={clsx(styles.whyRotelItem, styles.featureBox)}>
                                  <h2>⏱️ Optimized for Low Cold-Starts</h2>
                                  <p>Specifically tailored for serverless environments like AWS Lambda, ensuring your functions start fast.</p>
                              </div>
                          </div>
                          <div className="col col--6 margin-bottom--md">
                              <div className={clsx(styles.whyRotelItem, styles.featureBox)}>
                                  <h2>🐍 Native Python Integration</h2>
                                  <p>Develop custom telemetry processors in Python, dev and test locally.</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

        <section className={clsx('container padding-vert--lg text--center', styles.sectionShorter, styles.featuresSection)}>
          <h2>High-performance and low overhead ⚡</h2>
            <p className={styles.sectionSubtitle}>Rotel requires fewer resources for the same workloads</p>
          <div className="row">
            <div className={clsx('col col-6', styles.chartContainer)}>
              <BarChart data={memUsageBarData} title="Memory Overhead Comparison" />
            </div>
          </div>
            <div className="row">
                <div className={clsx('col col-6', styles.chartContainer)}>
                    <BarChart data={cpuUsageBarData} title="CPU Comparison" />
                </div>
            </div>
            <div className="text--center margin-top--md">
                <p><em>Comparison of memory and CPU usage of Rotel and the OpenTelemetry collector. Results from the Log10kDPS <a href="https://streamfold.github.io/rotel-otel-loadtests/benchmarks/">benchmark</a>.</em></p>
            </div>
        </section>

        <section className={clsx('container margin-top--lg padding-vert--lg text--center', styles.sectionShorter, styles.featuresSection)}>
          <h2>Ideal for serverless environments 📦</h2>
          <p className={styles.sectionSubtitle}>Small package size and low cold-start times are ideal for serverless environments</p>
            <LineChart data={coldstartData} title="AWS Lambda Coldstarts" xAxisLabel="Function Memory (MB)" yAxisLabel="Coldstart Time (ms)" />
           <div className="text--center margin-top--md">
               <p><em>This chart compares cold start times between Rotel,
                   the <a href="https://github.com/open-telemetry/opentelemetry-lambda/blob/main/collector/README.md">OpenTelemetry Lambda</a>,
                   and the <a href="https://docs.datadoghq.com/serverless/aws_lambda/opentelemetry/?tab=python">Datadog OTEL Lambda</a> layers.
             </em></p>
           </div>
        </section>

        <section className={clsx('container margin-top--lg padding-vert--lg text--center', styles.sectionShorter, styles.featuresSection)}>
          <h2>Developer friendly with native language integrations ⚙️</h2>
          <p className={styles.sectionSubtitle}>Write custom telemetry processors in Python with full type support</p>
          <div className="row">
              <div className="col col--8 col--offset-2 text--left">
                  <CodeBlock title="email-redact-processor.py" language="python">
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
                  </CodeBlock>
              </div>
          </div>
        </section>

          <section className={clsx('container margin-top--lg padding-vert--lg text--center', styles.sectionShorter, styles.featuresSection)}>
              <h2>Growing Feature Matrix 🚀</h2>
              <p className={styles.sectionSubtitle}>Comprehensive telemetry collection with batteries included</p>
              <div className="row justify-content-center">
                  <div className="col col--offset-1 col--5 margin-bottom--md">
                      <div className={clsx(styles.featureHighlightBox, styles.receiversBox)}>
                          <div className={styles.featureIcon}>📥</div>
                          <h3>Receivers & Processing</h3>
                          <ul className={styles.featureList}>
                              <li>OTLP/gRPC, OTLP/HTTP, OTLP/HTTP-JSON receivers</li>
                              <li>Automatic batching for optimal delivery</li>
                              <li>Custom Python processors</li>
                              <li>Adaptive flushing that minimizes lambda overhead</li>
                              <li>Simple custom resource attribution</li>
                          </ul>
                      </div>
                  </div>
                  <div className="col col--5 margin-bottom--md">
                      <div className={clsx(styles.featureHighlightBox, styles.exportersBox)}>
                          <div className={styles.featureIcon}>📤</div>
                          <h3>Exporters & Destinations</h3>
                          <ul className={styles.featureList}>
                              <li>OTLP (gRPC/HTTP) exporters</li>
                              <li>ClickHouse traces & logs exporter</li>
                              <li>Datadog trace exporter</li>
                              <li>AWS X-Ray tracing</li>
                              <li>Debug & logging exporters</li>
                          </ul>
                      </div>
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
             <Link className="button button--outline button--secondary button--lg" to="/docs/category/examples">
                See More Examples
             </Link>           
           </div>
        </section>

      </main>
    </Layout>
  );
}
