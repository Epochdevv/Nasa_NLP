from neo4j import GraphDatabase
from llm import process_xml_with_llm

password = "z1LZtR-aj7AE7vB0Z95su9vnwzZk8IST_DXmiDnrVp0"
uri = "neo4j+s://f9555bec.databases.neo4j.io"
user = "neo4j"

xml_path = "/home/ady/prjs/hh/Nasa_NLP/xmls/g.xml"
prompt_path = "system_prompt.txt"
api_key_placeholder = "AIzaSyAI5vjdiSoBoGNQzXgaKtrn-4xhg1lMbmo" 


# Sample data to be pushed to Neo4j
# data = process_xml_with_llm(xml_path, prompt_path, api_key_placeholder)

data = {
  "nodes": [
    {
      "label": "Project",
      "id": "1433phosphoproteininteractionnetworks",
      "name": "14-3-3 phosphoprotein interaction networks",
      "summary": "This paper investigates the functional specificity of 14-3-3 phosphoprotein isoforms in plants, particularly Arabidopsis. It examines whether sequence diversity among 14-3-3 isoforms leads to distinct biochemical or cellular functions, or if there is functional redundancy. The study discusses evidence for both specificity and redundancy, proposing a model where functional specificities exist, driven by factors like differential phosphorylation, heterodimerization, and subcellular localization. The paper highlights the need for comparative studies to better understand isoform-specific roles."
    },
    {
      "label": "Technology",
      "id": "massSpectrometry",
      "name": "mass spectrometry"
    },
    {
      "label": "Technology",
      "id": "rtPCR",
      "name": "RT-PCR"
    },
    {
      "label": "Technology",
      "id": "yeastTwoHybrid",
      "name": "yeast two-hybrid"
    },
    {
      "label": "Technology",
      "id": "surfacePlasmonResonance",
      "name": "surface plasmon resonance"
    },
    {
      "label": "Technology",
      "id": "immunocytochemistry",
      "name": "immunocytochemistry"
    },
    {
      "label": "Technology",
      "id": "confocalMicroscopy",
      "name": "confocal microscopy"
    },
    {
      "label": "Client",
      "id": "nasa",
      "name": "NASA",
      "industry": "Space Exploration"
    }
  ],
  "relationships": [
    {
      "from": "1433phosphoproteininteractionnetworks",
      "type": "USES_TECH",
      "to": "massSpectrometry"
    },
    {
      "from": "1433phosphoproteininteractionnetworks",
      "type": "USES_TECH",
      "to": "rtPCR"
    },
    {
      "from": "1433phosphoproteininteractionnetworks",
      "type": "USES_TECH",
      "to": "yeastTwoHybrid"
    },
    {
      "from": "1433phosphoproteininteractionnetworks",
      "type": "USES_TECH",
      "to": "surfacePlasmonResonance"
    },
    {
      "from": "1433phosphoproteininteractionnetworks",
      "type": "USES_TECH",
      "to": "immunocytochemistry"
    },
    {
      "from": "1433phosphoproteininteractionnetworks",
      "type": "USES_TECH",
      "to": "confocalMicroscopy"
    },
    {
      "from": "1433phosphoproteininteractionnetworks",
      "type": "HAS_CLIENT",
      "to": "nasa"
    }
  ]
}



class Neo4jPusher:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def push_data(self, data):
        nodes = data.get("nodes", [])
        relationships = data.get("relationships", [])

        with self.driver.session() as session:
            # Merge nodes
            for node in nodes:
                label = node.get("label")
                node_id = node.get("id")
                # Remove label and id from properties to set separately
                properties = {k: v for k, v in node.items() if k not in ["label", "id"]}
                cypher = (
                    f"MERGE (n:{label} {{id: $id}}) "
                    f"SET " + ", ".join([f"n.{k} = ${k}" for k in properties.keys()])
                )
                params = {"id": node_id, **properties}
                session.run(cypher, params)

            # Create relationships
            for rel in relationships:
                from_id = rel.get("from")
                to_id = rel.get("to")
                rel_type = rel.get("type")
                cypher = (
                    "MATCH (a {id: $from_id}), (b {id: $to_id}) "
                    f"MERGE (a)-[r:{rel_type}]->(b)"
                )
                params = {"from_id": from_id, "to_id": to_id}
                session.run(cypher, params)


# Create an instance of Neo4jPusher
pusher = Neo4jPusher(uri, "neo4j", password)
pusher.push_data(data)
pusher.close()

