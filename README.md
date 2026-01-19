# Secret Santa Game

A full-stack web application for generating random Secret Santa assignments with constraints to avoid self-assignments and repetitive assignments from previous years.

## Features

- 🎁 **Random Assignment**: Generates random Secret Santa assignments for employees
- 🚫 **Smart Constraints**: Prevents self-assignments and repetitive assignments from previous years
- 📤 **File Upload**: Upload employee list as CSV
- 📥 **CSV Export**: Download assignments as CSV file
- 🎨 **Modern UI**: Beautiful React interface with real-time feedback
- ✅ **Comprehensive Tests**: Full test coverage with Jest
- 📚 **Well Documented**: Clear documentation and code comments

## Project Structure

```
santa-game/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── models/         # Data models (Employee, SecretSantaAssignment)
│   │   ├── services/       # Business logic (SecretSantaAssigner, CsvService)
│   │   ├── routes/         # API endpoints
│   │   └── index.ts        # Express app entry point
│   ├── tests/              # Jest test suites
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
├── frontend/               # React/Vite application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   ├── types/          # TypeScript interfaces
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── README.md
└── .gitignore
```

## Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Testing**: Jest
- **CSV Parsing**: csv-parser
- **File Upload**: Multer
- **CORS**: cors

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: CSS3

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Installation

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm preview
```

## API Documentation

### Generate Assignments

**Endpoint**: `POST /api/assignments/generate`

**Request**: Multipart form data
- `employees` (required): CSV file with columns `Employee_Name`, `Employee_EmailID`
- `previousAssignments` (optional): CSV file with previous year's assignments

**Response**:
```json
{
  "success": true,
  "message": "Secret Santa assignments generated successfully",
  "assignmentCount": 5,
  "assignments": [
    {
      "employeeName": "John Doe",
      "employeeEmailId": "john@acme.com",
      "secretChildName": "Jane Smith",
      "secretChildEmailId": "jane@acme.com"
    }
  ],
  "downloadUrl": "/api/assignments/download/secret-santa-assignments-1234567890.csv"
}
```

### Download Assignments

**Endpoint**: `GET /api/assignments/download/:filename`

Returns the CSV file for download.

### Health Check

**Endpoint**: `GET /api/health`

Returns API status.

## CSV File Format

### Employees CSV
```csv
Employee_Name,Employee_EmailID
John Doe,john.doe@acme.com
Jane Smith,jane.smith@acme.com
Bob Johnson,bob.johnson@acme.com
Diana Wilson,diana.wilson@acme.com
```

### Previous Assignments CSV (Optional)
```csv
Employee_Name,Employee_EmailID,Secret_Child_Name,Secret_Child_EmailID
John Doe,john.doe@acme.com,Bob Johnson,bob.johnson@acme.com
Jane Smith,jane.smith@acme.com,Diana Wilson,diana.wilson@acme.com
```

## Running Tests

```bash
cd backend
npm test                # Run tests once
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

## Algorithm Details

The Secret Santa assignment algorithm uses a modified Fisher-Yates shuffle with constraint checking:

1. **Load employees** and previous year's assignments
2. **Create constraint map** of previous assignments
3. **Shuffle employees** randomly
4. **Assign secret children** while checking constraints:
   - No self-assignments
   - No repetition from previous year
   - Each employee assigned exactly once as giver
   - Each employee assigned exactly once as receiver
5. **Retry with exponential backoff** if valid assignment cannot be found (up to 100 attempts)

### Complexity
- Time: O(n²) worst case, O(n) average case
- Space: O(n) for storing assignments

## Error Handling

The application includes comprehensive error handling for:
- Invalid CSV file format
- Missing required columns
- Duplicate email addresses
- Invalid email addresses
- Impossible assignment constraints
- File I/O errors

All errors are logged and returned to the client with descriptive messages.

## Code Quality

### Modularity
- Separated concerns with models, services, and routes
- Reusable components with clear responsibilities
- Type-safe interfaces using TypeScript

### Testing
- Unit tests for all core business logic
- Test coverage for Employee, SecretSantaAssignment, and SecretSantaAssigner
- Tests verify constraints and edge cases

### Documentation
- Inline JSDoc comments for all public methods
- README with setup and usage instructions
- API documentation with examples
- Type definitions for better IDE support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write or update tests
5. Submit a pull request

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
