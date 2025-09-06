'use client';
import { ViewNodeDrawer } from '@/app/dashboard/components/DatabaseDiagram/DatabaseTableNode/ViewNodeDrawer';
import { useDatabaseDiagramContext } from '@/contexts/DatabaseDiagramContext';
import {
  Background,
  ConnectionMode,
  Controls,
  ReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export function DatabaseDiagram() {
  const { nodes, edges, onEdgesChange, onNodeClick, onConnectEdge, onEdgeClick, onNodesChange, isOpenViewNodeDrawer, nodeTypes, edgeTypes } = useDatabaseDiagramContext();

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <ReactFlow
        colorMode='dark'
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnectEdge}
        onEdgeClick={onEdgeClick}
        onNodeClick={onNodeClick}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{
          animated: false,
          style: {
            stroke: 'white',
            strokeWidth: 1,
            strokeDasharray: '0',
            strokeLinecap: 'square',
          },
        }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      {isOpenViewNodeDrawer.isOpen && (
        <ViewNodeDrawer />
      )}
    </div>
  );
}
