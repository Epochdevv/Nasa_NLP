import { useState } from 'react';
import { motion } from 'framer-motion';
import { KnowledgeGraph } from './KnowledgeGraph';
import { ChatBot } from './ChatBot';
import { NodeDetailModal } from './NodeDetailModal';
import { FilterPanel } from './FilterPanel';
// Publication type existed in mockData; handlers now accept generic node objects from Neo4j
import logo from '@/assets/knowledge-verse-logo.png';

export const Dashboard = () => {
  const [selectedPublication, setSelectedPublication] = useState<any | null>(null);
  const [isTraversalActive, setIsTraversalActive] = useState(true);
  const [isResearchActive, setIsResearchActive] = useState(false);

  const handleNodeSelect = (publication: any) => {
    // store the raw node object (Dashboard/NodeDetailModal can map properties as needed)
    setSelectedPublication(publication as any);
    // Switch chatbot states
    setIsTraversalActive(false);
    setIsResearchActive(true);
  };

  const handleNodeDeselect = () => {
    setSelectedPublication(null);
    setIsTraversalActive(true);
    setIsResearchActive(false);
  };

  const handleModalClose = () => {
    setSelectedPublication(null);
  };

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute top-0 left-0 right-0 z-30 glass-panel border-b border-border/50"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Knowledge-Verse" className="w-12 h-12" />
            <div>
              <h1 className="text-xl font-bold">Knowledge-Verse</h1>
              <p className="text-xs text-muted-foreground">
                NASA Bioscience Publications Network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FilterPanel />
            <div className="text-sm text-muted-foreground">
              20 Publications • Multiple Topics
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Graph Area */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="absolute inset-0 pt-20"
      >
        <KnowledgeGraph onNodeSelect={handleNodeSelect} onNodeDeselect={handleNodeDeselect} />
      </motion.div>

      {/* Chatbots */}
      <ChatBot
        title="Traversal Chatbot"
        isActive={isTraversalActive}
        position="left"
        description="Hi! I'm here to help you navigate the knowledge graph. Try clicking on nodes to explore publications, or ask me for guidance!"
      />
      
      <ChatBot
        title="Research Paper Chatbot"
        isActive={isResearchActive}
        position="right"
        description="I can help you understand the selected research paper. Ask me questions about the methodology, findings, or implications!"
      />

      {/* Node Detail Modal */}
      {selectedPublication && (
        <NodeDetailModal publication={selectedPublication} onClose={handleModalClose} />
      )}
    </div>
  );
};
