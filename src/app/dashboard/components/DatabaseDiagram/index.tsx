'use client';
import { useNodeAndEdgeStore, useViewNodeDrawerStore } from '@/store/DatabaseDiagramStore';
import { Background, ConnectionMode, Controls, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ViewNodeDrawer } from './DatabaseTableNode/ViewNodeDrawer';

export function DatabaseDiagram() {
  const { schema, edgeTypes, nodeTypes, onNodeClick, onConnectEdge, onEdgesChange, onNodesChange, onEdgeClick } = useNodeAndEdgeStore();

  const viewNodeDrawerStore = useViewNodeDrawerStore();

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <ReactFlow
        colorMode='dark'
        nodes={schema?.nodes}
        edges={schema?.edges}
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

      {viewNodeDrawerStore.isOpen && (
        <ViewNodeDrawer />
      )}
    </div>
  );
}
