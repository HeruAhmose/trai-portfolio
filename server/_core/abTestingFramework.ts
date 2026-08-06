export interface Variant {
  id: string;
  name: string;
  description: string;
  config: Record<string, unknown>;
  trafficPercentage: number;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: Variant[];
  startDate: number;
  endDate: number;
  status: 'draft' | 'running' | 'paused' | 'completed';
  targetMetric: string;
  minSampleSize: number;
}

export interface ExperimentAssignment {
  userId: string;
  experimentId: string;
  variantId: string;
  assignedAt: number;
}

export interface MetricEvent {
  userId: string;
  experimentId: string;
  variantId: string;
  metricName: string;
  value: number;
  timestamp: number;
}

export interface ExperimentResults {
  experimentId: string;
  variantResults: Array<{
    variantId: string;
    variantName: string;
    sampleSize: number;
    conversionRate: number;
    avgMetricValue: number;
    confidence: number;
    winner: boolean;
  }>;
  statisticalSignificance: number;
  winner?: string;
  recommendation: string;
}

class ABTestingFramework {
  private experiments = new Map<string, Experiment>();
  private assignments = new Map<string, ExperimentAssignment>();
  private metrics = new Map<string, MetricEvent[]>();
  private experimentCounter = 0;

  /**
   * Create new experiment
   */
  createExperiment(experiment: Omit<Experiment, 'id'>): Experiment {
    const id = `exp-${++this.experimentCounter}-${Date.now()}`;
    const fullExperiment: Experiment = { ...experiment, id };

    this.experiments.set(id, fullExperiment);
    this.metrics.set(id, []);

    return fullExperiment;
  }

  /**
   * Get experiment
   */
  getExperiment(experimentId: string): Experiment | undefined {
    return this.experiments.get(experimentId);
  }

