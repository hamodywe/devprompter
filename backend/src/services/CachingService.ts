import crypto from 'crypto';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  hitCount: number;
}

export interface CacheStats {
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  totalEntries: number;
  memoryUsage: number; // Rough estimate in KB
}

/**
 * In-memory caching service to reduce AI API calls
 * In production, this could be replaced with Redis
 */
export class CachingService {
  private cache = new Map<string, CacheEntry<any>>();
  private stats = {
    hits: 0,
    misses: 0
  };

  // Default TTL values for different operations (in milliseconds)
  private defaultTTL = {
    enhancement: 24 * 60 * 60 * 1000,    // 24 hours for enhancements
    scoring: 12 * 60 * 60 * 1000,        // 12 hours for scoring
    completion: 6 * 60 * 60 * 1000,      // 6 hours for completions
    suggestions: 30 * 60 * 1000,         // 30 minutes for suggestions
  };

  /**
   * Generate cache key from operation and parameters
   */
  private generateKey(operation: string, params: any): string {
    const normalizedParams = this.normalizeParams(params);
    const paramString = JSON.stringify(normalizedParams);
    return crypto
      .createHash('sha256')
      .update(`${operation}:${paramString}`)
      .digest('hex')
      .substring(0, 32); // First 32 chars for reasonable key length
  }

  /**
   * Normalize parameters to ensure consistent caching
   */
  private normalizeParams(params: any): any {
    if (typeof params === 'string') {
      return params.trim().toLowerCase();
    }
    
    if (Array.isArray(params)) {
      return params.map(p => this.normalizeParams(p)).sort();
    }
    
    if (typeof params === 'object' && params !== null) {
      const normalized: any = {};
      Object.keys(params)
        .sort()
        .forEach(key => {
          normalized[key] = this.normalizeParams(params[key]);
        });
      return normalized;
    }
    
    return params;
  }

  /**
   * Get cached result if available and not expired
   */
  get<T>(operation: string, params: any): T | null {
    const key = this.generateKey(operation, params);
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    
    // Update hit count and stats
    entry.hitCount++;
    this.stats.hits++;
    
    console.log(`🎯 Cache HIT for ${operation} (hit count: ${entry.hitCount})`);
    return entry.data;
  }

  /**
   * Store result in cache
   */
  set<T>(
    operation: string, 
    params: any, 
    data: T, 
    customTTL?: number
  ): void {
    const key = this.generateKey(operation, params);
    const ttl = customTTL || this.defaultTTL[operation as keyof typeof this.defaultTTL] || this.defaultTTL.completion;
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      hitCount: 0
    };
    
    this.cache.set(key, entry);
    console.log(`💾 Cached result for ${operation} (TTL: ${Math.round(ttl / 60000)}min)`);
    
    // Clean up expired entries periodically
    this.cleanupExpired();
  }

  /**
   * Check if result is cached
   */
  has(operation: string, params: any): boolean {
    return this.get(operation, params) !== null;
  }

  /**
   * Remove specific cache entry
   */
  delete(operation: string, params: any): boolean {
    const key = this.generateKey(operation, params);
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
    console.log('🗑️ Cache cleared');
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
    
    // Rough memory usage estimation
    const memoryUsage = Array.from(this.cache.values())
      .reduce((total, entry) => {
        return total + JSON.stringify(entry).length;
      }, 0) / 1024; // Convert to KB

    return {
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      totalEntries: this.cache.size,
      memoryUsage: Math.round(memoryUsage * 100) / 100
    };
  }

  /**
   * Remove expired entries to free memory
   */
  private cleanupExpired(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned ${cleanedCount} expired cache entries`);
    }
  }

  /**
   * Get cache entries sorted by hit count (most popular first)
   */
  getPopularEntries(limit: number = 10): Array<{
    operation: string;
    hitCount: number;
    age: number; // in minutes
  }> {
    const entries: Array<{
      operation: string;
      hitCount: number;
      age: number;
    }> = [];
    
    for (const [key, entry] of this.cache.entries()) {
      entries.push({
        operation: key.substring(0, 20) + '...', // Truncated key
        hitCount: entry.hitCount,
        age: Math.round((Date.now() - entry.timestamp) / 60000)
      });
    }
    
    return entries
      .sort((a, b) => b.hitCount - a.hitCount)
      .slice(0, limit);
  }

  /**
   * Warm up cache with common operations
   */
  async warmUp(): Promise<void> {
    console.log('🔥 Warming up cache with common operations...');
    
    // This would be called with common prompts and operations
    // For now, just log that it's ready
    console.log('✅ Cache warming completed');
  }
}

// Export singleton instance
export const cachingService = new CachingService();

