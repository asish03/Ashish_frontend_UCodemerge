"""
Redis client configuration
"""

import redis.asyncio as redis
from app.core.config import settings
import logging
import json
from typing import Any, Optional

logger = logging.getLogger(__name__)


class RedisClient:
    """Redis client wrapper with helper methods"""
    
    def __init__(self):
        self.redis: Optional[redis.Redis] = None
    
    async def connect(self):
        """Connect to Redis"""
        try:
            self.redis = await redis.from_url(
                settings.REDIS_URL,
                max_connections=settings.REDIS_MAX_CONNECTIONS,
                decode_responses=True
            )
            await self.redis.ping()
            logger.info("Redis connected successfully")
        except Exception as e:
            logger.error(f"Redis connection failed: {e}")
            raise
    
    async def close(self):
        """Close Redis connection"""
        if self.redis:
            await self.redis.close()
            logger.info("Redis connection closed")
    
    async def ping(self):
        """Ping Redis server"""
        if not self.redis:
            await self.connect()
        return await self.redis.ping()
    
    async def get(self, key: str) -> Optional[str]:
        """Get value by key"""
        if not self.redis:
            await self.connect()
        return await self.redis.get(key)
    
    async def set(
        self,
        key: str,
        value: Any,
        ex: Optional[int] = None
    ) -> bool:
        """Set key-value pair with optional expiration"""
        if not self.redis:
            await self.connect()
        
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        
        return await self.redis.set(key, value, ex=ex or settings.CACHE_TTL)
    
    async def delete(self, key: str) -> int:
        """Delete key"""
        if not self.redis:
            await self.connect()
        return await self.redis.delete(key)
    
    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        if not self.redis:
            await self.connect()
        return await self.redis.exists(key) > 0
    
    async def get_json(self, key: str) -> Optional[dict]:
        """Get JSON value by key"""
        value = await self.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                logger.error(f"Failed to decode JSON for key: {key}")
                return None
        return None
    
    async def set_json(
        self,
        key: str,
        value: dict,
        ex: Optional[int] = None
    ) -> bool:
        """Set JSON value"""
        return await self.set(key, json.dumps(value), ex=ex)
    
    async def increment(self, key: str, amount: int = 1) -> int:
        """Increment value"""
        if not self.redis:
            await self.connect()
        return await self.redis.incrby(key, amount)
    
    async def expire(self, key: str, seconds: int) -> bool:
        """Set expiration on key"""
        if not self.redis:
            await self.connect()
        return await self.redis.expire(key, seconds)
    
    async def ttl(self, key: str) -> int:
        """Get time to live"""
        if not self.redis:
            await self.connect()
        return await self.redis.ttl(key)
    
    async def keys(self, pattern: str) -> list:
        """Get keys matching pattern"""
        if not self.redis:
            await self.connect()
        return await self.redis.keys(pattern)
    
    async def flush_all(self):
        """Flush all keys (use with caution!)"""
        if not self.redis:
            await self.connect()
        return await self.redis.flushall()


# Create singleton instance
redis_client = RedisClient()