  /**
   * Assign user to variant
   */
  assignUserToVariant(userId: string, experimentId: string): ExperimentAssignment | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || experiment.status !== 'running') {
      return null;
    }

    // Check if user already assigned
    const existingKey = `${userId}-${experimentId}`;
    const existing = this.assignments.get(existingKey);
    if (existing) {
      return existing;
    }

    // Assign user to variant based on traffic percentage
    const random = Math.random() * 100;
    let cumulativePercentage = 0;
    let selectedVariant: Variant | null = null;

    for (const variant of experiment.variants) {
      cumulativePercentage += variant.trafficPercentage;
      if (random <= cumulativePercentage) {
        selectedVariant = variant;
        break;
      }
    }

    if (!selectedVariant) {
      selectedVariant = experiment.variants[0];
    }

    const assignment: ExperimentAssignment = {
      userId,
      experimentId,
      variantId: selectedVariant.id,
      assignedAt: Date.now(),
    };

    this.assignments.set(existingKey, assignment);
    return assignment;
  }

  /**
   * Get user's variant assignment
   */
  getUserVariant(userId: string, experimentId: string): ExperimentAssignment | undefined {
    return this.assignments.get(`${userId}-${experimentId}`);
  }

  /**
   * Track metric event
   */
  trackMetricEvent(
    userId: string,
    experimentId: string,
    metricName: string,
    value: number
  ): boolean {
    const assignment = this.assignments.get(`${userId}-${experimentId}`);
    if (!assignment) {
      return false;
    }

    const event: MetricEvent = {
      userId,
      experimentId,
      variantId: assignment.variantId,
      metricName,
      value,
      timestamp: Date.now(),
    };

    if (!this.metrics.has(experimentId)) {
      this.metrics.set(experimentId, []);
    }

    this.metrics.get(experimentId)!.push(event);
    return true;
  }

  /**
   * Calculate experiment results
   */
  calculateResults(experimentId: string): ExperimentResults | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      return null;
    }

    const events = this.metrics.get(experimentId) || [];
    const variantMetrics = new Map<string, { count: number; sum: number; conversions: number }>();

    // Initialize variant metrics
    for (const variant of experiment.variants) {
      variantMetrics.set(variant.id, { count: 0, sum: 0, conversions: 0 });
    }

    // Aggregate metrics by variant
    for (const event of events) {
      const metrics = variantMetrics.get(event.variantId);
      if (metrics) {
        metrics.count += 1;
        metrics.sum += event.value;
        if (event.value > 0) {
          metrics.conversions += 1;
        }
      }
    }

    // Calculate results for each variant
    const variantResults = experiment.variants.map((variant) => {
      const metrics = variantMetrics.get(variant.id) || { count: 0, sum: 0, conversions: 0 };
      const sampleSize = metrics.count;
      const conversionRate = sampleSize > 0 ? metrics.conversions / sampleSize : 0;
      const avgMetricValue = sampleSize > 0 ? metrics.sum / sampleSize : 0;

      return {
        variantId: variant.id,
        variantName: variant.name,
        sampleSize,
        conversionRate,
        avgMetricValue,
        confidence: this.calculateConfidence(sampleSize),
        winner: false,
      };
    });

    // Determine winner (highest conversion rate with sufficient sample size)
    let winner: string | undefined;
    let maxConversionRate = -1;

    for (const result of variantResults) {
      if (result.sampleSize >= experiment.minSampleSize && result.conversionRate > maxConversionRate) {
        maxConversionRate = result.conversionRate;
        winner = result.variantId;
      }
    }

    if (winner) {
      const winnerResult = variantResults.find((r) => r.variantId === winner);
      if (winnerResult) {
        winnerResult.winner = true;
      }
    }

    const statisticalSignificance = this.calculateStatisticalSignificance(variantResults);

    return {
      experimentId,
      variantResults,
      statisticalSignificance,
      winner,
      recommendation: this.generateRecommendation(variantResults, statisticalSignificance),
    };
  }

  /**
   * Calculate confidence level
   */
  private calculateConfidence(sampleSize: number): number {
    if (sampleSize < 100) return 0.5;
    if (sampleSize < 500) return 0.7;
    if (sampleSize < 1000) return 0.85;
    return 0.95;
  }

  /**
   * Calculate statistical significance
   */
  private calculateStatisticalSignificance(results: Array<{ conversionRate: number }>): number {
    if (results.length < 2) return 0;

    const rates = results.map((r) => r.conversionRate);
    const mean = rates.reduce((a, b) => a + b, 0) / rates.length;
    const variance = rates.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / rates.length;
    const stdDev = Math.sqrt(variance);

    // Simple significance calculation (0-1 scale)
    return Math.min(stdDev * 10, 1);
  }

  /**
   * Generate recommendation
   */
  private generateRecommendation(
    results: Array<{ variantName: string; conversionRate: number; sampleSize: number; winner: boolean }>,
    significance: number
  ): string {
    const winner = results.find((r) => r.winner);

    if (!winner) {
      return 'Insufficient data to make a recommendation. Continue running the experiment.';
    }

    if (significance < 0.7) {
      return `${winner.variantName} shows promise but needs more data. Continue the experiment for statistical significance.`;
    }

    const improvement = (
      ((winner.conversionRate - results[0].conversionRate) / results[0].conversionRate) *
      100
    ).toFixed(1);

    return `${winner.variantName} is the clear winner with ${improvement}% improvement. Recommend rolling out this variant to all users.`;
  }

  /**
   * Start experiment
   */
  startExperiment(experimentId: string): boolean {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      return false;
    }

    experiment.status = 'running';
    experiment.startDate = Date.now();
    return true;
  }

  /**
   * End experiment
   */
  endExperiment(experimentId: string): boolean {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      return false;
    }

    experiment.status = 'completed';
    experiment.endDate = Date.now();
    return true;
  }

  /**
   * Pause experiment
   */
  pauseExperiment(experimentId: string): boolean {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) {
      return false;
    }

    experiment.status = 'paused';
    return true;
  }

  /**
   * Get all experiments
   */
  getAllExperiments(): Experiment[] {
    return Array.from(this.experiments.values());
  }

  /**
   * Get running experiments
   */
  getRunningExperiments(): Experiment[] {
    return Array.from(this.experiments.values()).filter((e) => e.status === 'running');
  }

  /**
   * Get experiment statistics
   */
  getExperimentStats() {
    const experiments = Array.from(this.experiments.values());
    return {
      totalExperiments: experiments.length,
      runningExperiments: experiments.filter((e) => e.status === 'running').length,
      completedExperiments: experiments.filter((e) => e.status === 'completed').length,
      totalMetricEvents: Array.from(this.metrics.values()).reduce((sum, m) => sum + m.length, 0),
      totalAssignments: this.assignments.size,
    };
  }

  /**
   * Export experiment results
   */
  exportResults(experimentId: string): string {
    const results = this.calculateResults(experimentId);
    if (!results) {
      return '';
    }

    const csv = [
      'Variant,Sample Size,Conversion Rate,Avg Metric Value,Confidence,Winner',
      ...results.variantResults.map(
        (r) =>
          `${r.variantName},${r.sampleSize},${(r.conversionRate * 100).toFixed(2)}%,${r.avgMetricValue.toFixed(2)},${(r.confidence * 100).toFixed(0)}%,${r.winner ? 'Yes' : 'No'}`
      ),
    ].join('\n');

    return csv;
  }
}

export const abTestingFramework = new ABTestingFramework();
