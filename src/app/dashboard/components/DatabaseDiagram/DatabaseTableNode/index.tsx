'use client';
import { cn } from '@/lib/utils';
import { DatabaseTableNodeDataField } from '@/store/DatabaseDiagramStore';
import { Handle, Position } from '@xyflow/react';

export type DatabaseTableNodeProps = {
  id: string;
  data: {
    tableName: string;
    fields: DatabaseTableNodeDataField[];
  };
};

export function DatabaseTableNode({
  data
}: DatabaseTableNodeProps) {
  const getFieldIconColor = (field: DatabaseTableNodeDataField) => {
    if (field.isPrimaryKey) return 'bg-purple-500';
    if (field.isForeignKey) return 'bg-cyan-500';
    if (field.isUnique) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  const getHandleColor = (field: DatabaseTableNodeDataField) => {
    if (field.isPrimaryKey) return '!bg-purple-500 border-purple-400';
    if (field.isForeignKey) return '!bg-cyan-500 border-cyan-400';
    if (field.isUnique) return '!bg-orange-500 border-orange-400';
    return '!bg-blue-500 border-blue-400';
  };

  return (
    <div className="rounded-xl shadow-lg bg-gray-800 border-2 border-gray-600 min-w-[280px] overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 font-bold text-white">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white/30"></div>
          <span className="text-lg">{data.tableName}</span>
        </div>
      </div>

      <div className="px-0 py-2 text-sm space-y-0">
        {data.fields.map((field, index) => {
          const handleId = `${data.tableName}-${field.name}`;

          return (
            <div
              key={field.id}
              className={cn(`flex items-center relative py-3 px-4 hover:bg-gray-700 transition-colors`,
                {
                  'border-b border-gray-700': index !== data.fields.length - 1
                }
              )}
            >
              <Handle
                type="source"
                position={Position.Left}
                id={handleId}
                isConnectable={true}
                className={`!w-3 !h-3 !border-2 rounded-full absolute !-left-[6px] top-1/2 !transform -translate-y-1/2 cursor-grab z-10 ${getHandleColor(field)}`}
              />

              <div className="flex items-center gap-3 w-full">
                {/* <div className={`w-2 h-2 rounded-full ${getFieldIconColor(field)} flex-shrink-0`}></div> */}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-100 truncate">
                      {field.name}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {field.type}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  {field.isPrimaryKey && (
                    <span className="bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                      PK
                    </span>
                  )}
                  {field.isForeignKey && (
                    <span className="bg-cyan-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                      FK
                    </span>
                  )}
                  {field.isUnique && (
                    <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                      UQ
                    </span>
                  )}
                </div>
              </div>

              <Handle
                type="target"
                position={Position.Right}
                id={handleId}
                isConnectable={true}
                className={`!w-3 !h-3 !border-2 rounded-full absolute !-right-[6px] top-1/2 !transform -translate-y-1/2 cursor-grab z-10 ${getHandleColor(field)}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}