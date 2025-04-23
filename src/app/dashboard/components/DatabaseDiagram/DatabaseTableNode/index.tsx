'use client';

import { DatabaseTableNodeDataField } from '@/contexts/DatabaseDiagramContext';
import { Handle, Position } from '@xyflow/react';

export type DatabaseTableNodeProps = {
  data: {
    tableName: string;
    fields: DatabaseTableNodeDataField[];
  };
}

export function DatabaseTableNode({
  data
}: DatabaseTableNodeProps) {
  return (
    <div className="rounded-xl shadow-md bg-gray-800 border border-gray-700 min-w-[200px]">
      <div className="bg-gray-700 px-4 py-2 rounded-t-xl font-semibold text-sm dark:text-white">
        {data.tableName}
      </div>

      <div className="px-4 py-2 text-sm text-gray-200 space-y-1">
        {data.fields.map((field, index) => (
          <div key={`${field.name}+${index}`} className="flex items-center gap-1">
            <span className="truncate">
              {field.name}
            </span>

            <span className="italic">
              ({field.type})
            </span>

            <span className="font-bold">
              {field.isPrimaryKey ? 'PK' : ''}
              {field.isForeignKey ? 'FK' : ''}
              {field.isUnique ? 'UQ' : ''}
            </span>
          </div>
        ))}
      </div>

      <Handle
        id="top"
        type="source"
        position={Position.Top}
        style={{
          top: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fff',
          width: 10,
          height: 10,
        }}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        style={{
          bottom: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fff',
          width: 10,
          height: 10,
        }}
      />
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        style={{
          left: -10,
          transform: 'translateX(-50%)',
          background: '#fff',
          width: 10,
          height: 10,
        }}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        style={{
          right: -10,
          transform: 'translateX(50%)',
          background: '#fff',
          width: 10,
          height: 10,
        }}
      />
    </div>
  );
}
