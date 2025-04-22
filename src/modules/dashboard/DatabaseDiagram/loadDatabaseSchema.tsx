import { Edge, Node, XYPosition } from '@xyflow/react';

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

export async function loadDatabaseSchema(): Promise<DatabaseSchema> {
  return {
    nodes: [
      {
        id: '1',
        type: 'db',
        position: { x: 0, y: 100 },
        data: {
          tableName: 'Users',
          fields: [{
            id: '1',
            name: 'id',
            type: 'int',
            isPrimaryKey: true,
          },
          {
            id: '2',
            name: 'name',
            type: 'string',
          },
          {
            id: '3',
            name: 'email',
            type: 'string',
            isUnique: true,
          },
          {
            id: '4',
            name: 'created_at',
            type: 'timestamp',
          }],
        },
      },
      {
        id: '2',
        type: 'db',
        position: { x: -150, y: 300 },
        data: {
          tableName: 'Posts',
          fields: [
            {
              id: '1',
              name: 'id',
              type: 'int',
              isPrimaryKey: true,
            },
            {
              id: '2',
              name: 'user_id',
              type: 'int',
              isForeignKey: true,
            },
            {
              id: '3',
              name: 'title',
              type: 'string',
            },
            {
              id: '4',
              name: 'content',
              type: 'text',
            },
            {
              id: '5',
              name: 'created_at',
              type: 'timestamp',
            }],
        },
      },
      {
        id: '3',
        type: 'db',
        position: { x: 150, y: 300 },
        data: {
          tableName: 'Comments',
          fields: [
            {
              id: '1',
              name: 'id',
              type: 'int',
              isPrimaryKey: true,
            },
            {
              id: '2',
              name: 'post_id',
              type: 'int',
              isForeignKey: true,
            },
            {
              id: '3',
              name: 'user_id',
              type: 'int',
              isForeignKey: true,
            },
            {
              id: '4',
              name: 'content',
              type: 'text',
            },
            {
              id: '5',
              name: 'created_at',
              type: 'timestamp',
            }],
        },
      },
    ],
    edges: [],
  };
}
