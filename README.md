# Nasa_NLP

## Project Description

NASA has decades of valuable space biology data scattered across various publications and databases. To prepare for future Moon and Mars missions, this knowledge needs to be accessible and searchable. 

This project aims to build an AI-powered dynamic dashboard that:
- Utilizes knowledge graphs and NLP techniques to organize NASA bioscience publications
- Enables users to explore the impacts and results of space experiments
- Makes decades of space biology research easily accessible and queryable
- Supports preparation for long-duration space missions

## Features

- AI-powered document analysis and summarization
- Knowledge graph visualization of space biology research
- Interactive dashboard for exploring NASA publications
- Search and filter capabilities across decades of research
- Insights into space experiment results and their implications

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Virtual environment (recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Epochdevv/Nasa_NLP.git
   cd Nasa_NLP
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up configuration:
   ```bash
   cp config.example.yml config.yml
   # Edit config.yml with your settings
   ```

## Usage

### Running the Application

```bash
python main.py
```

The dashboard will be available at `http://localhost:5000`

### Processing NASA Documents

```bash
python scripts/process_documents.py --input data/nasa_publications/
```

### Building the Knowledge Graph

```bash
python scripts/build_knowledge_graph.py
```

## Project Structure

```
Nasa_NLP/
├── data/              # NASA publications and datasets
├── models/            # Trained NLP models
├── scripts/           # Processing and analysis scripts
├── dashboard/         # Web dashboard application
├── knowledge_graph/   # Knowledge graph implementation
├── tests/             # Unit and integration tests
└── docs/              # Additional documentation
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact Information

- **Project Maintainer**: Epochdevv
- **Repository**: [https://github.com/Epochdevv/Nasa_NLP](https://github.com/Epochdevv/Nasa_NLP)
- **Issues**: [https://github.com/Epochdevv/Nasa_NLP/issues](https://github.com/Epochdevv/Nasa_NLP/issues)

## Acknowledgments

- NASA for providing public access to space biology research
- The open-source NLP and knowledge graph communities

## Roadmap

- [ ] Complete data collection pipeline for NASA publications
- [ ] Implement core NLP processing capabilities
- [ ] Build knowledge graph structure
- [ ] Develop interactive dashboard interface
- [ ] Add advanced search and filtering features
- [ ] Deploy public beta version
