# Caching Strategy for Zendesk Admin Extension

## Overview

This document outlines a comprehensive caching strategy for the Zendesk Admin Extension to improve performance, reduce API calls, and enhance user experience by caching frequently accessed data that doesn't change often.

## Current State Analysis

### Data Types Currently Fetched
1. **Static Reference Data** (Good candidates for caching):
   - Brands (rarely change)
   - Groups (infrequent changes)
   - Ticket Forms (occasional changes)
   - Ticket Fields (rarely change)
   - Views (occasional changes)
   - Support Addresses (rarely change)

2. **Dynamic Data** (Not suitable for long-term caching):
   - Users (frequent changes)
   - Organizations (moderate changes)
   - Tickets (real-time data)
   - Triggers (moderate changes)
   - Macros (moderate changes)
   - Dynamic Content (moderate changes)

### Current Issues
- Every search fetches fresh data from Zendesk API
- No caching of reference data
- Repeated API calls for the same data
- No ID-to-name mapping for better UX
- Slow initial load times

## Caching Strategy

### 1. Cache Architecture

#### Primary Cache (Raycast Cache API)
- **Purpose**: Store large datasets with automatic LRU eviction
- **Capacity**: 10MB (default)
- **Use Case**: Full entity lists (brands, groups, forms, etc.)

#### Secondary Cache (LocalStorage)
- **Purpose**: Store metadata, timestamps, and small configuration data
- **Use Case**: Cache invalidation timestamps, user preferences, ID mappings

### 2. Cache Keys Structure

```typescript
// Primary Cache Keys (Cache API)
`${instance.subdomain}:brands:all`
`${instance.subdomain}:groups:all`
`${instance.subdomain}:ticket_forms:all`
`${instance.subdomain}:ticket_fields:all`
`${instance.subdomain}:views:all`
`${instance.subdomain}:support_addresses:all`

// Secondary Cache Keys (LocalStorage)
`${instance.subdomain}:cache:brands:timestamp`
`${instance.subdomain}:cache:groups:timestamp`
`${instance.subdomain}:cache:forms:timestamp`
`${instance.subdomain}:cache:fields:timestamp`
`${instance.subdomain}:cache:views:timestamp`
`${instance.subdomain}:cache:addresses:timestamp`

// ID Mapping Keys (LocalStorage)
`${instance.subdomain}:mapping:brands`
`${instance.subdomain}:mapping:groups`
`${instance.subdomain}:mapping:forms`
`${instance.subdomain}:mapping:fields`
`${instance.subdomain}:mapping:views`
`${instance.subdomain}:mapping:addresses`
```

### 3. Cache Invalidation Strategy

#### Time-Based Invalidation
- **Brands**: 24 hours (rarely change)
- **Groups**: 12 hours (moderate changes)
- **Ticket Forms**: 6 hours (occasional changes)
- **Ticket Fields**: 24 hours (rarely change)
- **Views**: 6 hours (occasional changes)
- **Support Addresses**: 24 hours (rarely change)

#### Event-Based Invalidation
- Instance change
- Manual refresh action
- Cache corruption detection

### 4. Implementation Plan

#### Phase 1: Core Caching Infrastructure

1. **Create Cache Manager**
   ```typescript
   // src/utils/cacheManager.ts
   export class ZendeskCacheManager {
     private cache: Cache;
     private instance: ZendeskInstance;
     
     constructor(instance: ZendeskInstance) {
       this.cache = new Cache({ namespace: instance.subdomain });
       this.instance = instance;
     }
     
     async getCachedData<T>(key: string, fetchFunction: () => Promise<T>): Promise<T>
     async invalidateCache(entityType: string): Promise<void>
     async isCacheValid(entityType: string): Promise<boolean>
   }
   ```

2. **Create ID Mapping Utilities**
   ```typescript
   // src/utils/idMappings.ts
   export interface IdMapping {
     [id: number]: string;
   }
   
   export class IdMappingManager {
     async getMapping(entityType: string, instance: ZendeskInstance): Promise<IdMapping>
     async updateMapping(entityType: string, data: any[], instance: ZendeskInstance): Promise<void>
     async getNameById(entityType: string, id: number, instance: ZendeskInstance): Promise<string>
   }
   ```

#### Phase 2: Entity-Specific Caching

