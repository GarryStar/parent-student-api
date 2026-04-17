from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db, SessionLocal
from app import models, auth, schemas

app = FastAPI()

Base.metadata.create_all(bind=engine)


def create_admin_if_not_exists():
    db = SessionLocal()
    try:
        admin = db.query(models.User).filter(models.User.username == "admin").first()
        if not admin:
            new_admin = models.User(
                username="admin",
                password_hash=auth.hash_password("admin123"),
                role="admin"
            )
            db.add(new_admin)
            db.commit()
    finally:
        db.close()


create_admin_if_not_exists()


@app.get("/")
def root():
    return {"message": "API běží 🚀"}


@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()

    if user is None:
        raise HTTPException(status_code=401, detail="Neplatné přihlašovací údaje")

    if not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Neplatné přihlašovací údaje")

    access_token = auth.create_access_token(
        data={
            "sub": user.username,
            "role": user.role,
            "user_id": user.id
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@app.get("/me")
def read_me(current_user: dict = Depends(auth.get_current_user)):
    return current_user

@app.post("/users", response_model=schemas.UserRead)
def create_user(
    user_data: schemas.UserCreate,
    current_user=Depends(auth.require_admin),
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.User).filter(models.User.username == user_data.username).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Username už existuje")

    if user_data.role not in ["admin", "parent"]:
        raise HTTPException(status_code=400, detail="Role musí být admin nebo parent")

    new_user = models.User(
        username=user_data.username,
        password_hash=auth.hash_password(user_data.password),
        role=user_data.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user