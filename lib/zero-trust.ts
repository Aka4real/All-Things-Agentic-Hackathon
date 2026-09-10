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
   * Prune expired tokens from memory.
   */
  private static pruneExpiredTokens(): void {
    const now = Date.now();
    for (const [key, token] of this.issuedTokens.entries()) {
      if (now > token.expires_at) {
        this.issuedTokens.delete(key);
      }
    }
  }

  /**
   * Issue a short-lived, cryptographically scoped token for an institutional subagent.
   */
  public static issueToken(agentSlug: string, requestedScopes: string[]): EphemeralAgentToken {
    this.pruneExpiredTokens();
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
   * Verify if an ephemeral token is valid, belongs to the caller, and holds the required permission scope.
   */
  public static verifyScope(
    tokenString: string, 
    requiredScope: string,
    callerAgentSlug?: string
  ): { authorized: boolean; reason?: string } {
    this.pruneExpiredTokens();
    const token = this.issuedTokens.get(tokenString);

    if (!token) {
      return { authorized: false, reason: 'Invalid or unknown zero-trust token' };
    }

    if (Date.now() > token.expires_at) {
      this.issuedTokens.delete(tokenString);
      return { authorized: false, reason: 'Zero-trust token expired (TTL exceeded)' };
    }

    if (callerAgentSlug && token.agent_slug !== callerAgentSlug) {
      return {
        authorized: false,
        reason: `Identity violation: Token was issued to '${token.agent_slug}', but caller is '${callerAgentSlug}'.`
      };
    }

    if (!token.scopes.includes(requiredScope) && !token.scopes.includes('*')) {
      return { 
        authorized: false, 
        reason: `Scope violation: Token holds [${token.scopes.join(', ')}], but '${requiredScope}' is required.` 
      };
    }

    return { authorized: true };
  }

  /**
   * Return number of active unexpired tokens.
   */
  public static getActiveTokenCount(): number {
    this.pruneExpiredTokens();
    return this.issuedTokens.size;
  }
}

