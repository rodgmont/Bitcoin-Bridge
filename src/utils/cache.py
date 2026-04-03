from datetime import datetime
from typing import Any, Dict

class SimpleCache:
    """A simplistic in-memory cache to store API responses temporarily."""
    
    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}
        
    def get(self, key: str) -> Any:
        entry = self._cache.get(key)
        if entry:
            return entry['value']
        return None
        
    def set(self, key: str, value: Any) -> None:
        self._cache[key] = {
            'value': value,
            'timestamp': datetime.now()
        }
        
    def clear(self) -> None:
        self._cache.clear()

# Global cache instance
cache = SimpleCache()
