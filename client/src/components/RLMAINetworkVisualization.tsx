import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 27 Companies in the RLMAI Network
const companies = [
  // AI Safety (13) - Blue
  { name: 'CSOAI', fullName: 'CSOAI.org', category: 'ai-safety', angle: 0, distance: 0.35 },
  { name: 'CEASAI', fullName: 'CEASAI.org', category: 'ai-safety', angle: 30, distance: 0.4 },
  { name: 'CouncilOf', fullName: 'CouncilOf.ai', category: 'ai-safety', angle: 60, distance: 0.45 },
  { name: 'SafetyOf', fullName: 'SafetyOf.ai', category: 'ai-safety', angle: 90, distance: 0.38 },
  { name: 'BiasDetection', fullName: 'BiasDetectionOf.ai', category: 'ai-safety', angle: 120, distance: 0.5 },
  { name: 'Transparency', fullName: 'TransparencyOf.ai', category: 'ai-safety', angle: 150, distance: 0.42 },
  { name: 'AGISafe', fullName: 'AGISafe.ai', category: 'ai-safety', angle: 180, distance: 0.48 },
  { name: 'ASISecurity', fullName: 'ASISecurity.ai', category: 'ai-safety', angle: 210, distance: 0.36 },
  { name: 'DataPrivacy', fullName: 'DataPrivacyOf.ai', category: 'ai-safety', angle: 240, distance: 0.52 },
  { name: 'SuicideStop', fullName: 'SuicideStop.ai', category: 'ai-safety', angle: 270, distance: 0.44 },
  { name: 'EthicalGov', fullName: 'EthicalGovernanceOf.ai', category: 'ai-safety', angle: 300, distance: 0.4 },
  { name: 'LoopFactory', fullName: 'LoopFactory.ai', category: 'ai-safety', angle: 330, distance: 0.46 },
  { name: 'ProofOf', fullName: 'ProofOf.ai', category: 'ai-safety', angle: 15, distance: 0.55 },
  
  // SaaS AI (7) - Emerald
  { name: 'KoiKeeper', fullName: 'KoiKeeper.ai', category: 'saas-ai', angle: 45, distance: 0.6 },
  { name: 'FishKeeper', fullName: 'FishKeeper.ai', category: 'saas-ai', angle: 75, distance: 0.58 },
  { name: 'PlantHire', fullName: 'PlantHire.ai', category: 'saas-ai', angle: 135, distance: 0.62 },
  { name: 'Muckaway', fullName: 'Muckaway.ai', category: 'saas-ai', angle: 165, distance: 0.56 },
  { name: 'GrabHire', fullName: 'GrabHire.ai', category: 'saas-ai', angle: 225, distance: 0.64 },
  { name: 'Commercial', fullName: 'CommercialVehicle.ai', category: 'saas-ai', angle: 285, distance: 0.58 },
  { name: 'OptiMobile', fullName: 'OptiMobile.ai', category: 'saas-ai', angle: 315, distance: 0.6 },
  
  // Traditional (6) - Purple
  { name: 'LandLaw', fullName: 'LandLaw.ai', category: 'traditional', angle: 105, distance: 0.7 },
  { name: 'DIYHelp', fullName: 'DIYHelp.ai', category: 'traditional', angle: 195, distance: 0.68 },
  { name: 'PokerHUD', fullName: 'PokerHUD.ai', category: 'traditional', angle: 255, distance: 0.72 },
  { name: 'NetworkNick', fullName: 'NetworkNick.co.uk', category: 'traditional', angle: 345, distance: 0.66 },
  { name: 'Opticians', fullName: 'Templeman-Opticians.com', category: 'traditional', angle: 50, distance: 0.74 },
  { name: 'IOK Farm', fullName: 'IOKFarm.co.uk', category: 'traditional', angle: 200, distance: 0.76 },
];

const categoryColors = {
  'ai-safety': {
    bg: 'bg-blue-500/20',
    border: 'border-blue-400',
    text: 'text-blue-300',
    glow: 'shadow-blue-500/50',
    dot: 'bg-blue-400',
  },
  'saas-ai': {
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-400',
    text: 'text-emerald-300',
    glow: 'shadow-emerald-500/50',
    dot: 'bg-emerald-400',
  },
  'traditional': {
    bg: 'bg-purple-500/20',
    border: 'border-purple-400',
    text: 'text-purple-300',
    glow: 'shadow-purple-500/50',
    dot: 'bg-purple-400',
  },
};

interface DataFlow {
  id: number;
  fromIndex: number;
  toCenter: boolean;
  progress: number;
}

