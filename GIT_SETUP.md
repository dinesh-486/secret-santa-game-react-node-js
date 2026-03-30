# Secret Santa Game - Git Setup Instructions

This project should be version controlled with Git. Here are the instructions to set up the repository:

## Prerequisites
- Git must be installed on your system
- Visit https://git-scm.com/downloads to install Git if needed

## Setup Instructions

### 1. Initialize Repository (if not already initialized)
```bash
cd secret-santa-game
git init
```

### 2. Configure Git User (if not already configured globally)
```bash
git config user.name "Your Name"
git config user.email "your.email@acme.com"
```

### 3. Add All Files
```bash
git add .
```

### 4. Create Initial Commit
```bash
git commit -m "Initial commit: Secret Santa Game full-stack application with React and Node.js"
```

### 5. Add Remote Repository (for GitHub, GitLab, or Bitbucket)
```bash
# For GitHub
git remote add origin https://github.com/yourusername/secret-santa-game.git

# Or for GitLab
git remote add origin https://gitlab.com/yourusername/secret-santa-game.git

# Or for Bitbucket
git remote add origin https://bitbucket.org/yourusername/secret-santa-game.git
```

### 6. Push to Remote Repository
```bash
git branch -M main
git push -u origin main
```

## Repository Structure in Git

The repository is organized as follows:

- **backend/**: Node.js/Express TypeScript API
  - `src/`: Source code with models, services, routes
  - `tests/`: Jest test suite
  - `uploads/`: Generated assignment CSV files
  - Configuration files: `tsconfig.json`, `jest.config.js`, `package.json`

- **frontend/**: React/Vite TypeScript SPA
  - `src/`: React components, services, utilities, types
  - Configuration files: `tsconfig.json`, `vite.config.ts`, `package.json`

- **Root level**:
  - `package.json`: Workspace scripts
  - `.gitignore`: Git ignore rules
  - `README.md`: Project documentation

## Commit Message Conventions

Use the following format for commit messages:

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tool changes

**Example:**
```
feat: Add constraint satisfaction algorithm for assignments

Implement backtracking algorithm with constraint propagation
to handle Secret Santa assignments more efficiently.

Closes #123
```

## Branches

Recommended branch naming conventions:

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features (e.g., `feature/add-email-notifications`)
- `fix/*`: Bug fixes (e.g., `fix/csv-parsing-error`)
- `docs/*`: Documentation updates (e.g., `docs/update-readme`)

## Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Write tests for new features
4. Update documentation as needed
5. Create a pull request with clear description
6. Request review from team members
7. Merge after approval

## Files Tracked in .gitignore

The `.gitignore` file excludes the following from version control:

- `node_modules/`: NPM package dependencies
- `dist/`: Built/compiled code
- `coverage/`: Test coverage reports
- `.env`: Environment variables
- `.env.local`: Local environment overrides
- `*.log`: Log files
- `.vscode/`: VS Code workspace settings
- `.idea/`: IDE settings
- `uploads/`: Generated assignment files (uploaded by users)
- `.DS_Store`: macOS system files
- `*.swp`, `*.swo`: Vim swap files (add to .gitignore if needed)

## Recommended GitHub Repository Settings

### Branch Protection Rules (for `main` branch):
- Require pull request reviews before merging
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Include administrators in restrictions

### Secrets (if using GitHub Actions):
- `ACME_API_KEY`: API keys for backend services
- `DEPLOY_KEY`: SSH key for deployment

## Continuous Integration/Deployment

You can set up GitHub Actions, GitLab CI/CD, or Bitbucket Pipelines to:

1. Run tests on every commit
2. Build the application
3. Check code quality
4. Deploy to staging/production

Example GitHub Actions workflow (`.github/workflows/test.yml`):

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm run install:all
      - run: npm run backend:test
      - run: npm run frontend:build
```

## Making Your First Commit

```bash
# Stage all changes
git add .

# Create commit
git commit -m "Initial commit: Secret Santa Game application"

# Set remote origin
git remote add origin <your-repository-url>

# Push to repository
git push -u origin main
```

## Useful Git Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# Create new branch
git checkout -b feature/your-feature

# Switch branch
git checkout main

# Merge branch
git merge feature/your-feature

# Delete branch
git branch -d feature/your-feature

# Stash changes
git stash

# See what changed
git diff
```

For more information on Git, visit: https://git-scm.com/doc
