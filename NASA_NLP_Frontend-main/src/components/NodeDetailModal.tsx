import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiExternalLink, FiUsers, FiCalendar, FiFileText } from 'react-icons/fi';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

type GenericEntity = {
  // raw node data from graph query
  id?: string;
  labels?: string[];
  properties?: Record<string, any>;
};

export interface PublicationLike {
  id: string;
  title: string;
  authors: string[];
  year: number | string;
  summary: string;
  experimentType: string;
  link: string;
}

// Adaptor to coerce arbitrary node data into PublicationLike
export const toPublicationLike = (node: GenericEntity): PublicationLike => {
  const props = node?.properties ?? {};
  const title =
    (typeof props.name === 'string' && props.name) ||
    (typeof props.title === 'string' && props.title) ||
    (typeof props.label === 'string' && props.label) ||
    `Node ${node?.id ?? ''}`;

  const authorsRaw = props.authors ?? props.author ?? [];
  const authors =
    Array.isArray(authorsRaw)
      ? authorsRaw.filter((a) => typeof a === 'string')
      : typeof authorsRaw === 'string'
      ? [authorsRaw]
      : [];

  const year = props.year ?? props.publishedYear ?? props.date ?? '';

  const summary =
    (typeof props.summary === 'string' && props.summary) ||
    (typeof props.abstract === 'string' && props.abstract) ||
    '';

  const link =
    (typeof props.link === 'string' && props.link) ||
    (typeof props.url === 'string' && props.url) ||
    '#';

  const experimentType =
    (Array.isArray(node?.labels) && node.labels[0]) ||
    (typeof props.type === 'string' && props.type) ||
    'Entity';

  return {
    id: String(node?.id ?? props.id ?? props.uuid ?? title),
    title,
    authors,
    year,
    summary,
    experimentType,
    link
  };
};

interface NodeDetailModalProps {
  // Accept either a previously mapped PublicationLike or a raw node to be adapted
  publication: PublicationLike | GenericEntity | null;
  onClose: () => void;
}

export const NodeDetailModal = ({ publication, onClose }: NodeDetailModalProps) => {
  if (!publication) return null;

  // Normalize to PublicationLike so UI is stable
  const pub: PublicationLike =
    'title' in publication && 'experimentType' in publication
      ? (publication as PublicationLike)
      : toPublicationLike(publication as GenericEntity);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="glass-panel rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {pub.title || 'Untitled'}
              </h2>
              <Badge className="bg-accent text-accent-foreground">
                {pub.experimentType || 'Entity'}
              </Badge>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="hover:bg-destructive/20"
            >
              <FiX className="w-5 h-5" />
            </Button>
          </div>

          {/* Metadata */}
          <div className="space-y-4 mb-6">
            {pub.authors?.length > 0 && (
              <div className="flex items-start gap-3">
                <FiUsers className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Authors</p>
                  <p className="text-foreground">{pub.authors.join(', ')}</p>
                </div>
              </div>
            )}

            {String(pub.year)?.length > 0 && (
              <div className="flex items-start gap-3">
                <FiCalendar className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    Publication Year
                  </p>
                    <p className="text-foreground">{pub.year}</p>
                </div>
              </div>
            )}

            {pub.summary && (
              <div className="flex items-start gap-3">
                <FiFileText className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Summary</p>
                  <p className="text-foreground leading-relaxed">{pub.summary}</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          {pub.link && pub.link !== '#' && (
            <Button
              onClick={() => window.open(pub.link, '_blank')}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <FiExternalLink className="w-4 h-4 mr-2" />
              View Original Research Paper
            </Button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
