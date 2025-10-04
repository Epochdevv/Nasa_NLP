# Contributing to Nasa_NLP

Thank you for your interest in contributing to the Nasa_NLP project! We welcome contributions from the community to help make NASA's space biology research more accessible.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Types of Contributions

We welcome various types of contributions:

1. **Code contributions**: Bug fixes, new features, performance improvements
2. **Documentation**: Improving README, adding tutorials, fixing typos
3. **Testing**: Writing tests, reporting bugs, testing new features
4. **Data**: Curating NASA publication datasets, improving data quality
5. **Design**: UI/UX improvements for the dashboard
6. **Ideas**: Suggesting new features or enhancements

## Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Nasa_NLP.git
   cd Nasa_NLP
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt  # Development dependencies
   ```

5. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Coding Standards

### Python Code Style

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guidelines
- Use meaningful variable and function names
- Add docstrings to all functions, classes, and modules
- Keep functions focused and small
- Maximum line length: 100 characters

### Code Formatting

We use automated tools to maintain code quality:

```bash
# Format code with black
black .

# Sort imports with isort
isort .

# Lint code with flake8
flake8 .

# Type checking with mypy
mypy .
```

### Testing

- Write unit tests for all new functionality
- Ensure all tests pass before submitting:
  ```bash
  pytest
  ```
- Aim for at least 80% code coverage
- Include integration tests for complex features

## Submitting Changes

### Pull Request Process

1. **Update your fork** with the latest changes from main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests** to ensure everything works:
   ```bash
   pytest
   black --check .
   flake8 .
   ```

3. **Commit your changes** with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: brief description"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub:
   - Provide a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - List any breaking changes

### Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Update documentation for any changed functionality
- Add or update tests as needed
- Ensure CI/CD checks pass
- Respond to review comments promptly
- Be open to feedback and suggestions

## Reporting Bugs

Before creating a bug report, please:

1. Check the [issue tracker](https://github.com/Epochdevv/Nasa_NLP/issues) for existing reports
2. Update to the latest version to see if the issue persists
3. Collect relevant information about the bug

### Bug Report Template

When reporting a bug, include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to recreate the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Python version, relevant package versions
- **Screenshots**: If applicable
- **Additional Context**: Any other relevant information

## Suggesting Enhancements

We welcome suggestions for new features or improvements! When suggesting an enhancement:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** your enhancement would solve
3. **Propose a solution** with as much detail as possible
4. **Consider alternatives** and explain why your approach is best
5. **Discuss impact** on existing functionality

### Enhancement Proposal Template

- **Summary**: Brief overview of the enhancement
- **Motivation**: Why is this enhancement needed?
- **Detailed Description**: Full explanation of the proposed feature
- **Implementation Ideas**: Technical approach (if applicable)
- **Alternatives Considered**: Other approaches you've thought about
- **Additional Context**: Screenshots, mockups, examples

## Getting Help

If you need help with contributing:

- Open a [discussion](https://github.com/Epochdevv/Nasa_NLP/discussions)
- Join our community channels (if available)
- Reach out to maintainers
- Check existing documentation and issues

## Recognition

All contributors will be recognized in our project documentation. We appreciate every contribution, no matter how small!

## License

By contributing to Nasa_NLP, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to making NASA's space biology research more accessible! 🚀