1. **Brand Caching**
   - Cache all brands for each instance
   - Create brand ID to name mapping
   - 24-hour cache duration

2. **Group Caching**
   - Cache all groups for each instance
   - Create group ID to name mapping
   - 12-hour cache duration

3. **Ticket Form Caching**
   - Cache all ticket forms for each instance
   - Create form ID to name mapping
   - 6-hour cache duration

4. **Ticket Field Caching**
   - Cache all ticket fields for each instance
   - Create field ID to name mapping
   - 24-hour cache duration

5. **View Caching**
   - Cache all views for each instance
   - Create view ID to name mapping
   - 6-hour cache duration

6. **Support Address Caching**
   - Cache all support addresses for each instance
   - Create address ID to name mapping
   - 24-hour cache duration

#### Phase 3: Enhanced Search Experience

1. **Cached Search Results**
   - Use cached data for client-side filtering
   - Fallback to API for complex searches
   - Maintain search history

2. **Smart Loading States**
   - Show cached data immediately
   - Background refresh if cache is stale
   - Progressive loading indicators

3. **ID Resolution**
   - Replace IDs with names in UI
   - Faster rendering with resolved names
   - Better user experience

### 5. Performance Benefits

#### Expected Improvements
- **Initial Load Time**: 70-90% reduction
- **Search Response Time**: 80-95% reduction for cached entities
- **API Call Reduction**: 60-80% fewer calls
- **User Experience**: Instant results for common searches

#### Memory Usage
- **Cache Size**: ~2-5MB per instance (depending on data volume)
- **ID Mappings**: ~50-100KB per instance
- **Total Overhead**: Minimal impact on extension performance

### 6. Implementation Details

#### Cache Manager Implementation
```typescript
export class ZendeskCacheManager {
  private cache: Cache;
  private instance: ZendeskInstance;
  
  constructor(instance: ZendeskInstance) {
    this.cache = new Cache({ namespace: instance.subdomain });
    this.instance = instance;
  }
  
  async getCachedData<T>(
    entityType: string, 
    fetchFunction: () => Promise<T>,
    cacheDuration: number = 24 * 60 * 60 * 1000 // 24 hours default
  ): Promise<T> {
    const cacheKey = `${this.instance.subdomain}:${entityType}:all`;
    const timestampKey = `${this.instance.subdomain}:cache:${entityType}:timestamp`;
    
    // Check if cache exists and is valid
    const cachedData = this.cache.get(cacheKey);
    const timestamp = await LocalStorage.getItem<number>(timestampKey);
    const now = Date.now();
    
    if (cachedData && timestamp && (now - timestamp) < cacheDuration) {
      return JSON.parse(cachedData);
    }
    
    // Fetch fresh data
    const freshData = await fetchFunction();
    
    // Cache the data
    this.cache.set(cacheKey, JSON.stringify(freshData));
    await LocalStorage.setItem(timestampKey, now);
    
    return freshData;
  }
  
  async invalidateCache(entityType: string): Promise<void> {
    const cacheKey = `${this.instance.subdomain}:${entityType}:all`;
    const timestampKey = `${this.instance.subdomain}:cache:${entityType}:timestamp`;
    
    this.cache.remove(cacheKey);
    await LocalStorage.removeItem(timestampKey);
  }
  
  async isCacheValid(entityType: string, cacheDuration: number): Promise<boolean> {
    const timestampKey = `${this.instance.subdomain}:cache:${entityType}:timestamp`;
    const timestamp = await LocalStorage.getItem<number>(timestampKey);
    
    if (!timestamp) return false;
    
    return (Date.now() - timestamp) < cacheDuration;
  }
}
```

#### ID Mapping Manager Implementation
```typescript
export class IdMappingManager {
  async getMapping(entityType: string, instance: ZendeskInstance): Promise<IdMapping> {
    const key = `${instance.subdomain}:mapping:${entityType}`;
    const mapping = await LocalStorage.getItem<string>(key);
    return mapping ? JSON.parse(mapping) : {};
  }
  
  async updateMapping(entityType: string, data: any[], instance: ZendeskInstance): Promise<void> {
    const key = `${instance.subdomain}:mapping:${entityType}`;
    const mapping: IdMapping = {};
    
    data.forEach(item => {
      if (item.id && item.name) {
        mapping[item.id] = item.name;
      }
    });
    
    await LocalStorage.setItem(key, JSON.stringify(mapping));
  }
  
  async getNameById(
    entityType: string, 
    id: number, 
    instance: ZendeskInstance
  ): Promise<string> {
    const mapping = await this.getMapping(entityType, instance);
    return mapping[id] || `ID: ${id}`;
  }
}
```

