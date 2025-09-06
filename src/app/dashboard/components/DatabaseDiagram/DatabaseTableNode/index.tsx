'use client';
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

  return (
    <div className="rounded-xl shadow-md bg-gray-800 border border-gray-700 min-w-[200px]">
      <div className="bg-gray-700 px-4 py-2 rounded-t-xl font-semibold text-sm dark:text-white">
        {data.tableName}
      </div>

      <div className="px-4 py-2 text-sm text-gray-200 space-y-1">
        {data.fields.map((field) => {
          const handleId = `${data.tableName}-${field.name}`;

          return (
            <div key={field.id} className="flex items-center gap-1 relative py-1">
              <Handle
                type="source"
                position={Position.Left}
                id={handleId}
                isConnectable={true}
                className="!w-2 !h-2 rounded-full absolute !-left-[18px] top-1/2 transform -translate-y-1/2 cursor-grab z-10"
              />

              <div className="flex gap-1">
                <div className="flex gap-0.5">
                  <span className="truncate flex-1">
                    {field.name}
                  </span>

                  <span className="italic">
                    ({field.type})
                  </span>
                </div>

                <span className="font-bold">
                  {field.isPrimaryKey ? 'PK' : ''}
                  {field.isForeignKey ? 'FK' : ''}
                  {field.isUnique ? 'UQ' : ''}
                </span>
              </div>

              <Handle
                type="target"
                position={Position.Right}
                id={handleId}
                isConnectable={true}
                className="!w-2 !h-2 rounded-full absolute !-right-[18px] top-1/2 transform -translate-y-1/2 cursor-grab z-10"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}