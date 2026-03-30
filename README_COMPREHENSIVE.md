# 🎁 Secret Santa Game

A full-stack web application for generating random Secret Santa assignments for company employees, built with **React**, **Node.js**, and **TypeScript**.

## 📋 Overview

The Secret Santa Game automates the process of assigning secret children to employees for company gift exchanges. The system respects constraints such as:
- **Self-assignment prevention**: No employee can be assigned to themselves
- **Previous year avoidance**: Employees cannot be assigned the same secret child as the previous year
- **Fair distribution**: Each employee is assigned exactly one secret child, and each employee receives exactly one assignment

## ✨ Features

- **CSV File Upload**: Upload employee lists with names and email IDs
- **Previous Year Tracking**: Upload previous assignments to avoid repetitive pairings
- **Smart Assignment Algorithm**: Uses constraint satisfaction and derangement principles for optimal assignments
- **CSV Export**: Download generated assignments as a CSV file
- **Comprehensive Error Handling**: Detailed error messages for invalid inputs
- **Responsive UI**: Clean, user-friendly interface built with React
- **Full TypeScript Support**: Type-safe codebase across frontend and backend
- **Comprehensive Testing**: Unit tests for all services with high coverage

## 🏗️ Project Structure

```
secret-santa-game/
├── backend/
│   ├── src/
│   │   ├── models/              # Data models
│   │   │   ├── Employee.ts
│   │   │   └── SecretSantaAssignment.ts
│   │   ├── services/            # Business logic services
│   │   │   ├── SecretSantaAssigner.ts   # Assignment algorithm
│   │   │   ├── CsvService.ts            # CSV parsing/writing
│   │   │   └── ValidatorService.ts      # Data validation
│   │   ├── routes/              # API endpoints
│   │   │   └── assignments.ts
│   │   ├── utils/               # Utility functions
│   │   └── index.ts             # Express app setup
│   ├── tests/                   # Test suite
│   │   ├── Employee.test.ts
│   │   ├── SecretSantaAssigner.test.ts
│   │   └── SecretSantaAssignment.test.ts
│   ├── jest.config.js
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/          # React components (React.FC)
│   │   │   ├── FileUpload.tsx
│   │   │   ├── AssignmentsList.tsx
│   │   │   ├── ErrorAlert.tsx
│   │   │   └── SuccessAlert.tsx
│   │   ├── services/            # API client
│   │   │   └── api.ts
│   │   ├── utils/               # Utility functions
│   │   │   └── validators.ts
│   │   ├── types/               # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── CSS files
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── package.json                 # Root package.json with scripts
└── README.md
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe language
- **Multer** - File upload middleware
- **CSV Parser** - CSV file parsing
- **Jest** - Testing framework
- **ts-jest** - TypeScript testing support

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe language
- **Vite** - Build tool
- **Axios** - HTTP client

## 📦 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd secret-santa-game
```

### Step 2: Install Dependencies
```bash
# Install all dependencies
npm run install:all

# Or install manually
npm install
cd backend && npm install
cd ../frontend && npm install
```

## 🚀 Running the Application

### Development Mode

#### Terminal 1: Start Backend
```bash
npm run backend:dev
```
The backend will run on `http://localhost:5000`

#### Terminal 2: Start Frontend
```bash
npm run frontend:dev
```
The frontend will run on `http://localhost:5173` (default Vite port)

### Building for Production

#### Build Backend
```bash
npm run backend:build
npm run backend:start
```

#### Build Frontend
```bash
npm run frontend:build
npm run frontend:preview
```

## 📊 Usage Guide

### 1. Prepare Input Files

Create a CSV file with employee information (e.g., `employees.csv`):
```csv
Employee_Name,Employee_EmailID
John Doe,john.doe@acme.com
Jane Smith,jane.smith@acme.com
Bob Johnson,bob.johnson@acme.com
Alice Williams,alice.williams@acme.com
```

(Optional) Create a CSV file with previous year's assignments (e.g., `previous-assignments.csv`):
```csv
Employee_Name,Employee_EmailID,Secret_Child_Name,Secret_Child_EmailID
John Doe,john.doe@acme.com,Bob Johnson,bob.johnson@acme.com
Jane Smith,jane.smith@acme.com,Alice Williams,alice.williams@acme.com
Bob Johnson,bob.johnson@acme.com,John Doe,john.doe@acme.com
Alice Williams,alice.williams@acme.com,Jane Smith,jane.smith@acme.com
```

### 2. Upload and Generate

1. Open the application in your browser (`http://localhost:5173`)
2. Click "Choose File" to upload the employees CSV
3. (Optional) Upload previous year's assignments to avoid repetition
4. Click "Generate Assignments"
5. The system will generate new assignments and display them
6. Click "Download CSV" to download the results

### 3. Output Format

Generated assignments CSV file (`secret-santa-assignments-{timestamp}.csv`):
```csv
Employee_Name,Employee_EmailID,Secret_Child_Name,Secret_Child_EmailID
John Doe,john.doe@acme.com,Alice Williams,alice.williams@acme.com
Jane Smith,jane.smith@acme.com,Bob Johnson,bob.johnson@acme.com
Bob Johnson,bob.johnson@acme.com,Jane Smith,jane.smith@acme.com
Alice Williams,alice.williams@acme.com,John Doe,john.doe@acme.com
```

