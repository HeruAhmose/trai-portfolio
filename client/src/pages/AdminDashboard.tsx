import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Zap, Settings, LogOut } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AstronomicalEffects } from '@/components/AstronomicalEffects';
import { ExtremeNeonLighting } from '@/components/ExtremeNeonLighting';

interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  avgEngagement: number;
  recommendationClickThrough: number;
  topRecommendations: Array<{ title: string; clicks: number }>;
  userSegments: Array<{ name: string; count: number }>;
  performanceData: Array<{ date: string; views: number; recommendations: number }>;
}

export const AdminDashboard: React.FC = () => {
  // Add voice command tracking
  useEffect(() => {
    const trackDashboardView = async () => {
      try {
        // Track admin dashboard view
        console.log('[Analytics] Admin dashboard viewed');
      } catch (error) {
        console.error('Failed to track dashboard view:', error);
      }
    };
    trackDashboardView();
  }, []);

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // Mock data - in production, fetch from API
        const mockMetrics: DashboardMetrics = {
          totalUsers: 1250,
          activeUsers: 847,
          avgEngagement: 0.68,
          recommendationClickThrough: 0.42,
          topRecommendations: [
            { title: 'Quantum Research', clicks: 342 },
            { title: 'Material Science', clicks: 289 },
            { title: 'Cybersecurity', clicks: 267 },
            { title: 'Gesture Control', clicks: 198 },
            { title: 'Community Impact', clicks: 156 },
          ],
          userSegments: [
            { name: 'Explorer', count: 450 },
            { name: 'Focused', count: 320 },
            { name: 'Technical', count: 280 },
            { name: 'Casual', count: 200 },
          ],
          performanceData: [
            { date: 'Mon', views: 1200, recommendations: 420 },
            { date: 'Tue', views: 1400, recommendations: 480 },
            { date: 'Wed', views: 1100, recommendations: 380 },
            { date: 'Thu', views: 1800, recommendations: 650 },
            { date: 'Fri', views: 2200, recommendations: 890 },
            { date: 'Sat', views: 2800, recommendations: 1200 },
            { date: 'Sun', views: 2000, recommendations: 800 },
          ],
        };

        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-background/50 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Failed to load metrics</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyan mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Portfolio analytics and insights</p>
          </div>
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? 'cyberpunk-button' : ''}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-neon-cyan/30 bg-deep-blue/50">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold text-cyan">{metrics.totalUsers.toLocaleString()}</p>
              <Badge className="w-fit bg-lime/20 text-lime">+12% this week</Badge>
            </div>
          </Card>

          <Card className="p-6 border-neon-pink/30 bg-deep-blue/50">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-3xl font-bold text-neon-pink">{metrics.activeUsers.toLocaleString()}</p>
              <Badge className="w-fit bg-neon-pink/20 text-neon-pink">
                {((metrics.activeUsers / metrics.totalUsers) * 100).toFixed(1)}% active
              </Badge>
            </div>
          </Card>

          <Card className="p-6 border-gold/30 bg-deep-blue/50">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Avg Engagement</p>
              <p className="text-3xl font-bold text-gold">{(metrics.avgEngagement * 100).toFixed(0)}%</p>
              <Badge className="w-fit bg-gold/20 text-gold">+5% vs last period</Badge>
            </div>
          </Card>

          <Card className="p-6 border-lime/30 bg-deep-blue/50">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Recommendation CTR</p>
              <p className="text-3xl font-bold text-lime">{(metrics.recommendationClickThrough * 100).toFixed(1)}%</p>
              <Badge className="w-fit bg-lime/20 text-lime">Strong performance</Badge>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <Card className="p-6 border-border/50 bg-deep-blue/30">
            <h3 className="text-lg font-bold text-cyan mb-4">Weekly Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ background: '#1a1f3a', border: '1px solid #00d9ff' }} />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#00d9ff" strokeWidth={2} />
                <Line type="monotone" dataKey="recommendations" stroke="#ff00ff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* User Segments Chart */}
          <Card className="p-6 border-border/50 bg-deep-blue/30">
            <h3 className="text-lg font-bold text-cyan mb-4">User Segments</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.userSegments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ background: '#1a1f3a', border: '1px solid #00d9ff' }} />
                <Bar dataKey="count" fill="#00d9ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Top Recommendations */}
        <Card className="p-6 border-border/50 bg-deep-blue/30">
          <h3 className="text-lg font-bold text-cyan mb-4">Top Recommendations</h3>
          <div className="space-y-3">
            {metrics.topRecommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="bg-cyan/20 text-cyan">{index + 1}</Badge>
                  <span className="text-sm font-medium">{rec.title}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan to-neon-pink"
                      style={{ width: `${(rec.clicks / metrics.topRecommendations[0].clicks) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-cyan w-16 text-right">{rec.clicks} clicks</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Export Section */}
        <Card className="p-6 border-border/50 bg-deep-blue/30">
          <h3 className="text-lg font-bold text-cyan mb-4">Export Data</h3>
          <div className="flex gap-3">
            <Button className="cyberpunk-button">Export CSV</Button>
            <Button className="cyberpunk-button">Export PDF</Button>
            <Button className="cyberpunk-button">Generate Report</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
