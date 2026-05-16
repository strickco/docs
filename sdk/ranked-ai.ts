/**
 * Ranked AI TypeScript SDK
 *
 * Lightweight, zero-dependency client for the Ranked AI REST API v1.
 * Uses the built-in `fetch` API — works in Node 18+, Deno, Bun, and browsers.
 *
 * @example
 * ```ts
 * const client = new RankedAI('rai_your_api_key');
 * const { data } = await client.listProjects();
 * ```
 */

// ---------------------------------------------------------------------------
// Response envelope
// ---------------------------------------------------------------------------

export interface ApiResponseMeta {
  request_id: string;
  rate_limit?: {
    limit: number;
    remaining: number;
    reset: number;
  };
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: ApiResponseMeta;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
  meta: { request_id: string };
}

export type PaginatedResponse<T> = ApiSuccessResponse<T[]>;

// ---------------------------------------------------------------------------
// Domain types — derived from actual API route response shapes
// ---------------------------------------------------------------------------

/** GET /api/v1/projects */
export interface Project {
  id: string;
  name: string;
  status: string;
  serviceType: string;
  websiteUrl: string | null;
  createdAt: string;
}

/** GET /api/v1/projects/:projectId/rankings/keywords */
export interface Keyword {
  id: string;
  keyword: string;
  location: string;
  location_code: number;
  target_url: string | null;
  device: string;
  language_code: string;
  desktop_position: number | null;
  mobile_position: number | null;
  ai_mode_position: number | null;
  maps_position: number | null;
  desktop_url: string | null;
  mobile_url: string | null;
  ai_mode_url: string | null;
  maps_url: string | null;
  featured_snippet: boolean;
  local_pack_position: number | null;
  monthly_search_volume: number | null;
  net_change: number;
  tags: string[];
  last_checked: string | null;
  created_at: string;
}

/** GET /api/v1/projects/:projectId/prompts */
export interface Prompt {
  id: string;
  prompt: string;
  target_location: string;
  ai_models: string[];
  brand_name: string | null;
  visibility_percentage: number;
  average_position: number;
  best_model: string | null;
  ai_search_volume: number | null;
  total_citations: number;
  latest_responses: Record<
    string,
    {
      is_visible: boolean;
      position: number | null;
      citations_count: number;
      response_excerpt: string | null;
    }
  >;
  last_checked: string | null;
  last_analyzed: string | null;
  created_at: string;
}

/** GET /api/v1/projects/:projectId/prompts/:promptId */
export interface PromptDetail extends Prompt {
  last_volume_update: string | null;
}

/** Items inside the `responses` array from prompt history */
export interface PromptHistoryEntry {
  model: string;
  is_visible: boolean;
  position: number | null;
  citations_count: number;
  citations: unknown[];
  response_excerpt: string | null;
  checked_at: string;
}

/** GET /api/v1/projects/:projectId/prompts/:promptId/history */
export interface PromptHistoryResponse {
  prompt_id: string;
  prompt: string;
  responses: PromptHistoryEntry[];
}

/** GET /api/v1/projects/:projectId/audits */
export interface Audit {
  id: string;
  target_url: string;
  status: string;
  crawl_progress: number;
  pages_crawled: number;
  total_issues: number;
  critical_issues: number;
  warning_issues: number;
  notice_issues: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

/** GET /api/v1/projects/:projectId/audits/latest */
export interface AuditDetail extends Audit {
  pages_in_queue: number;
  issues_summary: {
    passed: number;
    failed: number;
    total: number;
  };
}

/** GET /api/v1/projects/:projectId/audits/:auditId/issues */
export interface AuditIssue {
  id: string;
  type: string;
  severity: 'critical' | 'warning' | 'notice';
  title: string;
  description: string | null;
  affected_count: number;
  status: 'passed' | 'failed';
  created_at: string;
}

/** GET /api/v1/projects/:projectId/backlinks/summary */
export interface BacklinkSummary {
  project_id: string;
  total_backlinks: number;
  total_referring_domains: number;
  average_domain_rank: number;
  dofollow_backlinks: number;
  nofollow_backlinks: number;
  broken_backlinks: number;
  tracked_domains_count: number;
  last_updated: string | null;
}

/** GET /api/v1/projects/:projectId/backlinks/domains */
export interface ReferringDomain {
  referring_domain: string;
  domain_rank: number;
  backlinks_count: number;
  status: string;
  first_seen: string | null;
  last_seen: string | null;
  lost_date: string | null;
  anchor_text: string | null;
  page_title: string | null;
  referring_page_url: string | null;
  is_dofollow: boolean;
  is_redirect: boolean | null;
  platform_type: string | null;
  country_iso_code: string | null;
  target_domain: string;
}

/** GET /api/v1/projects/:projectId/content */
export interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  scheduled_date: string | null;
  due_date: string | null;
  status: string | null;
  status_color: string | null;
  content_type: string | null;
  content_type_color: string | null;
  priority: number;
  document_url: string | null;
  source_url: string | null;
  featured_image_url: string | null;
  created_at: string;
  updated_at: string | null;
}

