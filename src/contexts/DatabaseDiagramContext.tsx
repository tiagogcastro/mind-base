'use client'
import { DefaultEdge, DefaultEdgeProps } from '@/app/dashboard/components/DatabaseDiagram/DatabaseTableEdge/DefaultEdge';
import { DatabaseTableNode, DatabaseTableNodeProps } from '@/app/dashboard/components/DatabaseDiagram/DatabaseTableNode';
import { useDisclosure, UseDisclosureReturn } from '@/hooks/useDisclosure';
import { Connection, Edge, Node, OnEdgesChange, OnNodesChange, useEdgesState, useNodesState, XYPosition } from '@xyflow/react';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export type DatabaseTableNodeDataField = {
  id: string;
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isUnique?: boolean;
}

export type DatabaseTableNodeData = {
  tableName: string;
  fields: DatabaseTableNodeDataField[];
};

export type DatabaseTableNodeType = Node<DatabaseTableNodeData> & {
  type: 'db';
  position: XYPosition;
};

export type DatabaseEdgeType = Edge & {
  type: 'default';
};

export type DatabaseSchema = {
  nodes: DatabaseTableNodeType[];
  edges: DatabaseEdgeType[];
};

type DatabaseDiagramContextType = {
  onEdgeClick: (event: React.MouseEvent, edge: Edge) => void;
  onNodeClick: (event: React.MouseEvent, node: DatabaseTableNodeType) => void;
  onConnectEdge: (params: Edge | Connection) => void;
  onEdgesChange: OnEdgesChange<DatabaseEdgeType>;
  onNodesChange: OnNodesChange<DatabaseTableNodeType>;

  currentNodeSelected: DatabaseTableNodeType | null;
  nodes: DatabaseTableNodeType[];
  edges: DatabaseEdgeType[];

  setNodes: React.Dispatch<React.SetStateAction<DatabaseTableNodeType[]>>;
  setEdges: React.Dispatch<React.SetStateAction<DatabaseEdgeType[]>>;

  isOpenViewNodeDrawer: UseDisclosureReturn;
  edgeTypes: {
    default: (props: DefaultEdgeProps) => React.ReactElement;
  };
  nodeTypes: {
    db: (props: DatabaseTableNodeProps) => React.ReactElement;
  };
};

const DatabaseDiagramContext = createContext<DatabaseDiagramContextType | undefined>(undefined);

export const DatabaseDiagramProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const nodeTypes = {
    db: DatabaseTableNode,
  };

  const edgeTypes = {
    default: DefaultEdge,
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([] as DatabaseTableNodeType[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as DatabaseEdgeType[]);

  const isOpenViewNodeDrawer = useDisclosure();

  const [currentNodeSelected, setCurrentNodeSelected] = useState<DatabaseTableNodeType | null>(null);

  useEffect(() => {
    // async function load() {
    //   const { nodes, edges } = await loadDatabaseSchema();
    //   setNodes(nodes);
    //   setEdges(edges);
    // }

    // load();
  }, []);

  const onConnectEdge = useCallback((params: Edge | Connection) => {
    const newEdge: DatabaseEdgeType = {
      ...params,
      id: crypto.randomUUID(),
      type: 'default',
    };

    setEdges((edges) => {
      const edgeExists = edges.some((edge) =>
        ((edge.source === newEdge.source) && (edge.target === newEdge.target)) ||
        ((edge.target === newEdge.target) && (edge.source === newEdge.source)) ||
        ((edge.source === newEdge.target) && (edge.target === newEdge.source))
      );

      if (edgeExists) {
        return edges;
      }

      if (newEdge.source === newEdge.target) {
        alert('Não é possível criar uma ligação para o mesmo nó');
        return edges;
      }

      return [...edges, newEdge];
    });
  }, []);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    const handleEdgeTypeChange = (e: any) => {
      const { id, newType } = e.detail;

      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === id ? { ...edge, type: newType } : edge
        )
      );
    };

    window.addEventListener('edge-type-change', handleEdgeTypeChange);
    return () => window.removeEventListener('edge-type-change', handleEdgeTypeChange);
  }, [setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: DatabaseTableNodeType) => {
    event.preventDefault();

    setCurrentNodeSelected(node);

    isOpenViewNodeDrawer.onOpen();
  }, [isOpenViewNodeDrawer, setCurrentNodeSelected])

  return (
    <DatabaseDiagramContext.Provider
      value={{
        onEdgeClick,
        onNodeClick,
        onConnectEdge,
        onNodesChange,
        onEdgesChange,

        setNodes,
        setEdges,

        currentNodeSelected,
        nodes,
        edges,

        edgeTypes,
        nodeTypes,

        isOpenViewNodeDrawer,
      }}
    >
      {children}
    </DatabaseDiagramContext.Provider>
  );
};

export const useDatabaseDiagramContext = (): DatabaseDiagramContextType => {
  const context = useContext(DatabaseDiagramContext);

  if (!context) {
    throw new Error('useDatabaseDiagramContext must be used within a DatabaseDiagramProvider');
  }
  return context;
};