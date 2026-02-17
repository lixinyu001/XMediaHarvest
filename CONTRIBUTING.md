# Contributing to XMediaHarvest

Thank you for your interest in contributing to XMediaHarvest! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful and considerate in all interactions. We are committed to providing a welcoming and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots or videos if applicable
- Device information (Android version, device model)
- App version

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- A clear and concise description of the enhancement
- Explain why this enhancement would be useful
- Provide examples of how the enhancement would work

### Pull Requests

We welcome pull requests! Before submitting a PR, please:

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes following our coding standards
4. Test your changes thoroughly
5. Update documentation if needed
6. Submit a pull request with a clear description of your changes

## Development Setup

### Prerequisites

- Android Studio Hedgehog (2023.1.1) or later
- JDK 17
- Android SDK 34
- Minimum SDK 26 (Android 8.0)

### Building the Project

1. Clone the repository:
```bash
git clone https://github.com/yourusername/XMediaHarvest.git
cd XMediaHarvest
```

2. Open the project in Android Studio

3. Sync Gradle files

4. Build the project:
```bash
./gradlew build
```

5. Run tests:
```bash
./gradlew test
```

6. Run the app:
```bash
./gradlew installDebug
```

## Coding Standards

### Kotlin

- Follow Kotlin coding conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions short and focused
- Use data classes for immutable data

### Compose

- Follow Compose best practices
- Use state hoisting appropriately
- Keep composables small and reusable
- Use Material Design 3 components

### Architecture

- Follow MVVM pattern
- Use dependency injection (Hilt)
- Separate concerns (Data, Domain, UI)
- Use coroutines for asynchronous operations

### Testing

- Write unit tests for business logic
- Write UI tests for critical user flows
- Aim for high test coverage
- Test on multiple Android versions

## Commit Messages

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: add download progress notification
```

## GitHub Actions

The project uses GitHub Actions for continuous integration. PRs will automatically:

- Build the project
- Run unit tests
- Run lint checks
- Upload build artifacts

Make sure your PR passes all checks before requesting review.

## Code Review Process

1. All PRs require review before merging
2. Address all review comments
3. Keep PRs focused and small
4. Update PR description as needed

## Release Process

Releases are managed by maintainers. The process includes:

1. Update version numbers
2. Update CHANGELOG.md
3. Create a release tag
4. Build and publish release

## Questions?

If you have any questions about contributing, feel free to:

- Open an issue
- Contact maintainers
- Join our community discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
