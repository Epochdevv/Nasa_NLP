# Nasa_NLP - AI-Powered NASA Bioscience Publication Dashboard

## Project Overview

NASA has decades of valuable space biology data scattered across various publications and databases. To prepare for future Moon and Mars missions, this knowledge needs to be accessible and searchable. This project aims to build an AI-powered dynamic dashboard that:

- Utilizes knowledge graphs and NLP techniques to organize NASA bioscience publications
- Enables users to explore the impacts and results of space experiments
- Makes decades of space biology research easily accessible and queryable
- Supports preparation for long-duration space missions

## Recent Updates (October 2025)

### Major Features Added

#### 1. **LLM Integration (Google Gemini API)**
- Automated processing of XML documents using Google's Gemini 2.5 Flash model
- Intelligent extraction of entities and relationships from scientific publications
- System prompt-based configuration for structured data extraction
- Batch processing capabilities for multiple documents

#### 2. **Neo4j Knowledge Graph Database**
- Integration with Neo4j for storing and querying knowledge graph data
- Automated data ingestion from processed documents
- Support for complex entity relationships (Publications, Objectives, Challenges, Methodologies, etc.)
- Scalable graph database architecture

#### 3. **Frontend Application**
- Interactive web interface for exploring NASA publications
- Visual knowledge graph representation
- Search and filter capabilities

#### 4. **Data Processing Pipeline**
- XML document processing with GROBID output support
- JSON data validation and repair utilities
- Automated entity extraction and relationship mapping

## Project Structure

```
Nasa_NLP/
├── NASA_NLP_Frontend-main/   # Frontend application
├── datas/
│   └── grobid_output/         # Processed XML documents
├── embedding/                  # Document embeddings and clustering
├── filtering_files/            # Data filtering utilities
├── summarizating_files/        # Document summarization tools
├── txt/                        # Processed text outputs from LLM
├── xmls/                       # Source XML documents
├── database_test.py            # Neo4j database integration script
├── llm.py                      # LLM processing module
├── r.py                        # JSON repair utility
├── requirements.txt            # Python dependencies
├── system_prompt.txt           # LLM system prompt configuration
└── d.json                      # Sample knowledge graph data
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js (for frontend)
- Neo4j database (local or cloud instance)
- Google Gemini API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Epochdevv/Nasa_NLP.git
   cd Nasa_NLP
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up Neo4j:**
   - Create a Neo4j instance (local or cloud)
   - Update connection credentials in `database_test.py`

4. **Configure API keys:**
   - Add your Google Gemini API key in `llm.py`
   - Configure Neo4j credentials in `database_test.py`

5. **Install frontend dependencies:**
   ```bash
   cd NASA_NLP_Frontend-main
   npm install
   ```

## Usage

### Processing Documents with LLM

The `llm.py` script processes XML documents and extracts structured data:

```bash
python llm.py
```

This will:
- Read XML files from the `xmls/` directory
- Process them using Google Gemini API
- Extract entities and relationships based on `system_prompt.txt`
- Save results as JSON in the `txt/` directory

### Populating the Knowledge Graph

Once documents are processed, populate the Neo4j database:

```bash
python database_test.py
```

This will:
- Read processed JSON files from `txt/` directory
- Create nodes and relationships in Neo4j
- Validate data integrity

### Running the Frontend

```bash
cd NASA_NLP_Frontend-main
npm start
```

The dashboard will be available at `http://localhost:3000` (or configured port).

## Key Technologies

- **Python**: Core data processing and LLM integration
- **Google Gemini API**: AI-powered document analysis
- **Neo4j**: Graph database for knowledge representation
- **TypeScript/React**: Frontend application
- **GROBID**: Scientific document parsing

## Data Model

The knowledge graph includes the following entity types:

- **Publication**: Scientific papers and documents
- **Objective**: Research goals and aims
- **Challenge**: Research challenges and problems
- **Methodology**: Research methods and approaches
- **Experiment**: Specific experiments conducted
- **BiologicalEntity**: Organisms and biological subjects
- **Measurement**: Data measurements and observations
- **Phenomenon**: Observed scientific phenomena
- **Result**: Research findings and outcomes
- **Technology**: Technologies and tools used
- **FundingSource**: Research funding sources
- **ResearchGroup**: Research teams and institutions

## Configuration Files

### system_prompt.txt

Defines the extraction schema and rules for the LLM. Customize this file to adjust:
- Entity types to extract
- Relationship types
- JSON output format
- Extraction rules and constraints

### requirements.txt

Core dependencies:
- `google-genai`: Google Gemini API client
- `neo4j`: Neo4j database driver
- `pydantic`: Data validation
- And more (see file for complete list)

## Utilities

### r.py - JSON Repair Tool

Automatically repairs malformed JSON files from LLM output:
```bash
python r.py
```

### database_test.py - Neo4j Integration

Provides the `Neo4jPusher` class for database operations:
- Node creation and merging
- Relationship establishment
- Batch data ingestion

## Contributing

We welcome contributions! Areas for improvement:
- Enhanced entity extraction accuracy
- Additional data source integrations
- UI/UX improvements
- Performance optimizations
- Documentation enhancements

## Project Contributors

- **Epochdevv**: Project lead and main developer
- **AdityasArsenal** (Aditya Patil): LLM and database integration
- **borkluce** (Enis Simsir): Additional development

## Acknowledgments

- NASA for providing public access to space biology research
- The open-source NLP and knowledge graph communities
- Google for the Gemini API
- Neo4j for graph database technology

## Roadmap

- [x] LLM integration for document processing
- [x] Neo4j knowledge graph implementation
- [x] Frontend application development
- [ ] Enhanced search and filtering capabilities
- [ ] Advanced visualization features
- [ ] API development for external integrations
- [ ] Automated data pipeline improvements
- [ ] Deploy public beta version
- [ ] Multi-language support

## License

This project is open source. License information will be added soon.

## Contact

- Repository: [https://github.com/Epochdevv/Nasa_NLP](https://github.com/Epochdevv/Nasa_NLP)
- Issues: [https://github.com/Epochdevv/Nasa_NLP/issues](https://github.com/Epochdevv/Nasa_NLP/issues)

## Notes

- **Security**: Ensure API keys and database credentials are kept secure and not committed to the repository
- **Data Privacy**: Follow NASA's data usage policies
- **Performance**: For large datasets, consider batch processing and pagination