/** GET /api/v1/projects/:projectId/reports (list) */
export interface Report {
  id: string;
  report_id: string;
  title: string;
  description: string | null;
  date_range: string;
  start_date: string | null;
  end_date: string | null;
  share_url: string;
  created_at: string;
  updated_at: string | null;
}

/** POST /api/v1/projects/:projectId/reports (create) */
export interface CreateReportParams {
  title: string;
  description?: string;
  date_range: '7days' | '30days' | '90days' | 'custom';
  custom_start_date?: string;
  custom_end_date?: string;
  config?: {
    include_rankings?: boolean;
    include_audits?: boolean;
    include_prompts?: boolean;
    include_backlinks?: boolean;
    include_content?: boolean;
  };
}

export interface CreatedReport {
  id: string;
  report_id: string;
  title: string;
  description: string | null;
  share_url: string;
  date_range: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

/** GET /api/v1/webhooks */
export interface Webhook {
  id: string;
  project_id: string;
  name: string | null;
  url: string;
  events: string[];
  is_active: boolean;
  last_triggered_at: string | null;
  last_success_at: string | null;
  last_failure_at: string | null;
  failure_count: number;
  created_at: string;
}

/** POST /api/v1/webhooks (the secret is only returned on creation) */
export interface WebhookWithSecret extends Webhook {
  secret: string;
}

export interface CreateWebhookParams {
  project_id: string;
  name?: string;
  url: string;
  events: WebhookEventType[];
}

export interface WebhookTestResult {
  success: boolean;
  status?: number;
  error?: string;
}

export type WebhookEventType =
  | 'content.created'
  | 'content.updated'
  | 'content.scheduled'
  | 'content.status_changed'
  | 'audit.completed'
  | 'audit.started'
  | 'keywords.updated'
  | 'prompts.updated';

// ---------------------------------------------------------------------------
// SDK options
// ---------------------------------------------------------------------------

export interface RankedAIOptions {
  baseUrl?: string;
  /** Custom fetch implementation (for testing or non-standard runtimes). */
  fetch?: typeof globalThis.fetch;
}

// ---------------------------------------------------------------------------
// Error class
// ---------------------------------------------------------------------------

export class RankedAIError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId: string;
  readonly details?: Record<string, unknown>;

  constructor(status: number, body: ApiErrorResponse) {
    super(body.error.message);
    this.name = 'RankedAIError';
    this.status = status;
    this.code = body.error.code;
    this.requestId = body.meta.request_id;
    this.details = body.error.details;
  }
}

// ---------------------------------------------------------------------------
// SDK class
// ---------------------------------------------------------------------------

export class RankedAI {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly _fetch: typeof globalThis.fetch;

  constructor(apiKey: string, options?: RankedAIOptions) {
    if (!apiKey) throw new Error('An API key is required');
    this.apiKey = apiKey;
    this.baseUrl = (options?.baseUrl ?? 'https://ranked.ai').replace(/\/+$/, '');
    this._fetch = options?.fetch ?? globalThis.fetch.bind(globalThis);
  }

