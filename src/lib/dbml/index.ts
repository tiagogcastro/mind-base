import { Parser } from '@dbml/core';
import { nanoid } from 'nanoid';

export interface FieldType {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isUnique: boolean;
};

export interface TableNode {
  id: string;
  type: 'db';
  position: {
    x: number;
    y: number;
  };
  data: {
    tableName: string;
    fields: FieldType[];
  };
};

export interface TableEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  type: 'default';
  label?: string;
};

export interface NodesAndEdges {
  nodes: TableNode[];
  edges: TableEdge[];
};

export function convertDbmlToNodesAndEdges(dbmlText: string): NodesAndEdges {
  const parser = new Parser();
  const parsed = parser.parse(dbmlText, 'dbml');

  const tables = parsed.schemas?.[0]?.tables || [];

  const nodesAndEdges: NodesAndEdges = {
    nodes: [],
    edges: [],
  };

  const tableIdMap = new Map<string, string>();
  const addedEdges = new Set<string>();

  tables.forEach((table: any, index: number) => {
    const tableId: string = table.name;
    tableIdMap.set(table.name, table.name);

    const fields: FieldType[] = Array.isArray(table.fields)
      ? table.fields.map((field: any): FieldType => ({
        id: nanoid(6),
        name: field.name,
        type: field.type?.type_name || 'varchar',
        isPrimaryKey: !!field.pk,
        isForeignKey: false,
        isUnique: !!field.unique,
      }))
      : [];

    nodesAndEdges.nodes.push({
      id: tableId,
      type: 'db',
      position: {
        x: (index % 3) * 400,
        y: Math.floor(index / 3) * 250,
      },
      data: {
        tableName: table.name,
        fields,
      },
    });
  });

  const globalRefs = parsed.schemas?.[0]?.refs || [];

  globalRefs.forEach((ref: any) => {
    const endpoint1 = ref.endpoints[0];
    const endpoint2 = ref.endpoints[1];

    let sourceEndpoint: any;
    let targetEndpoint: any;

    if (endpoint1.relation === '*' && endpoint2.relation === '1') {
      sourceEndpoint = endpoint1;
      targetEndpoint = endpoint2;
    } else if (endpoint2.relation === '*' && endpoint1.relation === '1') {
      sourceEndpoint = endpoint2;
      targetEndpoint = endpoint1;
    } else {
      console.warn('Referência com cardinalidade inesperada ou não tratada para FK-PK:', ref);
      return;
    }

    const sourceTable = sourceEndpoint.tableName;
    const sourceColumn = sourceEndpoint.fieldNames[0];
    const targetTable = targetEndpoint.tableName;
    const targetColumn = targetEndpoint.fieldNames[0];

    const sourceNodeId = tableIdMap.get(sourceTable);
    const targetNodeId = tableIdMap.get(targetTable);

    if (sourceNodeId && targetNodeId) {
      const edgeKey = `${sourceNodeId}-${sourceColumn}->${targetNodeId}-${targetColumn}`;

      if (!addedEdges.has(edgeKey)) {
        addedEdges.add(edgeKey);

        nodesAndEdges.edges.push({
          id: nanoid(6),
          source: sourceNodeId,
          target: targetNodeId,
          sourceHandle: `${sourceNodeId}-${sourceColumn}`,
          targetHandle: `${targetNodeId}-${targetColumn}`,
          type: 'default',
          label: `${sourceColumn} -> ${targetColumn}`,
        });

        const sourceNode = nodesAndEdges.nodes.find(n => n.id === sourceNodeId);
        if (sourceNode) {
          const fieldToMark = sourceNode.data.fields.find(f => f.name === sourceColumn);
          if (fieldToMark) {
            fieldToMark.isForeignKey = true;
          }
        }
      }
    }
  });

  return nodesAndEdges;
}