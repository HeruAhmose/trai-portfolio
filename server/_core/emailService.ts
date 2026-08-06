import type { ContentRecommendation } from './recommendationService';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailDigest {
  userId: string;
  userEmail: string;
  userName: string;
  recommendations: ContentRecommendation[];
  generatedAt: number;
  scheduledFor: number;
  sent: boolean;
  sentAt?: number;
}

export interface EmailPreferences {
  userId: string;
  weeklyDigest: boolean;
  recommendationEmails: boolean;
  analyticsReports: boolean;
  unsubscribeToken: string;
  lastDigestSent?: number;
}

class EmailService {
  private templates = new Map<string, EmailTemplate>();
  private digests = new Map<string, EmailDigest[]>();
  private preferences = new Map<string, EmailPreferences>();
  private emailQueue: Array<{ email: string; subject: string; html: string; scheduledFor: number }> = [];

  constructor() {
    this.initializeTemplates();
  }

  /**
   * Initialize email templates
   */
  private initializeTemplates() {
    this.templates.set('weekly-digest', {
      id: 'weekly-digest',
      name: 'Weekly Recommendation Digest',
      subject: 'Your Personalized Portfolio Recommendations - {{userName}}',
      html: this.getWeeklyDigestTemplate(),
      text: this.getWeeklyDigestTextTemplate(),
    });

    this.templates.set('recommendation-alert', {
      id: 'recommendation-alert',
      name: 'New Recommendation Alert',
      subject: 'Check Out: {{recommendationTitle}}',
      html: this.getRecommendationAlertTemplate(),
      text: this.getRecommendationAlertTextTemplate(),
    });

    this.templates.set('analytics-report', {
      id: 'analytics-report',
      name: 'Your Analytics Report',
      subject: 'Your Portfolio Analytics Report - {{period}}',
      html: this.getAnalyticsReportTemplate(),
      text: this.getAnalyticsReportTextTemplate(),
    });
  }

  /**
   * Generate weekly digest email
   */
  generateWeeklyDigest(
    userId: string,
    userEmail: string,
    userName: string,
    recommendations: ContentRecommendation[]
  ): EmailDigest {
    const digest: EmailDigest = {
      userId,
      userEmail,
      userName,
      recommendations: recommendations.slice(0, 5),
      generatedAt: Date.now(),
      scheduledFor: Date.now() + 24 * 60 * 60 * 1000, // Send in 24 hours
      sent: false,
    };

    if (!this.digests.has(userId)) {
      this.digests.set(userId, []);
    }
    this.digests.get(userId)!.push(digest);

    return digest;
  }

  /**
   * Send email digest
   */
  async sendDigest(digest: EmailDigest): Promise<boolean> {
    try {
      const template = this.templates.get('weekly-digest');
      if (!template) throw new Error('Template not found');

      const html = this.renderTemplate(template.html, {
        userName: digest.userName,
        recommendations: digest.recommendations,
        unsubscribeUrl: this.generateUnsubscribeUrl(digest.userId),
      });

      const subject = template.subject.replace('{{userName}}', digest.userName);

      // Queue email for sending
      this.emailQueue.push({
        email: digest.userEmail,
        subject,
        html,
        scheduledFor: digest.scheduledFor,
      });

      // Update digest status
      digest.sent = true;
      digest.sentAt = Date.now();

      // Update preferences
      const prefs = this.preferences.get(digest.userId);
      if (prefs) {
        prefs.lastDigestSent = Date.now();
      }

      return true;
    } catch (error) {
      console.error('[EmailService] Failed to send digest:', error);
      return false;
    }
  }

  /**
   * Send recommendation alert
   */
  async sendRecommendationAlert(
    userId: string,
    userEmail: string,
    recommendation: ContentRecommendation
  ): Promise<boolean> {
    try {
      const template = this.templates.get('recommendation-alert');
      if (!template) throw new Error('Template not found');

      const html = this.renderTemplate(template.html, {
        recommendationTitle: recommendation.title,
        recommendationDescription: recommendation.description,
        recommendationUrl: `${process.env.VITE_FRONTEND_FORGE_API_URL}${recommendation.page}`,
        reason: recommendation.reason,
      });

      const subject = template.subject.replace('{{recommendationTitle}}', recommendation.title);

      this.emailQueue.push({
        email: userEmail,
        subject,
        html,
        scheduledFor: Date.now(),
      });

      return true;
    } catch (error) {
      console.error('[EmailService] Failed to send recommendation alert:', error);
      return false;
    }
  }

  /**
   * Set user email preferences
   */
  setEmailPreferences(userId: string, preferences: Partial<EmailPreferences>): EmailPreferences {
    const existing = this.preferences.get(userId) || {
      userId,
      weeklyDigest: true,
      recommendationEmails: false,
      analyticsReports: false,
      unsubscribeToken: this.generateUnsubscribeToken(),
    };

    const updated = { ...existing, ...preferences };
    this.preferences.set(userId, updated);

    return updated;
  }

