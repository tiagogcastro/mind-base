import { useNodeAndEdgeStore } from '@/store/DatabaseDiagramStore';
import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';

export type DefaultEdgeProps = EdgeProps & {
  data?: {
    relationship?: 'one-to-one' | 'one-to-many' | 'many-to-many';
    edgeType?: 'smoothstep' | 'bezier';
  };
};

export function DefaultEdge(props: DefaultEdgeProps) {
  const { id, markerEnd, markerStart, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, selected, data } = props;
  const { updateEdge } = useNodeAndEdgeStore();

  const [edgePath, centerX, centerY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const getEdgeColor = () => {
    if (selected) return '#a855f7';
    return '#06b6d4';
  };

  const getStrokeWidth = () => {
    return selected ? 3 : 2;
  };

  const handleEdgeTypeToggle = () => {
    updateEdge(id, {
      type: 'default',
      label: data?.relationship
    });
  };

  return (
    <g>
      <BaseEdge
        id={`${id}-shadow`}
        path={edgePath}
        style={{
          stroke: '#000000',
          strokeWidth: getStrokeWidth() + 2,
          opacity: 0.3,
          strokeLinecap: 'round',
        }}
      />

      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: getEdgeColor(),
          strokeWidth: getStrokeWidth(),
          strokeLinecap: 'round',
          filter: 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.4))',
        }}
        markerEnd={markerEnd}
        markerStart={markerStart}
      />

      {data?.relationship && centerX && centerY && (
        <text
          x={centerX}
          y={centerY - 15}
          textAnchor="middle"
          fontSize={10}
          fill={getEdgeColor()}
          className="pointer-events-none select-none"
        >
          {data.relationship}
        </text>
      )}
    </g>
  );
}