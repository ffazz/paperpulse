interface Metric {
  value: number;
  labels: Record<string, string>;
  timestamp: number;
}

interface HistogramBucket {
  le: number;
  count: number;
}

class MetricsCollector {
  private counters: Map<string, Map<string, number>> = new Map();
  private gauges: Map<string, Map<string, number>> = new Map();
  private histograms: Map<string, Map<string, HistogramBucket[]>> = new Map();

  increment(name: string, labels: Record<string, string> = {}, value: number = 1) {
    if (!this.counters.has(name)) {
      this.counters.set(name, new Map());
    }
    const labelKey = this.getLabelKey(labels);
    const current = this.counters.get(name)!.get(labelKey) || 0;
    this.counters.get(name)!.set(labelKey, current + value);
  }

  set(name: string, value: number, labels: Record<string, string> = {}) {
    if (!this.gauges.has(name)) {
      this.gauges.set(name, new Map());
    }
    const labelKey = this.getLabelKey(labels);
    this.gauges.get(name)!.set(labelKey, value);
  }

  recordHistogram(name: string, value: number, labels: Record<string, string> = {}) {
    if (!this.histograms.has(name)) {
      this.histograms.set(name, new Map());
    }
    const labelKey = this.getLabelKey(labels);
    if (!this.histograms.get(name)!.has(labelKey)) {
      this.histograms.get(name)!.set(labelKey, this.createBuckets());
    }
    
    const buckets = this.histograms.get(name)!.get(labelKey)!;
    for (const bucket of buckets) {
      if (value <= bucket.le) {
        bucket.count++;
      }
    }
  }

  private createBuckets(): HistogramBucket[] {
    return [
      { le: 0.005, count: 0 },
      { le: 0.01, count: 0 },
      { le: 0.025, count: 0 },
      { le: 0.05, count: 0 },
      { le: 0.1, count: 0 },
      { le: 0.25, count: 0 },
      { le: 0.5, count: 0 },
      { le: 1, count: 0 },
      { le: 2.5, count: 0 },
      { le: 5, count: 0 },
      { le: 10, count: 0 },
      { le: Infinity, count: 0 }
    ];
  }

  private getLabelKey(labels: Record<string, string>): string {
    return JSON.stringify(Object.entries(labels).sort());
  }

  exportPrometheus(): string {
    let output = '';

    // Export counters
    for (const [name, labelMap] of this.counters.entries()) {
      output += `# TYPE ${name} counter\n`;
      for (const [labelKey, value] of labelMap.entries()) {
        const labels = this.formatLabels(labelKey);
        output += `${name}${labels} ${value}\n`;
      }
    }

    // Export gauges
    for (const [name, labelMap] of this.gauges.entries()) {
      output += `# TYPE ${name} gauge\n`;
      for (const [labelKey, value] of labelMap.entries()) {
        const labels = this.formatLabels(labelKey);
        output += `${name}${labels} ${value}\n`;
      }
    }

    // Export histograms
    for (const [name, labelMap] of this.histograms.entries()) {
      output += `# TYPE ${name} histogram\n`;
      for (const [labelKey, buckets] of labelMap.entries()) {
        const baseLabels = JSON.parse(labelKey);
        for (const bucket of buckets) {
          const labels = this.formatLabels(
            JSON.stringify([...baseLabels, ['le', bucket.le === Infinity ? '+Inf' : bucket.le.toString()]])
          );
          output += `${name}_bucket${labels} ${bucket.count}\n`;
        }
        const totalCount = buckets[buckets.length - 1].count;
        const labels = this.formatLabels(labelKey);
        output += `${name}_count${labels} ${totalCount}\n`;
        output += `${name}_sum${labels} 0\n`;
      }
    }

    return output;
  }

  private formatLabels(labelKey: string): string {
    try {
      const labels = JSON.parse(labelKey);
      if (labels.length === 0) return '';
      const formatted = labels
        .map(([key, value]: [string, string]) => `${key}="${value}"`)
        .join(',');
      return `{${formatted}}`;
    } catch {
      return '';
    }
  }

  reset() {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
  }
}

export const metrics = new MetricsCollector();
