import json
from pathlib import Path
from neo4j import GraphDatabase

password = "F7W9GlWtknBO60zxgJ319UQ2SbWgpoTUD0xBcjMCBqI"
uri = "neo4j+s://63457fdc.databases.neo4j.io"
user = "neo4j"

txt_dir = Path("/home/ady/prjs/hh/Nasa_NLP/txt")


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
                properties = {k: v for k, v in node.items() if k not in ["label", "id"]}
                if not label or not node_id:
                    continue
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
                if not from_id or not to_id or not rel_type:
                    continue
                cypher = (
                    "MATCH (a {id: $from_id}), (b {id: $to_id}) "
                    f"MERGE (a)-[r:{rel_type}]->(b)"
                )
                params = {"from_id": from_id, "to_id": to_id}
                session.run(cypher, params)


# Create pusher instance
pusher = Neo4jPusher(uri, user, password)

# Loop through all txt files and push
for txt_file in txt_dir.glob("*.txt"):
    with open(txt_file, "r") as f:
        content = f.read().strip()

        if not content:
            print(f"⚠️ Skipping empty file: {txt_file.name}")
            continue

        try:
            data = json.loads(content)
        except json.JSONDecodeError as e:
            print(f"⚠️ Invalid JSON in {txt_file.name}: {e}")
            continue

        pusher.push_data(data)
        print(f"Pushed data from {txt_file.name}")

pusher.close()
print("✅ All valid data pushed successfully.")
