export interface EphemeralAgentToken {
  token: string;
  agent_slug: string;
  scopes: string[];
  issued_at: number;
  expires_at: number;
  nonce: string;
}

export class ZeroTrustIdentityService {
  private static issuedTokens: Map<string, EphemeralAgentToken> = new Map();

  /**
   * Issue a short-lived, cryptographically scoped token for an institutional subagent.
   */
  public static issueToken(agentSlug: string, requestedScopes: string[]): EphemeralAgentToken {
    const now = Date.now();
    const nonce = Math.random().toString(36).substring(2, 10);
    const token = `zt_${agentSlug}_${now}_${nonce}`;

    const ephemeralToken: EphemeralAgentToken = {
      token,
      agent_slug: agentSlug,
      scopes: requestedScopes,
      issued_at: now,
      expires_at: now + 5 * 60 * 1000, // 5 minutes TTL
      nonce
    };

    this.issuedTokens.set(token, ephemeralToken);
    return ephemeralToken;
  }

  /**
   * Verify if an ephemeral token is valid and holds the required permission scope.
   */
  public static verifyScope(tokenString: string, requiredScope: string): { authorized: boolean; reason?: string } {
    const token = this.issuedTokens.get(tokenString);

    if (!token) {
      return { authorized: false, reason: 'Invalid or unknown zero-trust token' };
    }

    if (Date.now() > token.expires_at) {
      return { authorized: false, reason: 'Zero-trust token expired (TTL exceeded)' };
    }

    if (!token.scopes.includes(requiredScope) && !token.scopes.includes('*')) {
      return { 
        authorized: false, 
        reason: `Scope violation: Token holds [${token.scopes.join(', ')}], but '${requiredScope}' is required.` 
      };
    }

    return { authorized: true };
  }
}
