import { BaseEdge, EdgeProps, getSmoothStepPath } from '@xyflow/react';

export type DefaultEdgeProps = EdgeProps & {};

export function DefaultEdge(props: DefaultEdgeProps) {
  const { id, markerEnd, markerStart, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props;

  const offset = 25;

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    offset: offset,
  });

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