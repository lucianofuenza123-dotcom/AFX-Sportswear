from getpass import getpass
from database import SessionLocal
from models import User
from security import hash_password

db = SessionLocal()

try:
    email = input("Correo del administrador: ").strip().lower()
    user = db.query(User).filter(User.email == email).first()

    if not user:
        print("No existe ese usuario.")
    elif user.role != "admin":
        print("El usuario no es administrador.")
    else:
        password = getpass("Nueva contraseña: ")
        confirm = getpass("Repetir contraseña: ")

        if len(password) < 8:
            print("Mínimo 8 caracteres.")
        elif password != confirm:
            print("Las contraseñas no coinciden.")
        else:
            user.hashed_password = hash_password(password)
            db.commit()
            print("Contraseña actualizada correctamente.")
finally:
    db.close()

input("Presioná Enter para cerrar...")
