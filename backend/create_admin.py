from getpass import getpass

from database import SessionLocal
from models import User
from security import hash_password


def main():
    name = input("Nombre del administrador: ").strip()
    email = input("Correo del administrador: ").strip().lower()
    password = getpass("Contraseña (mínimo 8 caracteres): ")
    confirmation = getpass("Repetí la contraseña: ")

    if not name or not email:
        print("El nombre y el correo son obligatorios.")
        return

    if len(password) < 8:
        print("La contraseña debe tener al menos 8 caracteres.")
        return

    if password != confirmation:
        print("Las contraseñas no coinciden.")
        return

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()

        if existing:
            print("Ese correo ya está registrado. No se realizaron cambios.")
            return

        admin = User(
            name=name,
            email=email,
            hashed_password=hash_password(password),
            role="admin"
        )

        db.add(admin)
        db.commit()
        print("¡Cuenta de administrador creada correctamente!")

    finally:
        db.close()


if __name__ == "__main__":
    main()