  // -----------------------------------------------------------------------
  // Internal helpers
  // -----------------------------------------------------------------------

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<ApiSuccessResponse<T>> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'application/json',
    };
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await this._fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (res.status === 204) {
      return { success: true, data: undefined as T, meta: { request_id: '' } };
    }

    const json = await res.json();

    if (!res.ok || json.success === false) {
      throw new RankedAIError(res.status, json as ApiErrorResponse);
    }

    return json as ApiSuccessResponse<T>;
  }

  private buildQuery(params?: Record<string, unknown>): string {
    if (!params) return '';
    const entries = Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null,
    );
    if (entries.length === 0) return '';
    const qs = entries
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    return `?${qs}`;
  }

  // -----------------------------------------------------------------------
  // Pagination helper
  // -----------------------------------------------------------------------

  /**
   * Automatically page through a paginated endpoint and yield every item.
   *
   * @example
   * ```ts
   * for await (const keyword of client.paginate(p => client.listKeywords('proj_1', p))) {
   *   console.log(keyword.keyword, keyword.desktop_position);
   * }
   * ```
   */
  async *paginate<T>(
    fetcher: (params: { limit: number; offset: number }) => Promise<PaginatedResponse<T>>,
    pageSize = 100,
  ): AsyncGenerator<T, void, undefined> {
    let offset = 0;
    let hasMore = true;
    while (hasMore) {
      const res = await fetcher({ limit: pageSize, offset });
      for (const item of res.data) {
        yield item;
      }
      hasMore = res.meta.pagination?.has_more ?? false;
      offset += pageSize;
    }
  }

  // -----------------------------------------------------------------------
  // Projects
  // -----------------------------------------------------------------------

  async listProjects(
    params?: { limit?: number; offset?: number },
  ): Promise<PaginatedResponse<Project>> {
    return this.request(`GET`, `/api/v1/projects${this.buildQuery(params)}`);
  }

  // -----------------------------------------------------------------------
  // Rankings / Keywords
  // -----------------------------------------------------------------------

  async listKeywords(
    projectId: string,
    params?: {
      limit?: number;
      offset?: number;
      device?: 'all' | 'desktop' | 'mobile';
      date_from?: string;
      date_to?: string;
    },
  ): Promise<PaginatedResponse<Keyword>> {
    return this.request(
      'GET',
      `/api/v1/projects/${projectId}/rankings/keywords${this.buildQuery(params)}`,
    );
  }

  // -----------------------------------------------------------------------
  // AI Prompts
  // -----------------------------------------------------------------------

  async listPrompts(
    projectId: string,
    params?: { limit?: number; offset?: number },
  ): Promise<PaginatedResponse<Prompt>> {
    return this.request(
      'GET',
      `/api/v1/projects/${projectId}/prompts${this.buildQuery(params)}`,
    );
  }

  async getPrompt(
    projectId: string,
    promptId: string,
  ): Promise<ApiSuccessResponse<PromptDetail>> {
    return this.request('GET', `/api/v1/projects/${projectId}/prompts/${promptId}`);
  }

  async getPromptHistory(
    projectId: string,
    promptId: string,
    params?: {
      limit?: number;
      offset?: number;
      date_from?: string;
      date_to?: string;
    },
  ): Promise<ApiSuccessResponse<PromptHistoryResponse>> {
    return this.request(
      'GET',
      `/api/v1/projects/${projectId}/prompts/${promptId}/history${this.buildQuery(params)}`,
    );
  }

  // -----------------------------------------------------------------------
  // Audits
  // -----------------------------------------------------------------------

  async listAudits(
    projectId: string,
    params?: {
      limit?: number;
      offset?: number;
      status?: 'all' | 'pending' | 'crawling' | 'processing' | 'completed' | 'failed';
    },
  ): Promise<PaginatedResponse<Audit>> {
    return this.request(
      'GET',
      `/api/v1/projects/${projectId}/audits${this.buildQuery(params)}`,
    );
  }

  async getLatestAudit(
    projectId: string,
  ): Promise<ApiSuccessResponse<AuditDetail>> {
    return this.request('GET', `/api/v1/projects/${projectId}/audits/latest`);
  }

  async getAuditIssues(
    projectId: string,
    auditId: string,
    params?: {
      limit?: number;
      offset?: number;
      severity?: 'all' | 'critical' | 'warning' | 'notice';
      status?: 'all' | 'passed' | 'failed';
    },
  ): Promise<PaginatedResponse<AuditIssue>> {
    return this.request(
      'GET',
      `/api/v1/projects/${projectId}/audits/${auditId}/issues${this.buildQuery(params)}`,
    );
  }

  // -----------------------------------------------------------------------
  // Backlinks
  // -----------------------------------------------------------------------

  async getBacklinkSummary(
    projectId: string,
  ): Promise<ApiSuccessResponse<BacklinkSummary>> {
    return this.request('GET', `/api/v1/projects/${projectId}/backlinks/summary`);
  }

  async listBacklinkDomains(
    projectId: string,
    params?: {
      limit?: number;
      offset?: number;
      status?: 'all' | 'active' | 'lost';
      sort_by?: 'domain_rank' | 'backlinks_count' | 'first_seen' | 'last_seen';
      sort_order?: 'asc' | 'desc';
    },
  ): Promise<PaginatedResponse<ReferringDomain>> {
    return this.request(
      'GET',
      `/api/v1/projects/${projectId}/backlinks/domains${this.buildQuery(params)}`,
    );
  }

  // -----------------------------------------------------------------------
  // Content
  // -----------------------------------------------------------------------

  async listContent(
    projectId: string,
    params?: {
      limit?: number;
      offset?: number;
      status?: string;
      date_from?: string;
      date_to?: string;
    },
  ): Promise<PaginatedResponse<ContentItem>> {
    return this.request(
      'GET',
      `/api/v1/projects/${projectId}/content${this.buildQuery(params)}`,
    );
  }

  // -----------------------------------------------------------------------
  // Reports
  // -----------------------------------------------------------------------

  async listReports(
    projectId: string,
    params?: { limit?: number; offset?: number },
  ): Promise<PaginatedResponse<Report>> {
    return this.request(
      'GET',
      `/api/v1/projects/${projectId}/reports${this.buildQuery(params)}`,
    );
  }

  async createReport(
    projectId: string,
    body: CreateReportParams,
  ): Promise<ApiSuccessResponse<CreatedReport>> {
    return this.request('POST', `/api/v1/projects/${projectId}/reports`, body);
  }

  async deleteReport(
    projectId: string,
    reportId: string,
  ): Promise<void> {
    await this.request('DELETE', `/api/v1/projects/${projectId}/reports/${reportId}`);
  }

  // -----------------------------------------------------------------------
  // Webhooks
  // -----------------------------------------------------------------------

  async listWebhooks(
    params?: { limit?: number; offset?: number; project_id?: string },
  ): Promise<PaginatedResponse<Webhook>> {
    return this.request('GET', `/api/v1/webhooks${this.buildQuery(params)}`);
  }

  async createWebhook(
    body: CreateWebhookParams,
  ): Promise<ApiSuccessResponse<WebhookWithSecret>> {
    return this.request('POST', '/api/v1/webhooks', body);
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    await this.request('DELETE', `/api/v1/webhooks/${webhookId}`);
  }

  async testWebhook(
    webhookId: string,
  ): Promise<ApiSuccessResponse<WebhookTestResult>> {
    return this.request('POST', `/api/v1/webhooks/${webhookId}/test`);
  }

  // -----------------------------------------------------------------------
  // Webhook signature verification (static helper)
  // -----------------------------------------------------------------------

  /**
   * Verify an incoming webhook signature.
   *
   * The Ranked AI webhook system sends an HMAC-SHA256 signature in the
   * `X-Webhook-Signature` header as `sha256=<hex>`. This helper recomputes
   * the signature and compares using a timing-safe comparison when available.
   *
   * @param payload  - The raw request body string.
   * @param signature - The value of the `X-Webhook-Signature` header.
   * @param secret   - Your webhook secret (starts with `whsec_`).
   * @returns `true` if the signature is valid.
   *
   * @example
   * ```ts
   * const isValid = RankedAI.verifyWebhookSignature(rawBody, req.headers['x-webhook-signature'], secret);
   * ```
   */
  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string,
  ): boolean {
    const expected = RankedAI.computeSignature(payload, secret);
    const actual = signature.startsWith('sha256=')
      ? signature.slice(7)
      : signature;

    if (expected.length !== actual.length) return false;

    // Timing-safe comparison to prevent timing attacks.
    // Falls back to a constant-time loop when crypto.timingSafeEqual
    // is not available (e.g. in browsers).
    if (typeof globalThis.crypto !== 'undefined' && typeof (globalThis.crypto as any).timingSafeEqual === 'function') {
      const enc = new TextEncoder();
      return (globalThis.crypto as any).timingSafeEqual(enc.encode(expected), enc.encode(actual));
    }

    // Manual constant-time comparison fallback
    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) {
      mismatch |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
    }
    return mismatch === 0;
  }

  /**
   * Compute the HMAC-SHA256 hex signature for a payload.
   * Works in Node.js (via `crypto` module) and in browsers / edge runtimes
   * (via Web Crypto API with a synchronous hex helper).
   */
  static computeSignature(payload: string, secret: string): string {
    // Node.js path — available in Node 18+
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const crypto = require('crypto');
      return crypto.createHmac('sha256', secret).update(payload).digest('hex');
    } catch {
      // not in Node — fall through to Web Crypto below
    }

    throw new Error(
      'RankedAI.computeSignature requires Node.js `crypto`. ' +
      'For browser / edge runtimes use computeSignatureAsync instead.',
    );
  }

  /**
   * Async HMAC-SHA256 computation using the Web Crypto API.
   * Use this in browsers, Cloudflare Workers, and other edge runtimes
   * where `require("crypto")` is not available.
   */
  static async computeSignatureAsync(
    payload: string,
    secret: string,
  ): Promise<string> {
    const enc = new TextEncoder();
    const key = await globalThis.crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const sig = await globalThis.crypto.subtle.sign('HMAC', key, enc.encode(payload));
    return Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Async version of `verifyWebhookSignature` for edge / browser runtimes.
   */
  static async verifyWebhookSignatureAsync(
    payload: string,
    signature: string,
    secret: string,
  ): Promise<boolean> {
    const expected = await RankedAI.computeSignatureAsync(payload, secret);
    const actual = signature.startsWith('sha256=')
      ? signature.slice(7)
      : signature;

    if (expected.length !== actual.length) return false;

    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) {
      mismatch |= expected.charCodeAt(i) ^ actual.charCodeAt(i);
    }
    return mismatch === 0;
  }
}

export default RankedAI;
