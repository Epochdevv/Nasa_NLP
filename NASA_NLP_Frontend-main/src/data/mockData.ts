// Mock data for 608 NASA bioscience publications
// In production, this would be fetched from a database

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  year: number;
  summary: string;
  experimentType: string;
  link: string;
  topic: string;
}

export interface GraphNode {
  id: string;
  title: string;
  topic: string;
  val: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'cites' | 'related' | 'same-topic';
}

const topics = [
  'Cell Biology',
  'Microgravity',
  'Plant Science',
  'Human Physiology',
  'Molecular Biology',
  'Radiation Effects',
  'Bone Density',
  'Immune System',
];

const experimentTypes = [
  'In-vivo Study',
  'In-vitro Study',
  'Observational',
  'Computational Model',
  'Field Experiment',
];

// Generate 20 publications with realistic data
export const publications: Publication[] = Array.from({ length: 20 }, (_, i) => {
  const topic = topics[i % topics.length];
  const expType = experimentTypes[i % experimentTypes.length];
  
  return {
    id: `pub-${i + 1}`,
    title: `${topic} Research Study ${i + 1}: Effects in Space Environment`,
    authors: [
      `Dr. ${String.fromCharCode(65 + (i % 26))}. Smith`,
      `Prof. ${String.fromCharCode(65 + ((i + 5) % 26))}. Johnson`,
      `Dr. ${String.fromCharCode(65 + ((i + 10) % 26))}. Williams`,
    ],
    year: 2015 + (i % 10),
    summary: `This ${expType.toLowerCase()} investigates ${topic.toLowerCase()} responses under microgravity conditions aboard the International Space Station. Key findings include significant changes in cellular behavior, gene expression patterns, and physiological adaptations. The research contributes to understanding biological processes in space environments.`,
    experimentType: expType,
    link: `https://www.nasa.gov/research/publication-${i + 1}`,
    topic,
  };
});

// Generate graph nodes
export const graphNodes: GraphNode[] = publications.map((pub) => ({
  id: pub.id,
  title: pub.title,
  topic: pub.topic,
  val: 5 + Math.random() * 5, // Node size
}));

// Generate graph links (relationships)
export const graphLinks: GraphLink[] = [];

// Create connections between related publications
for (let i = 0; i < publications.length; i++) {
  const pub = publications[i];
  
  // Connect to publications with same topic
  const sameTopic = publications.filter(
    (p, idx) => p.topic === pub.topic && idx !== i && Math.random() > 0.5
  );
  sameTopic.slice(0, 2).forEach((p) => {
    graphLinks.push({
      source: pub.id,
      target: p.id,
      type: 'same-topic',
    });
  });
  
  // Create citation relationships
  if (i > 2 && Math.random() > 0.6) {
    const citedPub = publications[Math.floor(Math.random() * i)];
    graphLinks.push({
      source: pub.id,
      target: citedPub.id,
      type: 'cites',
    });
  }
  
  // Create related experiment relationships
  if (Math.random() > 0.7) {
    const relatedIdx = (i + 5 + Math.floor(Math.random() * 10)) % publications.length;
    if (relatedIdx !== i) {
      graphLinks.push({
        source: pub.id,
        target: publications[relatedIdx].id,
        type: 'related',
      });
    }
  }
}