### 7. Integration Points

#### Updated Search Hook
```typescript
// src/hooks/useCachedEntitySearch.ts
export function useCachedEntitySearch<T>(
  entityType: string,
  instance: ZendeskInstance,
  fetchFunction: () => Promise<T[]>,
  cacheDuration: number
) {
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const cacheManager = new ZendeskCacheManager(instance);
  const mappingManager = new IdMappingManager();
  
  useEffect(() => {
    loadData();
  }, [instance, entityType]);
  
  async function loadData() {
    setIsLoading(true);
    try {
      const data = await cacheManager.getCachedData(
        entityType,
        fetchFunction,
        cacheDuration
      );
      setResults(data);
      
      // Update ID mappings
      await mappingManager.updateMapping(entityType, data, instance);
    } catch (error) {
      console.error(`Failed to load cached ${entityType}:`, error);
    } finally {
      setIsLoading(false);
    }
  }
  
  async function refreshData() {
    setIsRefreshing(true);
    try {
      await cacheManager.invalidateCache(entityType);
      await loadData();
    } finally {
      setIsRefreshing(false);
    }
  }
  
  return { results, isLoading, isRefreshing, refreshData };
}
```

#### Updated API Functions
```typescript
// Enhanced API functions with caching
export async function getCachedBrands(instance: ZendeskInstance): Promise<ZendeskBrand[]> {
  const cacheManager = new ZendeskCacheManager(instance);
  return cacheManager.getCachedData(
    'brands',
    () => searchZendeskBrands('', instance),
    24 * 60 * 60 * 1000 // 24 hours
  );
}

export async function getCachedGroups(instance: ZendeskInstance): Promise<ZendeskGroup[]> {
  const cacheManager = new ZendeskCacheManager(instance);
  return cacheManager.getCachedData(
    'groups',
    () => searchZendeskGroups(instance),
    12 * 60 * 60 * 1000 // 12 hours
  );
}
```

### 8. User Interface Enhancements

#### Cache Status Indicators
- Show cache status in search results
- Indicate when data is from cache vs fresh
- Provide manual refresh options

#### Loading States
- Show cached data immediately
- Background refresh indicator
- Progressive loading for large datasets

#### Error Handling
- Graceful fallback to API when cache fails
- Cache corruption detection and recovery
- User notification of cache issues

### 9. Testing Strategy

#### Unit Tests
- Cache manager functionality
- ID mapping accuracy
- Cache invalidation logic

#### Integration Tests
- End-to-end caching workflow
- Performance benchmarks
- Memory usage monitoring

#### User Acceptance Tests
- Search performance improvements
- UI responsiveness
- Cache refresh functionality

### 10. Monitoring and Maintenance

#### Cache Analytics
- Cache hit/miss ratios
- Memory usage tracking
- Performance metrics

#### Maintenance Tasks
- Periodic cache cleanup
- Stale data detection
- Cache size optimization

### 11. Future Enhancements

#### Advanced Features
- **Predictive Caching**: Pre-cache likely-to-be-accessed data
- **Smart Invalidation**: Webhook-based cache invalidation
- **Multi-Instance Sync**: Shared cache across instances
- **Offline Support**: Full offline functionality with cached data

#### Performance Optimizations
- **Compression**: Compress cached data to reduce storage
- **Lazy Loading**: Load cache data on-demand
- **Background Sync**: Sync cache in background threads

## Conclusion

This caching strategy will significantly improve the Zendesk Admin Extension's performance and user experience by:

1. **Reducing API calls** by 60-80%
2. **Improving response times** by 70-90%
3. **Enhancing user experience** with instant results
4. **Providing better data resolution** with ID-to-name mappings
5. **Maintaining data freshness** with intelligent cache invalidation

The implementation is designed to be:
- **Non-intrusive**: Existing functionality remains unchanged
- **Scalable**: Supports multiple instances and large datasets
- **Maintainable**: Clear separation of concerns and modular design
- **Reliable**: Robust error handling and fallback mechanisms

This strategy positions the extension for future growth while providing immediate performance benefits to users. 