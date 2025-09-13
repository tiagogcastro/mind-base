'use client'
import { DefaultEdge } from '@/app/dashboard/components/DatabaseDiagram/DatabaseTableEdge/DefaultEdge';
import { DatabaseTableNode } from '@/app/dashboard/components/DatabaseDiagram/DatabaseTableNode';
import { UseZustantDisclosureGlobal } from '@/hooks/useDisclosure';
import { applyEdgeChanges, applyNodeChanges, Connection, Edge, Node } from '@xyflow/react';
import { create } from 'zustand';

export type DatabaseTableNodeDataField = {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isUnique: boolean;
}

export type DatabaseTableNodeData = {
  tableName: string;
  fields: DatabaseTableNodeDataField[];
};

export type DatabaseTableNodeType = Node<DatabaseTableNodeData> & {
  id: string;
  type: 'db';
  position: {
    x: number;
    y: number;
  };
  data: {
    tableName: string;
    fields: DatabaseTableNodeDataField[];
  };
};

export type DatabaseEdgeType = {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  type: 'default';
  label?: string;
};

export type DatabaseSchema = {
  nodes: DatabaseTableNodeType[];
  edges: DatabaseEdgeType[];
};

const nodeTypes = {
  db: DatabaseTableNode,
};

const edgeTypes = {
  default: DefaultEdge,
};

type DatabaseSchemaState = {
  schema: DatabaseSchema | null;
  setDatabaseSchema: (schema: DatabaseSchema | null) => void;

  edgeTypes: { default: typeof DefaultEdge };
  nodeTypes: { db: typeof DatabaseTableNode };

  currentNodeSelected: DatabaseTableNodeType | null;
  onNodeClick: (e: React.MouseEvent, node: DatabaseTableNodeType) => void;

  onEdgeClick: ((event: React.MouseEvent<Element, MouseEvent>, edge: DatabaseEdgeType) => void) | undefined;
  onNodesChange: (changes: any[]) => void;
  onEdgesChange: (changes: any[]) => void;
  onConnectEdge: (params: Edge | Connection) => void;
  onReconnect: (oldEdge: Edge, newConnection: Connection) => void;
  onReconnectStart: () => void;
  onReconnectEnd: () => void;
  updateEdge: (edgeId: string, data: Partial<DatabaseEdgeType>) => void;

  updateCurrentNode: (patch: { tableName?: string; fields?: any[] }) => void;
  deleteFieldFromCurrentNode: (fieldId: string) => void;
  deleteNodeById: (nodeId: string) => void;
};

export const useNodeAndEdgeStore = create<DatabaseSchemaState>((set, get) => ({
  schema: { nodes: [], edges: [] },
  setDatabaseSchema: (schema) => set({ schema }),

  edgeTypes,
  nodeTypes,

  currentNodeSelected: null,

  onNodeClick: (event, node) => {
    event.preventDefault();
    set({ currentNodeSelected: node });
    const isOpenViewNodeDrawer = useViewNodeDrawerStore.getState();
    isOpenViewNodeDrawer.onOpen();
  },

  onEdgeClick: () => { },

  onNodesChange: (changes) => {
    set((state) => {
      const prev = state.schema ?? { nodes: [], edges: [] };
      return { schema: { ...prev, nodes: applyNodeChanges(changes, prev.nodes) } };
    });
  },

  onEdgesChange: (changes) => {
    set((state) => {
      const prev = state.schema ?? { nodes: [], edges: [] };
      return { schema: { ...prev, edges: applyEdgeChanges(changes, prev.edges) } };
    });
  },

  onConnectEdge: (params) => {
    const newEdge: DatabaseEdgeType = {
      ...(params as any),
      id: crypto.randomUUID(),
      type: 'default',
    };

    set((state) => {
      const prev = state.schema ?? { nodes: [], edges: [] };
      const prevEdges = prev.edges ?? [];

      if (newEdge.source === newEdge.target) {
        alert('Não é possível criar uma ligação para o mesmo nó');
        return {};
      }

      const exists = prevEdges.some(
        (edge) =>
          (edge.source === newEdge.source && edge.target === newEdge.target) ||
          (edge.target === newEdge.target && edge.source === newEdge.source) ||
          (edge.source === newEdge.target && edge.target === newEdge.source)
      );
      if (exists) return {};

      const nextEdges = [...prevEdges, newEdge];
      return { schema: { ...prev, edges: nextEdges } };
    });
  },

  onReconnect: (oldEdge, newConnection) => {
    set((state) => {
      if (!state.schema) return state;

      const edges = state.schema.edges.map((edge) => {
        if (edge.id === oldEdge.id) {
          return {
            ...edge,
            source: newConnection.source!,
            target: newConnection.target!,
            sourceHandle: newConnection.sourceHandle!,
            targetHandle: newConnection.targetHandle!,
          };
        }
        return edge;
      });

      return {
        schema: {
          ...state.schema,
          edges
        }
      };
    });
  },

  onReconnectStart: () => {
    console.log('Reconnect started');
  },

  onReconnectEnd: () => {
    console.log('Reconnect ended');
  },

  updateEdge: (edgeId, data) => {
    set((state) => {
      if (!state.schema) return state;

      const edges = state.schema.edges.map((edge) => {
        if (edge.id === edgeId) {
          return { ...edge, ...data };
        }
        return edge;
      });

      return {
        schema: {
          ...state.schema,
          edges
        }
      };
    });
  },

  updateCurrentNode: (patch) => {
    set((state) => {
      const prev = state.schema ?? { nodes: [], edges: [] };
      const current = state.currentNodeSelected;
      if (!current) return {};

      const updatedNodes = prev.nodes.map((n) => {
        if (n.id !== current.id) return n;
        const newData = {
          ...n.data,
          ...(patch.tableName !== undefined ? { tableName: patch.tableName } : {}),
          ...(patch.fields !== undefined ? { fields: patch.fields } : {}),
        };

        return { ...n, data: newData };
      });

      const updatedCurrent = updatedNodes.find((n) => n.id === current.id) ?? null;

      return { schema: { ...prev, nodes: updatedNodes }, currentNodeSelected: updatedCurrent };
    });
  },

  deleteFieldFromCurrentNode: (fieldId: string) => {
    const { currentNodeSelected } = get();
    if (!currentNodeSelected) return;

    const nextFields = (currentNodeSelected.data.fields ?? []).filter((f: any) => f.id !== fieldId);
    get().updateCurrentNode({ fields: nextFields });
  },

  deleteNodeById: (nodeId: string) => {
    set((state) => {
      const prev = state.schema ?? { nodes: [], edges: [] };
      const nextNodes = prev.nodes.filter((n) => n.id !== nodeId);
      const nextEdges = prev.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);

      const nextSelected =
        state.currentNodeSelected && state.currentNodeSelected.id === nodeId
          ? null
          : state.currentNodeSelected;

      return {
        schema: { ...prev, nodes: nextNodes, edges: nextEdges },
        currentNodeSelected: nextSelected,
      };
    });
  },
}));

export const useViewNodeDrawerStore = create<UseZustantDisclosureGlobal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onToggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));