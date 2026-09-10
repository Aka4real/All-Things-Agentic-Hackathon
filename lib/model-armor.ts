import { SecurityEvent } from './types';

export interface ModelArmorScanResult {
  is_clean: boolean;
  threats_detected: string[];
  sanitized_text: string;
  security_event?: SecurityEvent;
}

export class ModelArmor {
  private static injectionPatterns: RegExp[] = [
    /ignore\s+(?:all\s+)?(?:previous|prior|strict)\s+(?:instructions|rules|directives|prompts|compliance|checks|rubrics)/i,
    /disregard\s+(?:all\s+)?(?:prior\s+|strict\s+)?(?:compliance|rules|checks|guidelines|rubrics|instructions|directives)/i,
    /system\s+(?:override|update|reset):?/i,
    /you\s+are\s+now\s+(?:acting\s+as|in)\s+(?:developer|unrestricted|god|dan)\s+mode/i,
    /grant\s+100%\s+advance\s+payment/i,
    /transfer\s+funds\s+immediately/i,
    /bypass\s+(?:ofac|sanctions|audit|verification|compliance|approval|sdn(?:\s+register)?|policy\s+gate)/i,
    /(?:mark|set)\s+(?:the\s+)?(?:compliance\s+|esg\s+|risk\s+)?(?:score|rubric|output)\s+(?:as\s+|to\s+)?100(?:\/100)?/i,
    /override\s+(?:safety|guardrails|compliance|policy|rules)/i,
    /jailbreak/i,
    /DAN\s+mode/i
  ];

  private static piiPatterns: { regex: RegExp; placeholder: string; label: string }[] = [
    // 1. Credit Card Numbers: Visa, MC (16 digits), Amex (15 digits, 4-6-5), Diners (14 digits)
    {
      regex: /\b3[47]\d{2}[-\s]?\d{6}[-\s]?\d{5}\b/g,
      placeholder: '[REDACTED_AMEX_CARD]',
      label: 'American Express Card Number'
    },
    {
      regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
      placeholder: '[REDACTED_CREDIT_CARD]',
      label: 'Credit Card Number (Visa/MC)'
    },
    // 2. SSN / Tax ID with or without hyphens
    {
      regex: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
      placeholder: '[REDACTED_SSN_TIN]',
      label: 'Social Security / Tax ID'
    },
    // 3. Email Addresses
    {
      regex: /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g,
      placeholder: '[REDACTED_EMAIL]',
      label: 'Email Address'
    },
    // 4. Bank IBAN / Account Numbers (supports standard 4-character spaced groupings e.g. GB29 NWBK ...)
    {
      regex: /\b[A-Z]{2}\d{2}(?:[\s-]?[A-Z0-9]{4}){2,7}(?:[\s-]?[A-Z0-9]{1,4})?\b/gi,
      placeholder: '[REDACTED_IBAN_ACCOUNT]',
      label: 'Bank IBAN / Account'
    }
  ];

  /**
   * Scan and sanitize any inbound or outbound payload against Prompt Injection & PII leaks.
   * Handles obfuscation: zero-width spaces, multi-line formatting, and varied phrasing.
   */
  public static scan(input: string, runId?: string): ModelArmorScanResult {
    const threats: string[] = [];
    
    // Normalize string: strip zero-width characters and normalize tabs/newlines
    const normalized = input
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/[\t\r\n]+/g, ' ');

    let sanitized = normalized;
    let isInjection = false;
    let isPii = false;

    // 1. Prompt Injection Scanning (Gemma-4-Guardrail Heuristics)
    for (const pattern of this.injectionPatterns) {
      if (pattern.test(normalized)) {
        threats.push(`Prompt Injection Signature: ${pattern.toString()}`);
        sanitized = sanitized.replace(pattern, (match) => `[REDACTED_ADVERSARIAL_PAYLOAD: ${match}]`);
        isInjection = true;
      }
    }

    // 2. PII / Sensitive Financial Data Redaction
    for (const pii of this.piiPatterns) {
      if (pii.regex.test(sanitized)) {
        threats.push(`PII Detected: ${pii.label}`);
        sanitized = sanitized.replace(pii.regex, pii.placeholder);
        isPii = true;
      }
    }

    if (threats.length > 0) {
      const threatType = isInjection ? 'prompt_injection' : isPii ? 'pii_leakage' : 'tool_poisoning';
      const severity = isInjection ? 'critical' : 'high';

      const secEvent: SecurityEvent = {
        id: `sec-armor-${Date.now()}`,
        run_id: runId,
        threat_type: threatType,
        severity,
        raw_payload: input,
        sanitized_payload: sanitized,
        action_taken: isInjection ? 'blocked' : 'redacted',
        shield_engine: 'Gemma-4-Guardrail + Model Armor Deterministic Filter',
        created_at: new Date().toISOString()
      };

      return {
        is_clean: false,
        threats_detected: threats,
        sanitized_text: sanitized,
        security_event: secEvent
      };
    }

    return {
      is_clean: true,
      threats_detected: [],
      sanitized_text: input
    };
  }

  /**
   * Tool poisoning defense: Validate external JSON responses against expected contract.
   */
  public static validateToolResponse<T>(responseObj: unknown, requiredKeys: (keyof T)[]): boolean {
    if (!responseObj || typeof responseObj !== 'object') {
      return false;
    }
    const obj = responseObj as Record<string, unknown>;
    for (const key of requiredKeys) {
      if (!(key in obj)) {
        return false;
      }
    }
    return true;
  }
}
