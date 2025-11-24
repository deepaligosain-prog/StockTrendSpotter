import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { GroundingSource } from '../types';

interface SourceListProps {
  sources: GroundingSource[];
}

export const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (sources.length === 0) return null;

  return (
    <div className="mt-8 pt-8 border-t border-slate-800">
      <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Globe size={14} />
        Data Sources
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sources.map((source, idx) => (
          <a
            key={idx}
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 
                       hover:bg-slate-800 hover:border-slate-700 transition-colors group"
          >
            <span className="text-sm text-slate-300 truncate pr-4">{source.title}</span>
            <ExternalLink size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
};