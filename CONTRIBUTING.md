# Contributing to Mission Fitness 🏋️♂️

We love your input! We want to make contributing to Mission Fitness as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. **Fork the repo** and create your branch from `main`.
2. **Install dependencies**: `npm install`
3. **Set up environment**: Copy `.env.example` to `.env` and fill in your values
4. **Make your changes** following our coding standards
5. **Test your changes** thoroughly
6. **Update documentation** if needed
7. **Ensure the test suite passes**: `npm test`
8. **Make sure your code lints**: `npm run lint`
9. **Format your code**: `npm run format`
10. **Issue that pull request**!

## Branch Naming Convention

- `feature/description` - for new features
- `bugfix/description` - for bug fixes
- `hotfix/description` - for critical fixes
- `docs/description` - for documentation updates
- `refactor/description` - for code refactoring

## Coding Standards

### JavaScript/Node.js
- Use ES6+ features
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Keep functions small and focused
- Use async/await over promises when possible

### File Structure
```
src/
├── controllers/     # Route handlers
├── services/        # Business logic
├── middleware/      # Express middleware
├── models/          # Database schemas
├── utils/           # Utility functions
├── config/          # Configuration files
└── routes/          # Route definitions
```

### Code Style
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Maximum line length: 100 characters
- Use camelCase for variables and functions
- Use PascalCase for classes and constructors

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples
```
feat(auth): add password reset functionality
fix(api): resolve user registration validation error
docs(readme): update installation instructions
```

## Testing Guidelines

### Unit Tests
- Write tests for all new functions
- Maintain at least 80% code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Integration Tests
- Test API endpoints
- Test database operations
- Test authentication flows

### Test Structure
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should do something specific', async () => {
    // Arrange
    const input = 'test data';
    
    // Act
    const result = await functionUnderTest(input);
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

## API Documentation

### Endpoint Documentation
Document all API endpoints with:
- HTTP method and URL
- Request parameters
- Request body schema
- Response schema
- Error responses
- Example requests/responses

### Example
```javascript
/**
 * @route POST /api/auth/login
 * @desc Authenticate user and return JWT token
 * @access Public
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} User data and JWT token
 * @throws {400} Invalid credentials
 * @throws {500} Server error
 */
```

## Security Guidelines

### Authentication & Authorization
- Always validate user input
- Use JWT tokens for authentication
- Implement proper role-based access control
- Hash passwords with bcrypt

### Data Protection
- Sanitize all inputs
- Use parameterized queries
- Implement rate limiting
- Validate file uploads

### Environment Variables
- Never commit sensitive data
- Use `.env` files for configuration
- Validate environment variables on startup

## Database Guidelines

### Schema Design
- Use meaningful collection/table names
- Add proper indexes
- Include timestamps (createdAt, updatedAt)
- Use appropriate data types

### Migrations
- Create migration scripts for schema changes
- Test migrations on development data
- Include rollback procedures

## Performance Guidelines

### Code Optimization
- Use efficient algorithms
- Implement caching where appropriate
- Optimize database queries
- Use compression for responses

### Monitoring
- Add logging for important operations
- Monitor API response times
- Track error rates
- Monitor resource usage

## Documentation Standards

### Code Comments
- Comment complex business logic
- Explain "why" not "what"
- Keep comments up to date
- Use JSDoc for function documentation

### README Updates
- Keep installation instructions current
- Update feature lists
- Include troubleshooting guides
- Add usage examples

## Issue Reporting

### Bug Reports
Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

### Feature Requests
Include:
- Clear description of the feature
- Use case and benefits
- Proposed implementation approach
- Any breaking changes

## Code Review Process

### For Reviewers
- Check code quality and standards
- Verify tests are included
- Ensure documentation is updated
- Test the changes locally
- Provide constructive feedback

### For Contributors
- Respond to feedback promptly
- Make requested changes
- Update tests if needed
- Ensure CI passes

## Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Release Checklist
- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Create release notes
- [ ] Tag the release
- [ ] Deploy to staging
- [ ] Run full test suite
- [ ] Deploy to production

## Getting Help

### Community
- Join our [Discord server](https://discord.gg/mission-fitness)
- Follow us on [Twitter](https://twitter.com/mission_fitness)
- Check existing [GitHub Issues](https://github.com/Its-Onkar/mission-fitness/issues)

### Documentation
- [API Documentation](./docs/api.md)
- [Setup Guide](./SETUP_GUIDE.md)
- [Troubleshooting](./docs/troubleshooting.md)

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Mission Fitness! 💪