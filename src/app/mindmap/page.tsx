'use client';

import { useState, useRef } from 'react';
import { mindMapsData, MindMapNode } from '@/lib/mindmap';
import { ZoomIn, ZoomOut, RotateCcw, Download, HelpCircle, Expand, ListFilter } from 'lucide-react';

export default function MindMapPage() {
  const [selectedTopic, setSelectedTopic] = useState('Freedom of Speech');
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 50, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement>(null);

  const activeRoot = mindMapsData[selectedTopic] || mindMapsData['Freedom of Speech'];

  // Toggle collapse state
  const toggleNode = (nodeName: string) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeName)) {
        next.delete(nodeName);
      } else {
        next.add(nodeName);
      }
      return next;
    });
  };

  // Helper to count leaves of a subtree (for spacing)
  const getSubtreeLeafCount = (node: MindMapNode): number => {
    if (collapsedNodes.has(node.name) || !node.children || node.children.length === 0) {
      return 1;
    }
    return node.children.reduce((sum, child) => sum + getSubtreeLeafCount(child), 0);
  };

  // Render tree helper (DFS) to build node and link arrays
  const nodesList: { name: string; x: number; y: number; isCollapsed: boolean; hasChildren: boolean }[] = [];
  const linksList: { x1: number; y1: number; x2: number; y2: number }[] = [];

  const layoutTree = (
    node: MindMapNode,
    depth: number,
    startY: number,
    allocatedHeight: number
  ): { x: number; y: number } => {
    const x = depth * 200 + 100;
    const y = startY + allocatedHeight / 2;
    const isCollapsed = collapsedNodes.has(node.name);
    const hasChildren = !!node.children && node.children.length > 0;

    nodesList.push({
      name: node.name,
      x,
      y,
      isCollapsed,
      hasChildren
    });

    if (hasChildren && !isCollapsed) {
      const children = node.children!;
      const totalLeaves = getSubtreeLeafCount(node);
      let currentY = startY;

      children.forEach(child => {
        const childLeaves = getSubtreeLeafCount(child);
        const childAllocatedHeight = (childLeaves / totalLeaves) * allocatedHeight;
        
        const childPos = layoutTree(child, depth + 1, currentY, childAllocatedHeight);
        
        linksList.push({
          x1: x,
          y1: y,
          x2: childPos.x,
          y2: childPos.y
        });

        currentY += childAllocatedHeight;
      });
    }

    return { x, y };
  };

  // Run layout
  const baseHeight = 500;
  layoutTree(activeRoot, 0, 0, baseHeight);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetViewport = () => {
    setZoom(1);
    setPan({ x: 50, y: 150 });
  };

  // Export to PNG (SVG serialization to Canvas)
  const exportPNG = () => {
    if (!svgRef.current) return;
    const svgString = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const DOMURL = window.URL || window.webkitURL || window;
    const url = DOMURL.createObjectURL(svgBlob);
    
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#09090b'; // dark bg match
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 50, 50, 1100, 700);
        
        const png = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = png;
        downloadLink.download = `${selectedTopic.toLowerCase().replace(/\s+/g, '_')}_mindmap.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };
    image.src = url;
  };

  // Export to PDF via standard print trigger (saves layout perfectly)
  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-8 print:p-0">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-850 pb-6 print:hidden">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white flex items-center space-x-3">
            <Expand className="h-9 w-9 text-indigo-500" />
            <span>Interactive Mind Maps</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Analyze constitutional themes. Click nodes to expand/collapse. Drag canvas to pan.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportPNG}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>PNG</span>
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Grid: Topics Selector Sidebar & SVG Canvas */}
      <div className="grid md:grid-cols-4 gap-8 items-start">
        {/* Selector Sidebar */}
        <div className="md:col-span-1 glass-card p-5 rounded-2xl space-y-4 print:hidden">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-zinc-850 pb-3">
            <ListFilter className="h-4 w-4 text-indigo-500" />
            <span>Select Topic</span>
          </h3>

          <div className="grid gap-2">
            {Object.keys(mindMapsData).map(topic => (
              <button
                key={topic}
                onClick={() => {
                  setSelectedTopic(topic);
                  setCollapsedNodes(new Set());
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedTopic === topic
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-zinc-900 hover:bg-zinc-800/80 text-zinc-400 hover:text-white'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Interactive Canvas */}
        <div className="md:col-span-3 flex flex-col space-y-4 print:col-span-4">
          <div 
            className="w-full h-[600px] border border-zinc-850 bg-zinc-950/45 rounded-2xl relative overflow-hidden select-none cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Overlay Navigation Controls */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-zinc-900/80 backdrop-blur border border-zinc-800 p-2 rounded-lg shadow-lg z-10 print:hidden">
              <button
                onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                className="p-1.5 hover:bg-zinc-850 rounded text-zinc-300 hover:text-white transition cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                className="p-1.5 hover:bg-zinc-850 rounded text-zinc-300 hover:text-white transition cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={resetViewport}
                className="p-1.5 hover:bg-zinc-850 rounded text-zinc-300 hover:text-white transition cursor-pointer"
                title="Reset View"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <svg
              ref={svgRef}
              className="w-full h-full"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: '0px 0px',
                transition: isDragging ? 'none' : 'transform 0.15s ease-out'
              }}
            >
              {/* Connection Paths */}
              {linksList.map((link, idx) => {
                // Bezier curve control points
                const midX = (link.x1 + link.x2) / 2;
                const d = `M ${link.x1} ${link.y1} C ${midX} ${link.y1}, ${midX} ${link.y2}, ${link.x2} ${link.y2}`;
                return (
                  <path
                    key={idx}
                    d={d}
                    fill="none"
                    stroke="#4338ca"
                    strokeWidth="2"
                    strokeOpacity="0.4"
                  />
                );
              })}

              {/* Mind Map Nodes */}
              {nodesList.map((node, idx) => {
                const isRoot = idx === 0;
                return (
                  <g key={idx} className="cursor-pointer" onClick={() => node.hasChildren && toggleNode(node.name)}>
                    {/* Node capsule border */}
                    <rect
                      x={node.x - 8}
                      y={node.y - 18}
                      width={node.name.length * 7 + 28}
                      height={32}
                      rx={8}
                      fill={isRoot ? '#4f46e5' : '#18181b'}
                      stroke={isRoot ? '#6366f1' : node.isCollapsed ? '#eab308' : '#27272a'}
                      strokeWidth={1.5}
                      className="transition-all duration-350"
                    />

                    {/* Node Text */}
                    <text
                      x={node.x + 8}
                      y={node.y + 3}
                      fill="white"
                      fontSize={11}
                      fontWeight="bold"
                      className="font-sans"
                    >
                      {node.name}
                    </text>

                    {/* Toggle Indicator */}
                    {node.hasChildren && (
                      <circle
                        cx={node.x + node.name.length * 7 + 10}
                        cy={node.y - 2}
                        r={4.5}
                        fill={node.isCollapsed ? '#eab308' : '#6366f1'}
                        opacity={0.8}
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-zinc-500 print:hidden">
            <HelpCircle className="h-4 w-4" />
            <span>Orange dots indicate collapsed branches. Click a node to reveal details.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
