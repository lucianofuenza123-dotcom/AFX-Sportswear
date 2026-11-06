
import os
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

SECRET_KEY = os.getenv("SECRET_KEY", "CAMBIAR-POR-UNA-CLAVE-SECRETA-LARGA")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(plain_password, hashed_password)


def create_access_token(user_id: int) -> str:
    expires = datetime.now(timezone.utc) + timedelta(
        days=ACCESS_TOKEN_EXPIRE_DAYS
    )

    payload = {
        "sub": str(user_id),
        "exp": expires
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
