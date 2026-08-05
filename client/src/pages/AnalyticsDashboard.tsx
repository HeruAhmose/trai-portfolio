import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CollaborationDashboard } from '@/components/CollaborationDashboard';

interface AnalyticsData {
  pageViews: Record<string, number>;
  gestureFrequency: Record<string, number>;
  audioFrequencies: { bass: number; mid: number; treble: number };
  engagementMetrics: {
    avgSessionDuration: number;
    bounceRate: number;
    returnVisitors: number;
  };
  heatmapData: Array<{ x: number; y: number; intensity: number }>;
}

export const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');

  // Mock analytics data
  useEffect(() => {
    const mockData: AnalyticsData = {
      pageViews: {
        '/': 1250,
        '/quantum': 890,
        '/materials': 654,
        '/cybersecurity': 432,
        '/community': 321,
      },
      gestureFrequency: {
        'thumbs_up': 234,
        'peace_sign': 189,
        'ok_sign': 156,
        'swipe_left': 143,
        'swipe_right': 128,
        'point_forward': 98,
      },
      audioFrequencies: {
        bass: 0.65,
        mid: 0.72,
        treble: 0.58,
      },
      engagementMetrics: {
        avgSessionDuration: 342,
        bounceRate: 0.28,
        returnVisitors: 0.42,
      },
      heatmapData: Array.from({ length: 100 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        intensity: Math.random() * 100,
      })),
    };
    setAnalytics(mockData);
  }, [timeRange]);

  const handleExport = () => {
    if (!analytics) return;

    if (exportFormat === 'csv') {
      const csv = generateCSV(analytics);
      downloadFile(csv, 'analytics.csv', 'text/csv');
    } else {
      // PDF export would require a library like jsPDF
      alert('PDF export coming soon');
    }
  };

  const generateCSV = (data: AnalyticsData): string => {
    let csv = 'Analytics Report\n\n';

    csv += 'Page Views\n';
    Object.entries(data.pageViews).forEach(([page, views]) => {
      csv += `${page},${views}\n`;
    });

    csv += '\nGesture Frequency\n';
    Object.entries(data.gestureFrequency).forEach(([gesture, count]) => {
      csv += `${gesture},${count}\n`;
    });

    csv += '\nAudio Frequencies\n';
    csv += `Bass,${data.audioFrequencies.bass}\n`;
    csv += `Mid,${data.audioFrequencies.mid}\n`;
    csv += `Treble,${data.audioFrequencies.treble}\n`;

    csv += '\nEngagement Metrics\n';
    csv += `Avg Session Duration,${data.engagementMetrics.avgSessionDuration}s\n`;
    csv += `Bounce Rate,${(data.engagementMetrics.bounceRate * 100).toFixed(2)}%\n`;
    csv += `Return Visitors,${(data.engagementMetrics.returnVisitors * 100).toFixed(2)}%\n`;

    return csv;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Real-time visitor analytics and engagement metrics</p>
      </div>

      {/* Time Range and Export Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          {(['24h', '7d', '30d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              onClick={() => setTimeRange(range)}
              className="text-xs"
            >
              {range === '24h' ? 'Last 24h' : range === '7d' ? 'Last 7 days' : 'Last 30 days'}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 ml-auto">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'csv' | 'pdf')}
            className="px-3 py-2 rounded-lg bg-background border border-border text-sm"
          >
            <option value="csv">CSV</option>
            <option value="pdf">PDF</option>
          </select>
          <Button onClick={handleExport} className="cyberpunk-button">
            Export Report
          </Button>
        </div>
      </div>

      {/* Real-Time Collaboration Dashboard */}
      <Card className="p-6 border-neon-cyan/30 bg-deep-blue/50">
        <h2 className="text-2xl font-bold text-cyan mb-4">Live Collaboration</h2>
        <CollaborationDashboard />
      </Card>

      {/* Analytics Grid */}
      {analytics && (
        <>
          {/* Page Views */}
          <Card className="p-6 border-gold/30 bg-deep-blue/50">
            <h3 className="text-xl font-bold text-gold mb-4">Page Views</h3>
            <div className="space-y-3">
              {Object.entries(analytics.pageViews).map(([page, views]) => (
                <div key={page} className="flex items-center gap-4">
                  <span className="w-24 text-sm font-medium">{page}</span>
                  <div className="flex-1 bg-background rounded-lg overflow-hidden h-6">
                    <div
                      className="bg-gradient-to-r from-gold to-neon-pink h-full"
                      style={{
                        width: `${(views / 1250) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-16 text-right text-sm font-bold text-gold">{views}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Gesture Frequency */}
          <Card className="p-6 border-neon-pink/30 bg-deep-blue/50">
            <h3 className="text-xl font-bold text-neon-pink mb-4">Gesture Frequency</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(analytics.gestureFrequency).map(([gesture, count]) => (
                <div key={gesture} className="p-4 bg-background rounded-lg border border-border">
                  <div className="text-sm text-muted-foreground capitalize mb-2">
                    {gesture.replace('_', ' ')}
                  </div>
                  <div className="text-2xl font-bold text-neon-pink">{count}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Audio Frequencies */}
          <Card className="p-6 border-cyan/30 bg-deep-blue/50">
            <h3 className="text-xl font-bold text-cyan mb-4">Audio Frequency Analysis</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(analytics.audioFrequencies).map(([freq, value]) => (
                <div key={freq} className="p-4 bg-background rounded-lg border border-border">
                  <div className="text-sm text-muted-foreground capitalize mb-2">{freq}</div>
                  <div className="text-3xl font-bold text-cyan">
                    {(value * 100).toFixed(0)}%
                  </div>
                  <div className="mt-2 w-full bg-background rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-cyan h-full"
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Engagement Metrics */}
          <Card className="p-6 border-lime/30 bg-deep-blue/50">
            <h3 className="text-xl font-bold text-lime mb-4">Engagement Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="text-sm text-muted-foreground mb-2">Avg Session Duration</div>
                <div className="text-3xl font-bold text-lime">
                  {analytics.engagementMetrics.avgSessionDuration}s
                </div>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="text-sm text-muted-foreground mb-2">Bounce Rate</div>
                <div className="text-3xl font-bold text-neon-pink">
                  {(analytics.engagementMetrics.bounceRate * 100).toFixed(1)}%
                </div>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="text-sm text-muted-foreground mb-2">Return Visitors</div>
                <div className="text-3xl font-bold text-cyan">
                  {(analytics.engagementMetrics.returnVisitors * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </Card>

          {/* Heatmap */}
          <Card className="p-6 border-neon-pink/30 bg-deep-blue/50">
            <h3 className="text-xl font-bold text-neon-pink mb-4">Visitor Heatmap</h3>
            <div className="relative w-full aspect-video bg-background rounded-lg border border-border overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {analytics.heatmapData.map((point, i) => (
                  <circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r={point.intensity / 20}
                    fill={`rgba(255, 0, 128, ${point.intensity / 100})`}
                    opacity={point.intensity / 100}
                  />
                ))}
              </svg>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Brighter areas indicate higher user interaction
            </p>
          </Card>
        </>
      )}
    </div>
  );
};
