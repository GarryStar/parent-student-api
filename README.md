🎓 Student Management API (FastAPI)

Jednoduchý backend projekt ve FastAPI pro správu uživatelů (admin/parent) a studentů.

Projekt vznikl jako learning projekt – cílem je pochopit backend, práci s databází, autentizaci a API.

🚀 Co to umí
🔐 Přihlášení pomocí JWT
👤 Role:
admin – správa uživatelů a studentů
parent – vidí pouze své studenty
👥 Správa uživatelů
🎓 Správa studentů
🔗 Propojení parent ↔ student
🛠️ Technologie
Python
FastAPI
SQLAlchemy
JWT autentizace
🔐 Autentizace

Používá se Bearer token:

Authorization: Bearer <token>
📦 Hlavní endpointy
🔹 Auth
POST /login – přihlášení
🔹 Users (admin only)
POST /users – vytvoření uživatele
GET /parents – seznam rodičů
🔹 Students (admin only)
POST /students – vytvoření studenta
GET /students – seznam studentů
🔹 Vazby
POST /parent-student-links – propojení parent ↔ student
🔹 Parent view
GET /my-students – studenti přihlášeného parenta
🧠 Jak fungují role
Admin:
má plný přístup
Parent:
vidí pouze svoje studenty
🤝 Hledám frontend parťáka

Frontend mě moc nebaví 😄
Pokud tě baví React/Vue a chceš si zkusit napojení na backend:

API je hotové
stačí postavit UI (login, dashboard, seznam studentů)

Klidně napiš ✌️

⚠️ Poznámka

Projekt je primárně learning – kód není perfektní, ale cílem je se zlepšovat.
