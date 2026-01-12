# DATAMETRIA Standards - Project Structure

## Directory Organization

### Root Structure

```
DATAMETRIA-standards/
├── .amazonq/rules/          # Amazon Q Developer integration
├── .github/workflows/       # CI/CD automation
├── docs/                    # Public documentation mirror
├── tools/                   # Development and automation scripts
└── [configuration files]    # Project configuration and metadata
```

### Core Components

#### 1. Amazon Q Integration (.amazonq/rules/)

**Purpose**: Primary location for AI-accessible guidelines and templates
**Contents**:

- 16 development standard guidelines (datametria_std_*.md)
- 50+ professional templates (template-*.md)
- Master context file (datametria_context_master.md)
- Memory bank documentation (memory-bank/)

**Key Files**:

- `datametria_context_master.md` - Central reference index
- `datametria_std_web_dev.md` - Web development guidelines
- `datametria_std_python_automation.md` - Python automation standards
- `template-readme.md` - README template
- `template-api-documentation.md` - API documentation template

#### 2. Documentation Mirror (docs/)

**Purpose**: Public-facing documentation that mirrors .amazonq/rules/
**Architecture**: Exact duplicate of Amazon Q rules for external access
**Synchronization**: Maintained through automated sync scripts

#### 3. Development Tools (tools/)

**Purpose**: Automation scripts and development utilities
**Structure**:

```
tools/
├── cli/                     # Command-line utilities
│   ├── sync_amazonq.py     # Amazon Q synchronization
│   └── sync_amazonq.bat    # Batch sync script
├── fix_md001.py            # Markdown heading fixes
├── fix_md051.py            # Markdown line ending fixes
├── fix_text_blocks.py      # Text block formatting
├── validate_markdown.py    # Markdown validation
├── run.ps1                 # PowerShell automation
└── setup.ps1               # Environment setup
```

#### 4. CI/CD Integration (.github/workflows/)

**Purpose**: Automated quality assurance and validation
**Components**:

- `datametria-quality.yml` - Quality checks and markdown validation
- Automated testing for template integrity
- Pre-commit hook validation

## Architectural Patterns

### 1. Dual Documentation Strategy

- **Amazon Q Rules**: AI-accessible, automatically loaded context
- **Public Docs**: Human-readable, web-accessible documentation
- **Synchronization**: Automated mirroring between both locations

### 2. Template-Driven Development

- **Standardized Templates**: 50+ professional templates for all scenarios
- **Cross-Reference Matrix**: 400+ connections between templates and guidelines
- **AI Optimization**: Templates structured for Amazon Q consumption

### 3. Guideline Categorization

- **Technology Stack Guidelines**: Web, Mobile, Cloud, AI/ML
- **Process Guidelines**: Documentation, Security, Logging
- **Architecture Guidelines**: Microservices, Data Engineering, Flow Design

### 4. Version Control Strategy

- **Semantic Versioning**: Major.Minor.Patch format
- **Release Notes**: Detailed changelog for each version
- **Backward Compatibility**: Maintained across minor versions

## Component Relationships

### Guidelines → Templates Flow

1. **Development Guidelines** define standards and practices
2. **Templates** implement guidelines in reusable formats
3. **Cross-Reference Matrix** connects related components
4. **Amazon Q** provides AI-driven implementation

### Quality Assurance Chain

1. **Markdown Validation** ensures document quality
2. **Pre-commit Hooks** prevent quality issues
3. **CI/CD Pipeline** validates all changes
4. **Automated Fixes** resolve common formatting issues

### AI Integration Architecture

1. **Context Loading**: Amazon Q automatically loads rules
2. **Template Access**: AI can reference and generate from templates
3. **Cross-References**: AI understands component relationships
4. **Pattern Recognition**: AI learns from established patterns

## File Naming Conventions

### Guidelines

- Format: `datametria_std_[domain].md`
- Examples: `datametria_std_web_dev.md`, `datametria_std_security.md`

### Templates

- Format: `template-[purpose].md`
- Examples: `template-readme.md`, `template-api-documentation.md`

### Tools

- Format: `[action]_[target].py`
- Examples: `fix_md001.py`, `validate_markdown.py`

## Scalability Design

### Horizontal Scaling

- New guidelines added as separate files
- Templates organized by category
- Tools modularized for specific functions

### Vertical Scaling

- Guidelines can be extended with new sections
- Templates support additional customization
- Cross-references automatically updated

### Integration Points

- Amazon Q rules directory for AI access
- GitHub Actions for automation
- PowerShell scripts for Windows environments
- Python tools for cross-platform compatibility