## 🧪 Testing

### Run Backend Tests
```bash
npm run backend:test
```

### Run Tests in Watch Mode
```bash
npm run backend:test:watch
```

### Generate Coverage Report
```bash
npm run backend:test:coverage
```

## 📚 API Endpoints

### POST `/api/assignments/generate`
Generate secret santa assignments

**Request:**
- Multipart form data with:
  - `employees`: CSV file with employee data
  - `previousAssignments`: (Optional) CSV file with previous assignments

**Response:**
```json
{
  "success": true,
  "message": "Secret Santa assignments generated successfully",
  "assignmentCount": 4,
  "assignments": [
    {
      "id": "assign_...",
      "employeeName": "John Doe",
      "employeeEmailId": "john.doe@acme.com",
      "secretChildName": "Alice Williams",
      "secretChildEmailId": "alice.williams@acme.com",
      "year": 2026
    }
  ],
  "downloadUrl": "/api/assignments/download/secret-santa-assignments-1768808027316.csv"
}
```

### GET `/api/assignments/download/:filename`
Download generated CSV file

**Parameters:**
- `filename`: The filename of the assignments to download

**Response:**
- CSV file download

### GET `/api/assignments/health`
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "message": "Secret Santa API is running"
}
```

### GET `/`
Root endpoint with API information

**Response:**
```json
{
  "message": "Secret Santa Game API",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /api/health",
    "generate": "POST /api/assignments/generate",
    "download": "GET /api/assignments/download/:filename"
  }
}
```

## 🔐 Validation Rules

### Employee Data
- Name: Required, 2-100 characters
- Email: Required, valid email format (xxx@xxx.xxx)
- Duplicate emails: Not allowed

### Assignment Constraints
- Minimum 2 employees required
- No self-assignments
- No repeated assignments from previous year
- Each employee assigned exactly once
- Each employee receives exactly one assignment

## 🎯 Algorithm Details

### Secret Santa Assignment Algorithm

The system uses a **constraint satisfaction** approach with the following strategies:

1. **Backtracking Algorithm**: Attempts to find a valid assignment through systematic exploration
2. **Constraint Propagation**: Maintains available receivers for each giver based on constraints
3. **Random Derangement**: Falls back to Fisher-Yates shuffle with random attempts if backtracking fails
4. **Derangement Principle**: Ensures valid permutation where no element appears in its original position

This ensures:
- Valid derangement (no employee gets themselves)
- Respect for previous year constraints
- Fair distribution across all attempts
- Maximum retry attempts: 1000

### Time and Space Complexity
- **Time Complexity**: O(n²) worst case, O(n) average case
- **Space Complexity**: O(n) for storing assignments and constraint maps

## 🛡️ Error Handling

The application handles various error scenarios:

- **Invalid CSV Format**: Missing required columns or invalid data
- **Duplicate Emails**: Multiple employees with same email
- **Insufficient Employees**: Less than 2 employees provided
- **Unsatisfiable Constraints**: Assignment constraints that cannot be satisfied
- **File Upload Issues**: Invalid file types or oversized files (max 5MB)
- **Network Errors**: Connection issues with the API
- **File I/O Errors**: Issues reading or writing files

All errors are returned with descriptive messages for easy debugging.

## 📝 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
```

**Frontend**
- Default API base: `/api`
- Configurable in `frontend/src/services/api.ts`

## 🚦 Development Workflow

### Code Quality
- **TypeScript Strict Mode**: Enabled for type safety
- **ESLint**: Configured for code consistency
- **Jest**: Comprehensive test suite with high coverage
- **Error Handling**: Try-catch with detailed error messages

### Best Practices Applied
- **OOP Principles**: Modular, extensible service classes
- **Separation of Concerns**: Models, services, routes, components
- **React Functional Components**: All components are React.FC with proper typing
- **Type Safety**: Strict TypeScript configuration across the project
- **Comprehensive Tests**: Unit tests for all business logic
- **Documentation**: JSDoc comments for all public methods

## 📄 CSV File Requirements

### Employee CSV Format
Headers (case-insensitive):
- `Employee_Name`: Full name of employee
- `Employee_EmailID`: Email address

### Previous Assignments CSV Format
Headers (case-insensitive):
- `Employee_Name`: Name of giver
- `Employee_EmailID`: Email of giver
- `Secret_Child_Name`: Name of previous secret child
- `Secret_Child_EmailID`: Email of previous secret child

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify Node.js installation: `node --version`
- Install dependencies: `cd backend && npm install`

### Frontend won't start
- Check if port 5173 is available
- Clear node_modules: `rm -rf node_modules` and reinstall
- Check Vite configuration

### File upload fails
- Ensure file is a valid CSV
- Check file size (max 5MB)
- Verify column headers in CSV match expected format

### Assignment generation fails
- Ensure at least 2 employees in the list
- Check for duplicate email addresses
- Verify email format validity
- Review browser console and server logs for detailed errors

## 📞 Support

For issues or questions:
1. Check the error message displayed in the UI
2. Review the browser console for client-side errors
3. Check the terminal output for server-side errors
4. Verify all input files follow the required CSV format
5. Consult the API documentation above

## 📜 License

MIT License

## 👥 Authors

Developed as part of the Secret Santa Game automation project for Acme Corporation.
