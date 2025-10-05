import React, { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import neo4j, { Node as NeoNode, Relationship as NeoRel } from 'neo4j-driver';
import bgImg from '@/assets/backgroundImage.jpg';

interface GraphNode {
  id: string;     // stable id for ForceGraph
  name: string;   // human-readable label for hover
  group: string;  // primary label for coloring
}

interface GraphLink {
  source: string;
  target: string;
  type?: string;
}

const URI = 'neo4j+s://f9555bec.databases.neo4j.io';
const USER = 'neo4j';
const PASSWORD = 'z1LZtR-aj7AE7vB0Z95su9vnwzZk8IST_DXmiDnrVp0';

// helpers
const primaryLabel = (node: NeoNode) =>
  Array.isArray(node.labels) && node.labels.length ? node.labels[0] : 'Node';

const pickDisplayName = (props: Record<string, any> | undefined, fallback: string) => {
  const candidates = ['name', 'title', 'label', 'id', 'uuid'];
  for (const key of candidates) {
    const v = props?.[key];
    if (typeof v === 'string' && v.trim().length) return v;
  }
  return fallback;
};

interface KnowledgeGraphProps {
  onNodeSelect?: (node: any) => void;
  onNodeDeselect?: () => void;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ onNodeSelect, onNodeDeselect }) => {
  const fgRef = useRef<any>(null);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({
    nodes: [],
    links: [],
  });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredLink, setHoveredLink] = useState<GraphLink | null>(null);
  // map of relationship type => color for rendering and legend
  const [edgeColorMap, setEdgeColorMap] = useState<Record<string, string>>({});
  const [nodeColorMap, setNodeColorMap] = useState<Record<string, string>>({});
  const [nodeCounts, setNodeCounts] = useState<Record<string, number>>({});
  // (no zoom-driven spacing; spacing is static and tuned after data load)

  const fetchGraphData = async () => {
    const driver = neo4j.driver(
      URI,
      neo4j.auth.basic(USER, PASSWORD)
      // For local HTTP dev only (avoid mixed-content): { encrypted: 'ENCRYPTION_OFF' as any }
    );
    const session = driver.session();

    try {
      const result = await session.run(
       `MATCH (n)
        OPTIONAL MATCH (n)-[r]-(m)
        RETURN n, r, m`
      );

      const nodesMap = new Map<string, GraphNode>();
      const links: GraphLink[] = [];

      result.records.forEach((record) => {
        const n = (record.get('n') as NeoNode) || null;
        const m = (record.get('m') as NeoNode) || null;
        const r = (record.get('r') as NeoRel) || null;

        if (!n) return; // nothing to add if primary node missing

        const nId = `${primaryLabel(n)}:${n.identity.toString()}`;
        if (!nodesMap.has(nId)) {
          nodesMap.set(nId, {
            id: nId,
            name: pickDisplayName(n.properties as any, `${primaryLabel(n)} ${n.identity.toString()}`),
            group: primaryLabel(n)
          });
        }

        if (m) {
          const mId = `${primaryLabel(m)}:${m.identity.toString()}`;
          if (!nodesMap.has(mId)) {
            nodesMap.set(mId, {
              id: mId,
              name: pickDisplayName(m.properties as any, `${primaryLabel(m)} ${m.identity.toString()}`),
              group: primaryLabel(m)
            });
          }

          if (r) {
            links.push({
              source: nId,
              target: mId,
              type: r.type
            });
          }
          }
      });

      const nodes = Array.from(nodesMap.values());
      console.log('Fetched graph:', nodes.length, 'nodes,', links.length, 'links');
      setGraphData({ nodes, links });
    } finally {
      await session.close();
      await driver.close();
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    console.log('Hovered node:', node);
    setHoveredNode(node);
  }, []);

  const handleNodeClick = useCallback((node: GraphNode | null, event?: MouseEvent) => {
    if (!node) return;
    console.log('Node clicked:', node);
    setSelectedNode((prev) => {
      const next = prev && prev.id === node.id ? null : node;
      if (next && onNodeSelect) {
        // pass the raw node-like object
        onNodeSelect(node);
      } else if (!next && onNodeDeselect) {
        onNodeDeselect();
      }
      return next;
    });
  }, []);

  const handleLinkHover = useCallback((link: GraphLink | null) => {
    setHoveredLink(link);
  }, []);

  // note: zoom-based dynamic spacing removed per request; static spacing applied on data load
  // When graph data changes, pick colors for link types and apply modest force tuning to space nodes
  useEffect(() => {
    if (!graphData || !graphData.links) return;
    // derive types and counts
    const counts: Record<string, number> = {};
    graphData.links.forEach((l) => {
      const t = l.type || 'unknown';
      counts[t] = (counts[t] || 0) + 1;
    });

    const types = Object.keys(counts);
    const palette = ['#ff6b6b', '#6b9eff', '#6bff9e', '#ffd56b', '#b66bff', '#6bffd5', '#ff9f6b', '#6b8bff'];
    const map: Record<string, string> = {};
    types.forEach((t, i) => {
      map[t] = palette[i % palette.length];
    });
    setEdgeColorMap(map);

    // store counts on state so legend can display them
    setEdgeCounts(counts as Record<string, number>);

    // derive node group counts and colors
    const gcounts: Record<string, number> = {};
    (graphData.nodes || []).forEach((n: any) => {
      const g = n.group || 'Node';
      gcounts[g] = (gcounts[g] || 0) + 1;
    });
    setNodeCounts(gcounts);
    const gtypes = Object.keys(gcounts);
    const gpalette = ['#66d9ff', '#ffd86b', '#9bffd6', '#c38cff', '#ff8fa3', '#8fb3ff', '#ffd6a6'];
    const gmap: Record<string, string> = {};
    gtypes.forEach((t, i) => (gmap[t] = gpalette[i % gpalette.length]));
    setNodeColorMap(gmap);

    // apply conservative static force tuning to space nodes slightly more
    try {
      const fg = fgRef.current;
      if (!fg) return;
      const chargeForce = fg.d3Force && fg.d3Force('charge');
      const linkForce = fg.d3Force && fg.d3Force('link');
      if (chargeForce && typeof chargeForce.strength === 'function') {
        chargeForce.strength(-50);
      }
      if (linkForce && typeof linkForce.distance === 'function') {
        linkForce.distance(60);
      }
      if (fg.d3ReheatSimulation) fg.d3ReheatSimulation();
    } catch (e) {
      // ignore if internals are not available
    }
  }, [graphData]);
  // store counts for legend
  const [edgeCounts, setEdgeCounts] = useState<Record<string, number>>({});

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}
    >
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
  onLinkHover={handleLinkHover}
        nodeAutoColorBy="group"
        linkColor={'#b1b3b6ff'}
        enableNodeDrag={false}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        // ...existing code...
        linkDirectionalParticles={0} // turn off particles so lines are clear
          linkWidth={0.5} // constant pixel width for all links
        // draw the link lines on the canvas and draw the hovered label on top
        linkCanvasObjectMode={() => 'after'}
        linkCanvasObject={(link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const start = link.source;
          const end = link.target;
          if (!start || !end) return;

          // draw the line for this link
          ctx.save();
          ctx.strokeStyle = '#b1b3b6ff';
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
          ctx.restore();

          // if hovered, draw a readable label box on top
          if (!hoveredLink || hoveredLink !== link) return;
          const x = (start.x + end.x) / 2;
          const y = (start.y + end.y) / 2;
          const label = link.type || link.label || '';
          if (!label) return;
          ctx.save();
          const fontSize = Math.max(12, 14 / Math.sqrt(Math.max(globalScale, 1)));
          ctx.font = `${fontSize}px sans-serif`;
          const textWidth = ctx.measureText(label).width;
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.fillRect(x - textWidth / 2 - 6, y - fontSize / 2 - 4, textWidth + 12, fontSize + 8);
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, x, y);
          ctx.restore();
  }}
  nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const label = node.name as string;
          const dot = 2; // pixel radius
          // draw node dot
          ctx.beginPath();
          ctx.arc(node.x, node.y, dot, 0, 2 * Math.PI, false);
          const group = node.group || 'Node';
          ctx.fillStyle = nodeColorMap[group] || node.color || '#888';
          ctx.fill();

          // halo for hovered/selected
          if (selectedNode && selectedNode.id === node.id) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, dot + 4, 0, 2 * Math.PI, false);
            ctx.strokeStyle = 'rgba(255,215,0,0.9)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          } else if (hoveredNode && hoveredNode.id === node.id) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, dot + 3, 0, 2 * Math.PI, false);
            ctx.strokeStyle = 'rgba(255,255,255,0.6)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }

          // show labels when zoomed in or hovered/selected
          const labelZoomThreshold = 1.4;
          const shouldShowLabel = globalScale > labelZoomThreshold || (hoveredNode && hoveredNode.id === node.id) || (selectedNode && selectedNode.id === node.id);
          if (shouldShowLabel && typeof label === 'string' && label.length) {
            const fontSize = 6;
            ctx.font = `${fontSize}px sans-serif`;
            const textWidth = 6
            const padX = 6;
            const padY = 4;
            const bckw = textWidth + padX * 2;
            const bckh = fontSize + padY * 2;
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(node.x + 6, node.y - bckh / 2, bckw, bckh);
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, node.x + 6 + padX, node.y);
          }
        }}
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
          const radius = selectedNode && selectedNode.id === node.id ? 8 : 5;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 2, 0, Math.PI * 2, true);
          ctx.fill();
        }}
      />
      {/* right-hand edge legend removed per request */}
      {/* Left panel: node groups and relationship types (Neo4j-like) */}
      <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(20,20,20,0.8)', color: '#fff', padding: 10, borderRadius: 8, maxWidth: 220 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Nodes ({Object.values(nodeCounts).reduce((a,b)=>a+b,0) || 0})</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {Object.entries(nodeColorMap).map(([g, color]) => (
            <div key={g} style={{ background: '#111', padding: '4px 6px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, background: color, borderRadius: 6 }} />
              <div style={{ fontSize: 12 }}>{g}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10, fontWeight: 700 }}>Relationships ({Object.values(edgeCounts).reduce((a,b)=>a+b,0) || 0})</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
          {Object.entries(edgeColorMap).map(([type, color]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 12, background: color, borderRadius: 4 }} />
              <div style={{ fontSize: 12 }}>{type} <span style={{ opacity: 0.8, marginLeft: 6 }}>({edgeCounts[type] ?? 0})</span></div>
            </div>
          ))}
        </div>
      </div>
      {hoveredNode && (
        <div style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'white', padding: 6, borderRadius: 4 }}>
          Hovered node: {hoveredNode.name}
        </div>
      )}
    </div>
  );
};
