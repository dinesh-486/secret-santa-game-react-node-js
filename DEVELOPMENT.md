# Development Guide - Secret Santa Game

This guide provides detailed information for developers working on the Secret Santa Game project.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Development Environment Setup](#development-environment-setup)
3. [Backend Development](#backend-development)
4. [Frontend Development](#frontend-development)
5. [Testing](#testing)
6. [Code Quality](#code-quality)
7. [Debugging](#debugging)
8. [Deployment](#deployment)

## Project Overview

### Tech Stack Summary
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React 18 + Vite + TypeScript
- **Testing**: Jest
- **Build Tools**: TypeScript Compiler, Vite
- **Package Manager**: npm

### Key Features
- Secret Santa assignment algorithm with constraint satisfaction
- CSV file upload and download
- Previous year assignment tracking
- Responsive React UI with functional components
- Comprehensive error handling

## Development Environment Setup

### Prerequisites
- Node.js v16+ (LTS recommended: v18+)
- npm v7+
- A code editor (VS Code recommended)
- Git

### Initial Setup
```bash
# 1. Clone repository
git clone <repository-url>
cd secret-santa-game

# 2. Install all dependencies
npm run install:all

# 3. Verify installation
npm run backend:test
npm run frontend:build
```

### Environment Configuration

#### Backend (.env file - optional)
Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug
```

#### Frontend Environment
Update API base URL in `frontend/src/services/api.ts` if needed:
```typescript
const API_BASE = process.env.REACT_APP_API || '/api';
```

## Backend Development

### Project Structure
```
backend/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── models/
│   │   ├── Employee.ts       # Employee class with validation
│   │   └── SecretSantaAssignment.ts  # Assignment model
│   ├── services/
│   │   ├── SecretSantaAssigner.ts   # Core algorithm
│   │   ├── CsvService.ts            # CSV I/O
│   │   └── ValidatorService.ts      # Data validation
│   ├── routes/
│   │   └── assignments.ts    # API endpoints
│   └── utils/                # Helper functions
└── tests/                    # Jest test files
```

### Running the Backend

#### Development Mode
```bash
cd backend
npm run dev
```
- Runs on http://localhost:5000
- Uses ts-node for direct TypeScript execution
- Auto-reloads on file changes (if configured)

#### Production Mode
```bash
cd backend
npm run build
npm start
```

### Making API Changes

#### Adding a New Endpoint
1. Create handler function in `src/routes/assignments.ts`
2. Add route definition
3. Add proper TypeScript types
4. Document with JSDoc
5. Add tests in `tests/`

Example:
```typescript
router.get('/example', (req: Request, res: Response, next: NextFunction) => {
  try {
    // Your code here
    res.json({ data: 'example' });
  } catch (error) {
    next(error);
  }
});
```

#### Adding a New Service
1. Create class in `src/services/`
2. Add public methods with clear responsibilities
3. Include JSDoc comments
4. Add unit tests

Example:
```typescript
export class YourService {
  /**
   * Description of what this does
   * @param param - description
   * @returns description
   * @throws Error if something fails
   */
  public yourMethod(param: string): string {
    // Implementation
    return result;
  }
}
```

### Database Models

Models are in `src/models/`:

**Employee.ts**
- Validates name and email
- Generates unique IDs
- Implements error handling

**SecretSantaAssignment.ts**
- Stores giver and receiver info
- Includes year tracking
- Validates all fields required

### Error Handling

The backend uses a consistent error handling pattern:
```typescript
try {
  // Your code
} catch (error) {
  next(error);  // Passes to error middleware
}
```

Errors are caught by the global error middleware in `index.ts`:
```typescript
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});
```

### Database/Persistence

Currently using file-based persistence:
- CSV files uploaded to `backend/uploads/`
- In-memory processing of assignments
- No permanent database (add as needed)

## Frontend Development

### Project Structure
```
frontend/
├── src/
│   ├── App.tsx               # Main component
│   ├── main.tsx              # Entry point
│   ├── components/
│   │   ├── FileUpload.tsx    # CSV upload component
│   │   ├── AssignmentsList.tsx
│   │   ├── ErrorAlert.tsx
│   │   └── SuccessAlert.tsx
│   ├── services/
│   │   └── api.ts            # API client
│   ├── utils/
│   │   └── validators.ts     # Input validation
│   └── types/
│       └── index.ts          # TypeScript interfaces
└── public/                   # Static assets
```

### Running the Frontend

#### Development Mode
```bash
cd frontend
npm run dev
```
- Runs on http://localhost:5173 (or next available port)
- Hot module replacement enabled
- Open browser to http://localhost:5173

#### Production Build
```bash
cd frontend
npm run build
npm run preview
```

### React Component Guidelines

All components should be **React.FC** (Functional Components):

```typescript
interface Props {
  onSuccess: (data: Assignment[]) => void;
  isLoading?: boolean;
}

export const MyComponent: React.FC<Props> = ({ onSuccess, isLoading = false }) => {
  const [state, setState] = useState<string>('');

  const handleClick = () => {
    // Handle event
  };

  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### Component Best Practices
- Use TypeScript for all props
- Extract props into named interfaces
- Use React hooks (useState, useEffect, useCallback)
- Keep components focused and small
- Separate concerns: presentation vs. logic

### State Management
Currently using React hooks for state:
- `useState` for local state
- `useCallback` for memoized functions
- `useEffect` for side effects

For larger state, consider Redux or Zustand.

### API Integration

API client is in `src/services/api.ts`:
```typescript
class SecretSantaService {
  async generateAssignments(
    employeesFile: File,
    previousAssignmentsFile?: File
  ): Promise<GenerateResponse> {
    // Implementation
  }
}
```

Use it in components:
```typescript
const response = await secretSantaService.generateAssignments(file1, file2);
```

### Styling

CSS is organized by component:
- `FileUpload.css` for FileUpload component
- `AssignmentsList.css` for AssignmentsList component
- `App.css` for main application styles
- `index.css` for global styles

Use CSS custom properties for theming:
```css
:root {
  --primary-color: #4CAF50;
  --error-color: #f44336;
  --spacing-unit: 8px;
}
```

## Testing

### Backend Tests

Located in `backend/tests/`:

#### Running Tests
```bash
cd backend
npm test                # Run once
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

#### Test Files
- `Employee.test.ts` - Employee model validation
- `SecretSantaAssignment.test.ts` - Assignment model
- `SecretSantaAssigner.test.ts` - Assignment algorithm

#### Writing Tests
```typescript
describe('YourFeature', () => {
  describe('method name', () => {
    it('should do something', () => {
      // Arrange
      const input = new Employee('John', 'john@acme.com');

      // Act
      const result = yourService.process(input);

      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

#### Test Coverage Goals
- Aim for >80% coverage
- Test happy path and error cases
- Test edge cases and boundaries
- Test integration between services

### Frontend Tests (Optional)

Consider adding tests using:
- **Vitest**: Fast unit testing
- **React Testing Library**: Component testing
- **Cypress/Playwright**: E2E testing

## Code Quality

### TypeScript Strict Mode

Both backend and frontend use strict TypeScript:
```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true
  }
}
```

This means:
- All types must be explicitly declared
- No `any` types allowed
- All variables must be used
- Null/undefined must be handled explicitly

### Linting

Consider adding ESLint:
```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### Code Formatting

Use Prettier for consistent formatting:
```bash
npm install --save-dev prettier
```

Configure in `.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Documentation

Provide JSDoc for all public APIs:

```typescript
/**
 * Assigns secret children to employees
 * @param employees - List of employees
 * @param previousAssignments - Previous year's assignments to avoid
 * @returns Array of assignments
 * @throws Error if assignment is impossible
 */
public assignSecretChildren(
  employees: Employee[],
  previousAssignments: ISecretSantaAssignment[] = []
): SecretSantaAssignment[] {
  // Implementation
}
```

## Debugging

### Backend Debugging

#### Using VS Code Debugger
1. Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Backend",
      "program": "${workspaceFolder}/backend/src/index.ts",
      "preLaunchTask": "build",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"]
    }
  ]
}
```

2. Set breakpoints in VS Code
3. Press F5 to start debugging

#### Console Logging
```typescript
console.log('Debug info:', variable);
console.error('Error occurred:', error);
console.warn('Warning:', message);
```

### Frontend Debugging

#### Browser DevTools
- Open DevTools (F12)
- Use React DevTools extension
- Check Console for errors
- Use Sources tab for breakpoints

#### VS Code Debugger for Frontend
```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Frontend",
  "url": "http://localhost:5173",
  "webRoot": "${workspaceFolder}/frontend/src"
}
```

#### Network Inspection
- Open DevTools Network tab
- Check API requests/responses
- Verify headers and status codes

## Deployment

### Backend Deployment

#### Preparing for Production
```bash
cd backend
npm run build
```

This creates optimized code in `backend/dist/`

#### Environment Variables for Production
```env
PORT=5000
NODE_ENV=production
```

#### Hosting Options
- **Heroku**: `git push heroku main`
- **AWS/Azure**: Deploy Docker container or use platform-specific tools
- **Digital Ocean**: Node.js app on droplet
- **Vercel/Netlify**: For serverless (requires serverless-http adapter)

#### Docker Setup (Optional)
Create `backend/Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

### Frontend Deployment

#### Build for Production
```bash
cd frontend
npm run build
```

This creates optimized build in `frontend/dist/`

#### Deployment Options
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: Configure for SPA
- **AWS S3 + CloudFront**: Static hosting
- **Your own server**: Serve `dist/` folder with nginx/Apache

#### Environment Variables
```bash
# .env.production
VITE_API_URL=https://api.acme.com/api
```

#### CORS Configuration
Update backend for production domain:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### Full Stack Deployment Example (Heroku)

1. Install Heroku CLI
2. Create `Procfile`:
```
web: cd backend && npm start
```

3. Create `Procfile.dev` for development:
```
web: npm run backend:dev
client: npm run frontend:dev
```

4. Deploy:
```bash
heroku create your-app-name
git push heroku main
```

## Performance Optimization

### Backend
- Cache results when possible
- Use streaming for large files
- Implement pagination for lists
- Add request/response compression

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Bundle analysis: `npm run build -- --analyze`
- Service workers for offline support

## Security Considerations

1. **Input Validation**: Always validate file uploads and user input
2. **CORS**: Configure properly for your domain
3. **HTTPS**: Use in production
4. **File Upload**: Limit size and check MIME types
5. **Environment Variables**: Never commit secrets

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test thoroughly
3. Run tests: `npm run backend:test`
4. Commit: `git commit -m "feature: description"`
5. Push: `git push origin feature/your-feature`
6. Create Pull Request

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Find process using port
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # Linux/Mac
taskkill /PID <PID> /F  # Windows
```

**Dependencies not installed**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
cd backend && npm run build
cd frontend && npm run build
```

**File permissions**
```bash
chmod -R 755 uploads/  # Linux/Mac
```

## Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing](https://jestjs.io/)
- [Vite Guide](https://vitejs.dev/guide/)

## Support

For development questions or issues:
1. Check the README.md
2. Review existing tests for examples
3. Check GitHub issues
4. Create detailed issue with steps to reproduce

Happy coding! 🚀
