# DATAMETRIA Standards - Development Guidelines

## Code Quality Standards

### Python Code Structure

Based on analysis of 5 representative files, the codebase follows these patterns:

#### File Headers and Documentation

- **Shebang Line**: All Python scripts start with `#!/usr/bin/env python3`
- **Module Docstrings**: Triple-quoted docstrings in Portuguese explaining script purpose
- **Encoding**: UTF-8 encoding specified in file operations
- **Type Hints**: Extensive use of typing annotations (`Dict`, `List`, `Set`, `tuple`)

#### Function Documentation Pattern

```python
def function_name(param: type) -> return_type:
    """Brief description in Portuguese.

    Detailed explanation if needed.
    """
```

#### Error Handling Standards

- **Try-Catch Blocks**: Comprehensive exception handling in all file operations
- **Error Messages**: Descriptive error messages in Portuguese
- **Graceful Degradation**: Scripts continue processing other files when one fails
- **Return Values**: Boolean returns for success/failure indication

### Code Formatting Conventions

#### Import Organization

```python
# Standard library imports first
import os
import sys
import re
import glob
from pathlib import Path
from typing import Dict, List, Set

# Third-party imports (if any)
import subprocess

# Local imports last
```

#### Variable Naming

- **Snake Case**: All variables use snake_case (`file_path`, `success_count`)
- **Descriptive Names**: Clear, meaningful variable names
- **Constants**: Uppercase for constants and patterns
- **Portuguese Comments**: Code comments in Portuguese

#### String Processing Patterns

- **Raw Strings**: Use of raw strings for regex patterns (`r'^#### Framework'`)
- **F-Strings**: Modern string formatting (`f"Corrigido: {file_path}"`)
- **Multiline Regex**: `re.MULTILINE` flag for line-based processing
- **Unicode Handling**: Proper Unicode normalization for text processing

## Architectural Patterns

### Script Structure Pattern

All automation scripts follow this consistent structure:

1. **Module Docstring**: Purpose and functionality description
2. **Imports**: Organized by standard/third-party/local
3. **Helper Functions**: Specific utility functions
4. **Main Processing Function**: Core logic implementation
5. **Main Entry Point**: `if __name__ == "__main__":` pattern

### File Processing Architecture

```python
def process_file(filepath: str) -> bool:
    """Standard file processing pattern."""
    try:
        # Read file
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Process content
        modified_content = apply_transformations(content)

        # Write if changed
        if modified_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(modified_content)
            return True
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False
```

### Batch Processing Pattern

- **Glob Patterns**: Use of `glob.glob()` for file discovery
- **Recursive Processing**: `recursive=True` for subdirectory traversal
- **Deduplication**: `list(set())` to remove duplicate file paths
- **Progress Reporting**: Real-time feedback during processing

## Text Processing Standards

### Markdown Processing

- **Regex Patterns**: Comprehensive regex for markdown elements
- **Heading Detection**: `r'^(#{1,6})\\s+(.+)$'` pattern for headers
- **Link Processing**: `r'\\[([^\\]]+)\\]\\(#([^)]+)\\)'` for internal links
- **Badge Removal**: Cleaning text by removing badges and links

### Text Normalization

- **Unicode Normalization**: `unicodedata.normalize('NFD', text)`
- **Accent Removal**: Character category filtering
- **Anchor Generation**: GitHub-compatible anchor creation
- **Case Conversion**: Consistent lowercase for anchors

### Content Validation

- **Pattern Matching**: Multiple regex patterns for different scenarios
- **Similarity Scoring**: Word-based similarity algorithms
- **Best Match Finding**: Fuzzy matching for link correction
- **Threshold-Based Matching**: 0.3 threshold for similarity acceptance

## Development Practices

### Error Handling Philosophy

- **Fail Gracefully**: Continue processing when individual files fail
- **Detailed Logging**: Comprehensive error messages with context
- **User Feedback**: Clear success/failure reporting
- **Recovery Mechanisms**: Automatic correction where possible

### Performance Optimization

- **Batch Operations**: Process multiple files in single operations
- **Memory Efficiency**: Stream processing for large files
- **Offset Tracking**: Efficient string replacement with position tracking
- **Caching**: Store computed values to avoid recomputation

### Code Reusability

- **Modular Functions**: Single-responsibility functions
- **Generic Patterns**: Reusable processing templates
- **Configuration-Driven**: Behavior controlled by data structures
- **Cross-Platform**: Path handling using `pathlib.Path`

## Quality Assurance Patterns

### Validation Strategies

- **Pre-Processing Validation**: Check file existence and accessibility
- **Content Validation**: Verify content structure before processing
- **Post-Processing Verification**: Confirm changes were applied correctly
- **Rollback Capability**: Maintain original content for comparison

### Testing Approaches

- **Dry Run Support**: Ability to preview changes without applying
- **Incremental Processing**: Process files one at a time for debugging
- **Verbose Output**: Detailed logging for troubleshooting
- **Success Metrics**: Count and report processing statistics

### Documentation Standards

- **Function Documentation**: Every function has descriptive docstring
- **Parameter Documentation**: Type hints for all parameters
- **Return Value Documentation**: Clear return type specifications
- **Usage Examples**: Practical examples in docstrings

## Integration Patterns

### External Tool Integration

- **Subprocess Usage**: `subprocess.run()` for external commands
- **Shell Integration**: PowerShell and batch script compatibility
- **CI/CD Integration**: GitHub Actions compatible output
- **Cross-Platform Support**: Windows and Unix compatibility

### File System Operations

- **Path Handling**: Consistent use of `pathlib.Path`
- **Encoding Standards**: UTF-8 encoding for all text files
- **Backup Strategies**: Content comparison before overwriting
- **Directory Traversal**: Recursive and pattern-based file discovery

### Configuration Management

- **JSON Configuration**: `.markdownlint.json` for tool configuration
- **YAML Configuration**: `.pre-commit-config.yaml` for automation
- **Environment Variables**: OS-specific path handling
- **Default Values**: Sensible defaults with override capability

## Maintenance Guidelines

### Code Evolution

- **Backward Compatibility**: Maintain compatibility across versions
- **Incremental Improvements**: Small, focused changes
- **Pattern Consistency**: Follow established patterns in new code
- **Documentation Updates**: Keep documentation synchronized with code

### Monitoring and Metrics

- **Success Rate Tracking**: Monitor processing success rates
- **Performance Metrics**: Track processing time and efficiency
- **Error Pattern Analysis**: Identify common failure modes
- **Usage Statistics**: Monitor tool adoption and usage patterns

### Refactoring Principles

- **Single Responsibility**: Each function has one clear purpose
- **DRY Principle**: Avoid code duplication through abstraction
- **SOLID Principles**: Follow object-oriented design principles
- **Clean Code**: Readable, maintainable, and well-structured code
