import { SecurityEvent } from './types';

export interface ModelArmorScanResult {
  is_clean: boolean;
  threats_detected: string[];
  sanitized_text: string;
  security_event?: SecurityEvent;
}

export class ModelArmor {
  private static injectionPatterns: RegExp[] = [
    /ignore\s+(all\s+)?(previous|prior)\s+(instructions|rules|directives|prompts|compliance|checks)/i,
    /disregard\s+(all\s+)?(compliance|rules|checks|guidelines|rubrics|instructions)/i,
    /system\s+override/i,
    /you\s+are\s+now\s+in\s+(developer|unrestricted|god)\s+mode/i,
    /grant\s+100%\s+advance\s+payment/i,
    /transfer\s+funds\s+immediately/i,
    /bypass\s+(ofac|sanctions|audit|verification|compliance|approval)/i,
    /mark\s+esg\s+(score\s+)?(as\s+)?100(\/100)?/i,
    /jailbreak/i,
    /DAN\s+mode/i
  ];

  private static piiPatterns: { regex: RegExp; placeholder: string; label: string }[] = [
    {
      regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
      placeholder: '[REDACTED_CREDIT_CARD]',
      label: 'Credit Card Number'
    },
    {
      regex: /\b\d{3}-\d{2}-\d{4}\b/g,
      placeholder: '[REDACTED_SSN_TIN]',
      label: 'Social Security / Tax ID'
    },
    {
      regex: /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g,
      placeholder: '[REDACTED_EMAIL]',
      label: 'Email Address'
    },
    {
      regex: /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b/g,
      placeholder: '[REDACTED_IBAN_ACCOUNT]',
      label: 'Bank IBAN / Account'
    }
  ];

  /**
   * Scan and sanitize any inbound or outbound string payload against Prompt Injection & PII leaks.
   */
  public static scan(input: string, runId?: string): ModelArmorScanResult {
    const threats: string[] = [];
    let sanitized = input;
    let isInjection = false;
    let isPii = false;

    // 1. Prompt Injection Scanning (Gemma-2-Guardrail Heuristics)
    for (const pattern of this.injectionPatterns) {
      if (pattern.test(input)) {
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
        shield_engine: 'Gemma-2-Guardrail + Model Armor Deterministic Filter',
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
