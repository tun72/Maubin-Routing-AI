export interface Place {
  id: string;
  name: string;
  address: string;
  category: string;
  distance: string;
  estimatedTime: string;
  image: string;
  rating?: number;
  visits?: number;
  lastVisited?: string;
}

export interface User {
  _id: string;
  username: string;
  hasEmailConfig?: boolean;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  is_success: boolean;
  user: User;
  error?: string;
}
// Email config types
export interface EmailConfig {
  provider: "zoho" | "gmail";
  email: string;
  appPassword: string;
}

export interface EmailConfigResponse {
  success: boolean;
  data: {
    _id: string;
    username: string;
    hasEmailConfig: boolean;
  };
  error?: string;
}

// Lead types
export interface Lead {
  _id: string;
  email: string;
  job_title?: string;
  company_name?: string;
  other_job_data: Record<string, any>;
  status: "converted" | "not_converted";
  createdAt: string;
  updatedAt: string;
}

export interface LeadResponse {
  success: boolean;
  data: {
    leads: Lead[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
  error?: string;
}

export interface ImportLeadRequest {
  leads: Array<{
    email: string;
    job_title?: string;
    company_name?: string;
    [key: string]: any;
  }>;
}

export interface ImportLeadResponse {
  success: boolean;
  data: {
    importedCount: number;
    totalCount: number;
    errors?: string[];
  };
  error?: string;
}

export interface ConvertAndScheduleRequest {
  leadIds: string[];
  templateId?: string;
}

export interface ConvertAndScheduleResponse {
  success: boolean;
  data: {
    convertedCount: number;
    totalCount: number;
    emails: any[];
    scheduleInfo: {
      startTime: string;
      endTime: string;
      intervalMinutes: number;
    };
    errors?: string[];
  };
  error?: string;
}

// Email types
export interface Email {
  _id: string;
  user: string;
  lead?: string;
  to: string;
  from?: string;
  subject: string;
  message: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  scheduleTime?: string;
  sentAt?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
  isClicked?: boolean;
}

export interface EmailResponse {
  success: boolean;
  data: {
    emails: Email[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
  error?: string;
}

export interface GenerateDraftRequest {
  leadIds: string[];
  templateId?: string;
}

export interface GenerateDraftResponse {
  success: boolean;
  data: {
    generatedCount: number;
    totalCount: number;
    drafts: Email[];
    errors?: string[];
  };
  error?: string;
}

export interface SendEmailRequest {
  draftIds: string[];
}

export interface ScheduleEmailRequest {
  draftIds: string[];
  scheduleTime: string;
}

export interface RescheduleFailedEmailRequest {
  emailIds: string[];
  scheduleTime: string;
}

export interface RetryEmailRequest {
  emailIds: string[];
}

export interface SendEmailResponse {
  success: boolean;
  data: {
    sentCount: number;
    totalCount: number;
    errors?: string[];
  };
  error?: string;
}

export interface EmailStatsResponse {
  success: boolean;
  data: {
    overview: {
      totalEmails: number;
      totalSent: number;
      totalDrafts: number;
      totalFailed: number;
      totalScheduled: number;
      totalLeads: number;
      totalSystemLeads: number;
      clickedEmails: number;
      overallClickRate: number;
    };
    today: {
      sent: number;
      clicked: number;
      failed: number;
      drafts: number;
      leads: number;
      systemLeads: number;
      clickRate: number;
    };
    yesterday: {
      sent: number;
      clicked: number;
      failed: number;
      systemLeads: number;
      leads: number;
      clickRate: number;
    };
    growth: {
      sent: number;
      clicked: number;
      failed: number;
      systemLeads: number;
      leads: number;
      clickRate: number;
    };
    charts: {
      dailyPerformance: Array<{
        date: string;
        sent: number;
        clicked: number;
        failed: number;
        systemLeads: number;
        clickRate: number;
      }>;
      statusDistribution: Array<{
        name: string;
        value: number;
        color: string;
      }>;
      monthlySystemLeads: Array<{
        date: string;
        count: number;
      }>;
      weeklyComparison: {
        currentWeek: {
          sent: number;
          clicked: number;
          failed: number;
        };
      };
    };
    kpis: {
      successRate: number;
      failureRate: number;
      engagementRate: number;
      productivityScore: number;
    };
  };
  error?: string;
}

// Define Engineer interface
export interface Engineer {
  _id: string;
  name: string;
  price: string;
  resume_link?: string;
}

// Fix Template interface
export interface Template {
  _id: string;
  name: string;
  subject: string;
  content: string;
  price?: string;
  engineers?: Engineer[];
  extraPrompt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TemplateOption {
  _id: string;
  name: string;
  engineers?: Array<{
    _id: string;
    name: string;
    price: string;
  }>;
}

// Facebook Lead types
export interface FbLead {
  id: number;
  content: string;
  created_at: string;
  group_link: string | null;
  is_send_message: number;
  message: string;
  profile_link: string;
  profile_name: string;
}

export interface FbLeadsResponse {
  count: number;
  limit: number;
  page: number;
  posts: FbLead[];
  total: number;
  total_pages: number;
}
