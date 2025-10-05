import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface ChatBotProps {
  title: string;
  isActive: boolean;
  position: 'left' | 'right';
  description: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string | JSX.Element;
}

export const ChatBot = ({ title, isActive, position, description }: ChatBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: description,
    },
  ]);
  const [input, setInput] = useState('');
  const [responseIndex, setResponseIndex] = useState(0); // track next response
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !isActive) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    // AI response
    setTimeout(() => {
      const responses: (string | JSX.Element)[] = title.includes('Traversal')
        ? [
            'Try clicking on any node to explore publication details.',
            'Use the filter button to narrow down your search.',
            'Zoom and pan around the graph to explore connections.',
            'Node colors represent different research topics.',
          ]
        : [
            'This study reports the genome sequences of fungi that were isolated from the International Space Station during the Microbial Tracking-2 experiment. It focuses on identifying and analyzing microorganisms in space environments to understand their characteristics and potential impacts on astronauts and spacecraft systems.',
            <span>
              The link for the resource paper is:{' '}
              <a
                href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8444978/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                https://pmc.ncbi.nlm.nih.gov/articles/PMC8444978/
              </a>
            </span>,
            <span>
              The mission was part of the Microbial 
              Tracking-2 study. Mission link (NASA GeneLab project number):{' '}
              <a
                href="https://osdr.nasa.gov/bio/repo/data/studies/OSD-400"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                https://osdr.nasa.gov/bio/repo/data/studies/OSD-400
              </a>{' '}
              Experiment link:{' '}
              <a
                href="https://www.nasa.gov/ames/space-biosciences/microbial-tracking-2/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                https://www.nasa.gov/ames/space-biosciences/microbial-tracking-2/
              </a>
            </span>,
            "You're welcome!"
          ];

      // send response in order, stop after last
      if (responseIndex < responses.length) {
        const botMessage: Message = {
          role: 'assistant',
          content: responses[responseIndex],
        };
        setMessages((prev) => [...prev, botMessage]);
        setResponseIndex((prev) => prev + 1);
      }
    }, 1000);

    setInput('');
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`fixed bottom-8 ${position === 'left' ? 'left-8' : 'right-8'} z-40`}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          disabled={!isActive}
          className={`w-14 h-14 rounded-full shadow-lg transition-all ${
            isActive
              ? 'bg-primary hover:bg-primary/90'
              : 'bg-muted/50 cursor-not-allowed'
          }`}
        >
          {isOpen ? <FiX className="w-6 h-6" /> : <FiMessageCircle className="w-6 h-6" />}
        </Button>
        
        {!isActive && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-muted-foreground/50 rounded-full" />
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-24 ${
              position === 'left' ? 'left-8' : 'right-8'
            } z-40 w-96 max-h-[600px] glass-panel rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className="bg-primary p-4 border-b border-border/50">
              <h3 className="font-semibold text-primary-foreground">{title}</h3>
              <p className="text-xs text-primary-foreground/70 mt-1">AI Assistant</p>
            </div>

            {/* Messages */}
            <ScrollArea className="h-96 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card text-card-foreground border border-border'
                      }`}
                    >
                      {typeof message.content === 'string' ? (
                        <p className="text-sm">{message.content}</p>
                      ) : (
                        message.content
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border/50 bg-card/50">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button onClick={handleSend} size="icon" className="bg-accent text-accent-foreground">
                  <FiSend className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};