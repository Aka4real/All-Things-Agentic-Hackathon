export interface PolicyEvaluationResult {
  allowed: boolean;
  requires_human_approval: boolean;
  policy_name: string;
  reason: string;
}

export class AgentGateway {
  private static SPEND_APPROVAL_THRESHOLD_USD = 50000;
  private static MAX_RETRY_LIMIT = 2;

  /**
   * Evaluate a transaction against Enterprise Risk & Spend Policies.
   */
  public static evaluatePolicy(poAmountUsd: number, riskScore: number, supplierSanctionsRisk: string): PolicyEvaluationResult {
    // 1. Prohibited sanction check
    if (supplierSanctionsRisk === 'PROHIBITED') {
      return {
        allowed: false,
        requires_human_approval: false,
        policy_name: 'POL-SANCTIONS-ZERO-TOLERANCE',
        reason: 'CRITICAL VIOLATION: Transaction involves a prohibited sanctioned entity.'
      };
    }

    // 2. High Value Purchase Order Gate
    if (poAmountUsd > this.SPEND_APPROVAL_THRESHOLD_USD) {
      return {
        allowed: true,
        requires_human_approval: true,
        policy_name: 'POL-SPEND-TIER-2',
        reason: `Purchase Order amount ($${poAmountUsd.toLocaleString()}) exceeds the automated authorization threshold ($${this.SPEND_APPROVAL_THRESHOLD_USD.toLocaleString()}). Human Officer Sign-Off required.`
      };
    }

    // 3. Elevated Risk Score Gate
    if (riskScore >= 70) {
      return {
        allowed: true,
        requires_human_approval: true,
        policy_name: 'POL-ELEVATED-RISK-AUDIT',
        reason: `Composite supplier risk score is ${riskScore}/100. Secondary Procurement Director sign-off mandated.`
      };
    }

    return {
      allowed: true,
      requires_human_approval: false,
      policy_name: 'POL-STANDARD-AUTO-APPROVAL',
      reason: 'Transaction is within standard automated risk and spend boundaries.'
    };
  }

  /**
   * Check recursion loop limiter
   */
  public static checkRecursion(retryCount: number): boolean {
    return retryCount < this.MAX_RETRY_LIMIT;
  }
}