export function RLMAINetworkVisualization() {
  const [dailyDecisions, setDailyDecisions] = useState(12847);
  const [activeNodes, setActiveNodes] = useState<Set<number>>(new Set());
  const [dataFlows, setDataFlows] = useState<DataFlow[]>([]);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const flowIdRef = useRef(0);

  // Increment daily decisions counter
  useEffect(() => {
    const interval = setInterval(() => {
      setDailyDecisions(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Randomly activate nodes to show activity
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * companies.length);
      setActiveNodes(prev => {
        const newSet = new Set(prev);
        newSet.add(randomIndex);
        return newSet;
      });
      
      // Create data flow animation
      const newFlow: DataFlow = {
        id: flowIdRef.current++,
        fromIndex: randomIndex,
        toCenter: true,
        progress: 0,
      };
      setDataFlows(prev => [...prev, newFlow]);
      
      // Remove active state after animation
      setTimeout(() => {
        setActiveNodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(randomIndex);
          return newSet;
        });
      }, 1000);
      
      // Remove flow after animation completes
      setTimeout(() => {
        setDataFlows(prev => prev.filter(f => f.id !== newFlow.id));
      }, 1500);
    }, 300);
    
    return () => clearInterval(interval);
  }, []);

  const getNodePosition = (angle: number, distance: number, containerSize: number) => {
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;
    const maxRadius = containerSize / 2 - 60;
    const radians = (angle * Math.PI) / 180;
    
    return {
      x: centerX + Math.cos(radians) * maxRadius * distance,
      y: centerY + Math.sin(radians) * maxRadius * distance,
    };
  };

  return (
    <div className="relative w-full py-16 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>
      
      {/* Glowing orbs background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-blue-300 text-sm font-medium">RLMAI Cross-Training Network</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            27 AI Companies. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">One Neural Network.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Watch real-time data flow between products. Each decision improves the entire network.
          </p>
        </div>

        {/* Network Visualization */}
        <div 
          ref={containerRef}
          className="relative mx-auto aspect-square max-w-3xl"
        >
          {/* SVG for connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 600">
            {/* Static connection lines to center */}
            {companies.map((company, index) => {
              const pos = getNodePosition(company.angle, company.distance, 600);
              return (
                <line
                  key={`line-${index}`}
                  x1={300}
                  y1={300}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="rgba(100, 150, 255, 0.1)"
                  strokeWidth="1"
                />
              );
            })}
            
            {/* Animated data flow particles */}
            {dataFlows.map((flow) => {
              const company = companies[flow.fromIndex];
              const pos = getNodePosition(company.angle, company.distance, 600);
              const colors = categoryColors[company.category as keyof typeof categoryColors];
              
              return (
                <motion.circle
                  key={flow.id}
                  r="4"
                  fill={company.category === 'ai-safety' ? '#60a5fa' : company.category === 'saas-ai' ? '#34d399' : '#a78bfa'}
                  initial={{ cx: pos.x, cy: pos.y, opacity: 1 }}
                  animate={{ cx: 300, cy: 300, opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              );
            })}
          </svg>

          {/* Central RLMAI Hub */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            animate={{
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.3)',
                '0 0 40px rgba(59, 130, 246, 0.5)',
                '0 0 20px rgba(59, 130, 246, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 border-4 border-blue-400 flex flex-col items-center justify-center">
              <span className="text-white font-bold text-xl">RLMAI</span>
              <span className="text-blue-200 text-xs mt-1">{dailyDecisions.toLocaleString()}+ daily</span>
            </div>
          </motion.div>

          {/* Company Nodes */}
          {companies.map((company, index) => {
            const pos = getNodePosition(company.angle, company.distance, 600);
            const colors = categoryColors[company.category as keyof typeof categoryColors];
            const isActive = activeNodes.has(index);
            const isHovered = hoveredNode === index;
            
            // Convert to percentage for positioning
            const leftPercent = (pos.x / 600) * 100;
            const topPercent = (pos.y / 600) * 100;
            
            return (
              <motion.div
                key={company.name}
                className="absolute z-10"
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseEnter={() => setHoveredNode(index)}
                onMouseLeave={() => setHoveredNode(null)}
                animate={{
                  scale: isActive ? 1.2 : isHovered ? 1.15 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`
                    relative px-3 py-2 rounded-full border-2 backdrop-blur-sm cursor-pointer
                    transition-all duration-300
                    ${colors.bg} ${colors.border}
                    ${isActive ? `shadow-lg ${colors.glow}` : ''}
                    ${isHovered ? 'shadow-xl' : ''}
                  `}
                >
                  <span className={`text-xs font-medium whitespace-nowrap ${colors.text}`}>
                    {company.name}
                  </span>
                  
                  {/* Pulse effect when active */}
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 rounded-full ${colors.border} border-2`}
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.8 }}
                    />
                  )}
                </div>
                
                {/* Tooltip on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-30 whitespace-nowrap"
                    >
                      <span className="text-white text-xs font-medium">{company.fullName}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Legend and Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
          {/* Category Legend */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <span className="text-slate-400 text-sm">AI Safety</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-slate-400 text-sm">SaaS AI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400" />
              <span className="text-slate-400 text-sm">Traditional</span>
            </div>
          </div>
          
          {/* Live Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white font-semibold">{dailyDecisions.toLocaleString()}</span>
              <span className="text-slate-400 text-sm">decisions today</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-slate-400 text-sm">Live network</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RLMAINetworkVisualization;
