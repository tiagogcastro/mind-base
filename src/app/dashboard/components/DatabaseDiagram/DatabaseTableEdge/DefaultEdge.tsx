import { BaseEdge, EdgeProps, getStraightPath } from '@xyflow/react';

export type DefaultEdgeProps = EdgeProps & {}

export function DefaultEdge(props: DefaultEdgeProps) {
  const { id, markerEnd, markerStart, label, sourceX, sourceY, targetX, targetY } = props;
  const [labelX, labelY] = getStraightPath(props);

  const centerY = (targetY - sourceY) / 2 + sourceY;

  const edgePath = `M ${sourceX} ${sourceY} L ${sourceX} ${centerY} L ${targetX} ${centerY} L ${targetX} ${targetY}`;

  return (
    <g>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: 'white',
          strokeWidth: 1,
          strokeDasharray: '0',
        }}
        markerEnd={markerEnd}
        markerStart={markerStart}
      />
    </g>
  );
}