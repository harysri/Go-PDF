import { useMemo } from "react";

const InkGridPulse = ({ nodeCount = 8 }) => {
  const nodes = useMemo(
    () =>
      Array.from({ length: nodeCount }, (_, id) => ({
        id,
        left: `${(Math.floor(Math.random() * 20) + 2) * 5}%`,
        top: `${(Math.floor(Math.random() * 12) + 2) * 7}%`,
        delay: `${Math.random() * 6}s`,
      })),
    [nodeCount],
  );

  return (
    <div className="ink-grid-pulse" aria-hidden="true">
      {nodes.map((node) => (
        <span
          key={node.id}
          className="grid-node"
          style={{
            left: node.left,
            top: node.top,
            animationDelay: node.delay,
          }}
        />
      ))}
    </div>
  );
};

export default InkGridPulse;
