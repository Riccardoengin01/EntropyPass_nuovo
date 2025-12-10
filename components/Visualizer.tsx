import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { EntropyResult } from '../types';

interface VisualizerProps {
  entropyData: EntropyResult;
  aiScore?: number;
}

const Visualizer: React.FC<VisualizerProps> = ({ entropyData, aiScore }) => {
  
  // Normalize entropy for visualization (assuming 128 bits is max "full" bar)
  const normalizedEntropy = Math.min(100, (entropyData.entropy / 128) * 100);
  
  const data = [
    {
      name: 'Entropy (Bits)',
      value: normalizedEntropy,
      fill: '#FFD700', // Gold
    },
    {
      name: 'AI Score',
      value: aiScore || 0,
      fill: aiScore ? (aiScore > 70 ? '#C0C0C0' : aiScore > 40 ? '#B8860B' : '#CF000F') : '#333',
    }
  ];

  return (
    <div className="h-64 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={20} 
          data={data} 
          startAngle={180} 
          endAngle={0}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={4}
            label={{ position: 'insideStart', fill: '#000', fontWeight: 'bold' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '0px' }}
            itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-8">
        <p className="text-eng-silver text-[10px] uppercase tracking-widest mb-1">Estimated Entropy</p>
        <p className="text-4xl font-mono font-bold text-eng-gold">{Math.floor(entropyData.entropy)}<span className="text-sm text-eng-silverDim ml-1">bits</span></p>
      </div>
    </div>
  );
};

export default Visualizer;