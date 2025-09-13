'use client';
import { useNodeAndEdgeStore, useViewNodeDrawerStore } from '@/store/DatabaseDiagramStore';
import { Background, ConnectionMode, Controls, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useParams } from 'next/navigation';
import { ViewNodeDrawer } from './DatabaseTableNode/ViewNodeDrawer';

export function DatabaseDiagram() {
  const params = useParams()
  const boardId = params.boardId as string;

  const {
    schema,
    onNodeClick,
    onConnectEdge,
    onReconnect,
    onReconnectStart,
    onReconnectEnd,
    onEdgesChange,
    onNodesChange,
    onEdgeClick,
    nodeTypes,
    edgeTypes,
  } = useNodeAndEdgeStore();
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
        onReconnect={onReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        onEdgeClick={onEdgeClick}
        onNodeClick={onNodeClick}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{
          animated: false,
          type: 'default',
          style: {
            stroke: '#06b6d4',
            strokeWidth: 2,
            strokeLinecap: 'round',
          },
        }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        reconnectRadius={20}
      >
        <Background color="#374151" gap={20} />
        <Controls className="bg-gray-800 border border-gray-600 rounded-lg [&>button]:bg-gray-700 [&>button]:border-gray-600 [&>button]:text-gray-200 [&>button:hover]:bg-gray-600" />
      </ReactFlow>

      {viewNodeDrawerStore.isOpen && (
        <ViewNodeDrawer />
      )}
    </div>
  );
}