import time
from collections import defaultdict
from fastapi import HTTPException, Request


_attempts = defaultdict(list)


def check_rate_limit(
    key: str,
    max_attempts: int,
    window_seconds: int,
):
    now = time.time()
    window_start = now - window_seconds

    # Remove expired attempts
    _attempts[key] = [
        timestamp
        for timestamp in _attempts[key]
        if timestamp > window_start
    ]

    if len(_attempts[key]) >= max_attempts:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again later.",
        )

    _attempts[key].append(now)


def client_ip_from(request: Request) -> str:
    """Real client IP. On Vercel the first X-Forwarded-For entry is the client."""

    forwarded = request.headers.get("x-forwarded-for")

    if forwarded:
        return forwarded.split(",")[0].strip()

    real_ip = request.headers.get("x-real-ip")

    if real_ip:
        return real_ip.strip()

    return request.client.host if request.client else "unknown"
