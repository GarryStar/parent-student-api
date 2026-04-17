from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str
    role: str


class UserRead(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True


class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    city: str


class StudentRead(BaseModel):
    id: int
    first_name: str
    last_name: str
    city: str

    class Config:
        from_attributes = True


class ParentStudentLinkCreate(BaseModel):
    parent_user_id: int
    student_id: int