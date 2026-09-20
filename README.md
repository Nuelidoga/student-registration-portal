# Student Registration Portal

A full-stack, serverless web app that registers students through a plain HTML/JS frontend, backed by an Azure Function and Azure SQL Database — no traditional backend server required.

**[📖 Read the full build write-up](https://medium.com/@idoganuel25/building-a-full-stack-cloud-app-on-azure-from-html-form-to-azure-sql-database-serverless-no-5e2cfc241391)** — a step-by-step walkthrough covering every decision, including the real debugging sessions.

---

## How It Works

```
HTML FORM
    ↓
JavaScript fetch()
    ↓
POST /api/students
    ↓
Azure Function
    ↓
INSERT INTO Students
    ↓
Azure SQL Database
```

```
Load Students Button
    ↓
GET /api/students
    ↓
Azure Function
    ↓
SELECT FROM Students
    ↓
Azure SQL Database
    ↓
JSON Response → HTML Table
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, vanilla JavaScript (Fetch API) |
| Backend | Azure Functions (Node.js v4 programming model) |
| Database | Azure SQL Database (serverless tier) |
| SQL Driver | [`mssql`](https://www.npmjs.com/package/mssql) (Node.js) |
| Local Dev Tools | VS Code, Azure Functions Core Tools, Live Server, SSMS |

---

## Project Structure

```
student-portal/
│
├── index.html          # Registration form + results table
├── style.css
├── script.js            # fetch() calls to the API
│
└── student-api/
    ├── src/
    │   └── functions/
    │       └── students.js   # HTTP-triggered function (GET + POST)
    ├── src/db.js             # SQL connection pool
    ├── host.json
    ├── package.json
    └── local.settings.json   # Local env vars — NOT committed (see below)
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local)
- [VS Code](https://code.visualstudio.com/) with the **Azure Functions** and **Live Server** extensions
- An [Azure account](https://azure.microsoft.com/free/) with an Azure SQL Database provisioned
- [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) (optional, for inspecting the database directly)

---

## Database Setup

Run this against your Azure SQL Database (via SSMS or the Azure Portal query editor) before running the app:

```sql
CREATE TABLE Students (
    StudentID INT IDENTITY(1,1) PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    Course VARCHAR(100) NOT NULL,
    RegistrationDate DATETIME2 DEFAULT GETDATE()
);
```

Make sure your Azure SQL Server's networking allows your client IP and has **"Allow Azure services and resources to access this server"** enabled.

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/Nuelidoga/student-registration-portal.git
cd student-registration-portal
```

### 2. Install API dependencies

```bash
cd student-api
npm install
```

### 3. Configure local environment variables

Create `student-api/local.settings.json` (this file is git-ignored — you'll need to create it yourself):

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "DB_USER": "your-sql-admin-username",
    "DB_PASSWORD": "your-sql-admin-password",
    "DB_SERVER": "your-server-name.database.windows.net",
    "DB_DATABASE": "StudentPortalDB"
  },
  "Host": {
    "CORS": "http://127.0.0.1:5500,http://localhost:5500"
  }
}
```

> ⚠️ **Never commit this file with real credentials.** It's already listed in `.gitignore`.

### 4. Run the API locally

```bash
func start
```

You should see:

```
Functions:
        students: [GET,POST] http://localhost:7071/api/students
```

### 5. Run the frontend

Open the project root folder in VS Code and start it with the **Live Server** extension (right-click `index.html` → "Open with Live Server"). It will run at `http://127.0.0.1:5500`.

> Do **not** open `index.html` by double-clicking it — the app makes `fetch()` calls that require a real HTTP origin, not the `file://` protocol.

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/students` | Returns all registered students as JSON |
| `POST` | `/api/students` | Registers a new student — expects `{ fullName, email, course }` in the request body |

---

## Troubleshooting

Ran into a connection failure while building this? The full write-up includes a real debugging session covering:
- A DNS resolution error caused by a typo'd server hostname
- A connection timeout traced to Azure SQL's serverless auto-pause / cold-start behavior

**[→ See the full diagnosis](https://medium.com/@idoganuel25/building-a-full-stack-cloud-app-on-azure-from-html-form-to-azure-sql-database-serverless-no-5e2cfc241391)**

---

## License

MIT
