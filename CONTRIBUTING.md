# Contributing to AstralCore

Thank you for your interest in contributing to AstralCore! We welcome contributions from everyone.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots if possible**
- **Provide your environment details** (OS, browser, Node.js version)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Follow the coding standards** (see below)
4. **Add tests** for new functionality
5. **Ensure all tests pass** (`npm test`)
6. **Update documentation** if needed
7. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
8. **Push to the branch** (`git push origin feature/AmazingFeature`)
9. **Open a Pull Request**

## Development Setup

1. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/astralcore-crypto-platform.git
   cd astralcore-crypto-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Provide proper type definitions
- Avoid `any` types when possible

### Code Style

- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful variable names
- Write self-documenting code

### Component Guidelines

- Use functional components with hooks
- Implement proper error boundaries
- Follow the existing component structure
- Use shadcn/ui components when possible

### Testing

- Write unit tests for new features
- Aim for 70%+ code coverage
- Use React Testing Library for component tests
- Mock external dependencies

### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add social login functionality
fix(dashboard): resolve trading bot display issue
docs(readme): update deployment instructions
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   └── auth/           # Authentication components
├── lib/                # Utility functions
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── data/               # Static data files
└── providers/          # Context providers
```

## Environment Variables

Required for development:

```env
# Builder.io
BUILDER_PUBLIC_KEY=your_key
NEXT_PUBLIC_BUILDER_API_KEY=your_key

# Google AI
GOOGLE_GENAI_API_KEY=your_key

# Security
NEXTAUTH_SECRET=your_secret
ENCRYPTION_KEY=your_key
API_SECRET_KEY=your_key
```

## Testing Guidelines

### Unit Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Component Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('should render correctly', () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### API Testing

```typescript
import { GET } from './route';

describe('/api/endpoint', () => {
  it('should return success response', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });
});
```

## Documentation

- Update README.md if needed
- Add JSDoc comments for complex functions
- Update API documentation
- Include examples in documentation

## Security

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Follow security best practices
- Report security vulnerabilities privately

## Performance

- Optimize bundle size
- Use lazy loading for heavy components
- Implement proper caching strategies
- Monitor Web Vitals metrics

## Accessibility

- Follow WCAG 2.1 guidelines
- Test with screen readers
- Ensure keyboard navigation works
- Use semantic HTML elements

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- No Internet Explorer support

## Release Process

1. **Feature freeze** on `develop` branch
2. **Create release branch** from `develop`
3. **Update version** in package.json
4. **Update CHANGELOG.md**
5. **Merge to main** branch
6. **Tag release** with version
7. **Deploy to production**

## Getting Help

- **Documentation**: Check the README and docs
- **Issues**: Search existing GitHub issues
- **Discord**: Join our community Discord
- **Email**: Contact support@astralcore.app

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Annual contributor report

Thank you for contributing to AstralCore! 🚀
