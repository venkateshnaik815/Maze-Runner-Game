# Contributing to Maze Runner

First off, thank you for considering contributing to the Maze Runner Game Platform!

## 1. Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please be respectful and constructive in issues and code reviews.

## 2. How to Contribute

### Reporting Bugs
- Ensure the bug was not already reported by searching on GitHub under Issues.
- If you're unable to find an open issue addressing the problem, open a new one.
- Use the provided `Bug Report` template and include clear instructions to reproduce the issue, along with logs and screenshots.

### Suggesting Enhancements
- Open a new issue using the `Feature Request` template.
- Clearly describe the feature, the problem it solves, and potential architectural impacts.

### Pull Requests
1. **Fork** the repository and clone it locally.
2. **Branch** off `main` for your feature (`feature/add-new-maze-algorithm`).
3. **Write tests** for your changes. We enforce a 90% coverage gate on the backend, and 85% on the frontend.
4. **Run linters locally**:
   - Backend: `./mvnw checkstyle:check`
   - Frontend: `npm run lint` && `npm run type-check`
5. **Commit** using Conventional Commits (e.g., `feat(maze): implement Prim's algorithm`).
6. **Push** and open a PR. Ensure the CI pipeline passes green.

## 3. Code Review Process
- At least one code owner must review and approve your PR.
- Address review comments promptly.
- Once approved, a maintainer will merge your PR using "Squash and Merge".
