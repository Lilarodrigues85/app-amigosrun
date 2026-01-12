# DATAMETRIA Standards - Technology Stack

## Programming Languages

### Primary Languages

- **Python 3.13+**: Core automation and validation scripts
- **PowerShell**: Windows-specific automation and setup
- **Batch**: Legacy Windows script support
- **Markdown**: Documentation and template format
- **YAML**: Configuration and CI/CD definitions
- **JSON**: Configuration files and data structures

### Language Usage Distribution

- **Python**: 70% - Main scripting and automation
- **Markdown**: 25% - Documentation and templates
- **PowerShell/Batch**: 3% - Windows automation
- **YAML/JSON**: 2% - Configuration

## Core Dependencies

### Python Dependencies

```python
# Core libraries used across tools
import os           # File system operations
import sys          # System-specific parameters
import re           # Regular expressions for text processing
import pathlib      # Modern path handling
import subprocess   # External command execution
import argparse     # Command-line argument parsing
```

### Development Tools

- **MyPy**: Static type checking for Python code
- **Pre-commit**: Git hook framework for quality assurance
- **Markdownlint**: Markdown file validation and formatting
- **GitHub Actions**: CI/CD automation platform

## Build System

### Project Structure

- **No traditional build system**: Documentation-focused project
- **Script-based automation**: PowerShell and Python scripts
- **Git-based versioning**: Semantic versioning with tags
- **Automated synchronization**: Between Amazon Q rules and docs

### Automation Scripts

#### PowerShell Scripts (tools/)

- `setup.ps1` - Initial project configuration
- `run.ps1` - Main automation runner with multiple commands

#### Python Scripts (tools/)

- `validate_markdown.py` - Comprehensive markdown validation
- `fix_md001.py` - Automatic heading hierarchy fixes
- `fix_md051.py` - Line ending standardization
- `fix_text_blocks.py` - Text block formatting
- `sync_amazonq.py` - Amazon Q synchronization

## Development Commands

### Setup and Configuration

```bash
# Initial setup
.\tools\setup.ps1

# Install pre-commit hooks
pre-commit install
```

### Quality Assurance

```bash
# Markdown validation
.\tools\run.ps1 validate-md

# Fix common markdown issues
.\tools\run.ps1 fix-md

# Run all quality checks
.\tools\run.ps1 precommit-all
```

### Synchronization

```bash
# Sync Amazon Q rules with docs
python tools/cli/sync_amazonq.py

# Batch sync (Windows)
tools/cli/sync_amazonq.bat
```

### Validation Commands

```bash
# Check markdown linting
.\tools\run.ps1 lint-md

# Check priority rules
.\tools\run.ps1 check-priority

# Full validation with reporting
.\tools\run.ps1 validate-md
```

## Configuration Files

### Markdown Linting (.markdownlint.json)

```json
{
  "MD001": true,  # Heading levels increment by one
  "MD047": true,  # Files should end with newline
  "MD051": true   # Link fragments should be valid
}
```

### Pre-commit Configuration (.pre-commit-config.yaml)

```yaml
repos:
  - repo: https://github.com/igorshubovych/markdownlint-cli
    hooks:
      - id: markdownlint
        args: ['--fix']
```

### Spell Checking (cspell.json)

```json
{
  "version": "0.2",
  "language": "en",
  "words": ["datametria", "amazonq", "markdownlint"]
}
```

## CI/CD Pipeline

### GitHub Actions (.github/workflows/datametria-quality.yml)

**Triggers**: Push to main, pull requests
**Jobs**:

1. **Markdown Validation**: Lint all markdown files
2. **Link Checking**: Validate internal and external links
3. **Spell Checking**: Verify spelling across documentation
4. **Template Validation**: Ensure template integrity

### Quality Gates

- **Markdown Linting**: Must pass all configured rules
- **Link Validation**: All links must be accessible
- **Spell Check**: No spelling errors in documentation
- **Template Structure**: Templates must follow standards

## Development Environment

### Required Tools

- **Git**: Version control and collaboration
- **Python 3.13+**: Script execution and automation
- **PowerShell 5.1+**: Windows automation support
- **VS Code**: Recommended editor with extensions
- **Amazon Q Developer**: AI-powered development assistance

### Recommended Extensions (VS Code)

- **markdownlint**: Real-time markdown validation
- **Spell Right**: Spell checking for documentation
- **Python**: Python language support
- **PowerShell**: PowerShell script support
- **Amazon Q**: AI development assistance

## File Processing Patterns

### Markdown Processing

- **Validation**: 22 active markdown rules (MD001-MD051)
- **Auto-fixing**: Automatic correction of common issues
- **Batch processing**: Handle multiple files simultaneously
- **Error reporting**: Detailed validation reports

### Text Processing

- **Encoding**: UTF-8 standard across all files
- **Line endings**: Consistent LF line endings
- **Whitespace**: Trailing whitespace removal
- **Text blocks**: Standardized formatting

## Integration Points

### Amazon Q Developer

- **Rules Directory**: `.amazonq/rules/` automatically loaded
- **Context Awareness**: AI understands project structure
- **Template Access**: Direct access to all templates
- **Pattern Recognition**: Learns from established patterns

### External Tools

- **GitHub**: Repository hosting and collaboration
- **Markdownlint**: Document quality assurance
- **Pre-commit**: Quality gate enforcement
- **MyPy**: Type checking for Python scripts

## Performance Considerations

### Script Optimization

- **Batch processing**: Process multiple files together
- **Caching**: Avoid redundant file operations
- **Parallel execution**: Where applicable for validation
- **Memory efficiency**: Stream processing for large files

### Scalability

- **Modular design**: Scripts can be extended independently
- **Configuration-driven**: Behavior controlled by config files
- **Cross-platform**: Python ensures portability
- **Version compatibility**: Backward compatibility maintained