  /**
   * Get user email preferences
   */
  getEmailPreferences(userId: string): EmailPreferences | undefined {
    return this.preferences.get(userId);
  }

  /**
   * Unsubscribe user from emails
   */
  unsubscribeUser(token: string): boolean {
    let found = false;
    this.preferences.forEach((prefs) => {
      if (prefs.unsubscribeToken === token) {
        prefs.weeklyDigest = false;
        prefs.recommendationEmails = false;
        prefs.analyticsReports = false;
        found = true;
      }
    });
    return found;
  }

  /**
   * Get pending emails
   */
  getPendingEmails() {
    const now = Date.now();
    return this.emailQueue.filter((e) => e.scheduledFor <= now);
  }

  /**
   * Mark email as sent
   */
  markEmailAsSent(index: number) {
    this.emailQueue.splice(index, 1);
  }

  /**
   * Get email statistics
   */
  getEmailStats() {
    const totalDigests = Array.from(this.digests.values()).reduce((sum, d) => sum + d.length, 0);
    const sentDigests = Array.from(this.digests.values()).reduce(
      (sum, d) => sum + d.filter((x) => x.sent).length,
      0
    );

    return {
      totalDigests,
      sentDigests,
      pendingEmails: this.emailQueue.length,
      usersWithPreferences: this.preferences.size,
      weeklyDigestSubscribers: Array.from(this.preferences.values()).filter((p) => p.weeklyDigest)
        .length,
    };
  }

  /**
   * Render email template with variables
   */
  private renderTemplate(template: string, variables: Record<string, unknown>): string {
    let html = template;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      if (typeof value === 'string') {
        html = html.replace(regex, value);
      } else if (Array.isArray(value)) {
        const listHtml = value
          .map(
            (item: unknown) =>
              `<li>${typeof item === 'object' && item !== null ? JSON.stringify(item) : String(item)}</li>`
          )
          .join('');
        html = html.replace(regex, `<ul>${listHtml}</ul>`);
      }
    }

    return html;
  }

  /**
   * Generate unsubscribe URL
   */
  private generateUnsubscribeUrl(userId: string): string {
    const prefs = this.preferences.get(userId);
    if (!prefs) return '';
    return `${process.env.VITE_FRONTEND_FORGE_API_URL}/unsubscribe?token=${prefs.unsubscribeToken}`;
  }

  /**
   * Generate unsubscribe token
   */
  private generateUnsubscribeToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Get weekly digest template HTML
   */
  private getWeeklyDigestTemplate(): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; background: #0a0e27; color: #e0e0e0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #00d9ff; text-align: center;">Your Weekly Recommendations</h1>
            <p>Hi {{userName}},</p>
            <p>Based on your recent activity, here are your personalized recommendations:</p>
            
            <div style="margin: 20px 0;">
              {{recommendations}}
            </div>
            
            <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
              <a href="{{unsubscribeUrl}}" style="color: #00d9ff; text-decoration: none;">Unsubscribe</a>
            </p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Get weekly digest text template
   */
  private getWeeklyDigestTextTemplate(): string {
    return `
Your Weekly Recommendations

Hi {{userName}},

Based on your recent activity, here are your personalized recommendations:

{{recommendations}}

---
To unsubscribe, visit: {{unsubscribeUrl}}
    `;
  }

  /**
   * Get recommendation alert template
   */
  private getRecommendationAlertTemplate(): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; background: #0a0e27; color: #e0e0e0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #ff00ff;">Check Out: {{recommendationTitle}}</h1>
            <p>{{recommendationDescription}}</p>
            <p><strong>Why we recommend this:</strong> {{reason}}</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{recommendationUrl}}" style="background: #00d9ff; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Explore Now
              </a>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Get recommendation alert text template
   */
  private getRecommendationAlertTextTemplate(): string {
    return `
Check Out: {{recommendationTitle}}

{{recommendationDescription}}

Why we recommend this: {{reason}}

Explore: {{recommendationUrl}}
    `;
  }

  /**
   * Get analytics report template
   */
  private getAnalyticsReportTemplate(): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif; background: #0a0e27; color: #e0e0e0;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #00d9ff;">Your Portfolio Analytics Report</h1>
            <p>Hi {{userName}},</p>
            <p>Here's your analytics report for {{period}}:</p>
            
            <div style="background: #1a1f3a; padding: 15px; border-radius: 5px; margin: 20px 0;">
              {{analyticsData}}
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Get analytics report text template
   */
  private getAnalyticsReportTextTemplate(): string {
    return `
Your Portfolio Analytics Report

Hi {{userName}},

Here's your analytics report for {{period}}:

{{analyticsData}}
    `;
  }
}

export const emailService = new EmailService();
