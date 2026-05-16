'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Group, Line, Text } from 'react-konva';
import { useProjectStore } from '@/store/useProjectStore';
import { useUIStore } from '@/store/useUIStore';

export default function Planner2D() {
  const { vehicle, components, selectedComponentId, selectComponent, updateComponent } = useProjectStore();
  const { activeTool } = useUIStore();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const measure = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        if (offsetWidth > 0 && offsetHeight > 0) {
          setDimensions({ width: offsetWidth, height: offsetHeight });
        }
      }
    };

    // Use ResizeObserver for accurate, immediate container measurement
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    measure(); // also run immediately

    return () => observer.disconnect();
  }, []);

  // --- Guard: Don't render Konva Stage until container is measured ---
  const isReady = dimensions.width > 0 && dimensions.height > 0;

  // Scale pixels to mm (100px = 1000mm)
  const scale = 0.1;
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  // Van dimensions in px
  const vanWidthPx = vehicle.dimensions.width * scale;
  const vanLengthPx = vehicle.dimensions.length * scale;

  return (
    <div ref={containerRef} className="w-full h-full workspace-grid">
      {isReady && (
        <Stage width={dimensions.width} height={dimensions.height}>
          <Layer>
            <Group x={centerX} y={centerY}>
              {/* Van Shell (2D Outline) */}
              <Rect
                x={-vanLengthPx / 2}
                y={-vanWidthPx / 2}
                width={vanLengthPx}
                height={vanWidthPx}
                stroke="#000"
                strokeWidth={2}
                cornerRadius={20}
                fill="#fff"
                shadowBlur={10}
                shadowOpacity={0.05}
              />

              {/* Internal Ribbing/Structure */}
              <Line
                points={[-vanLengthPx / 2 + 80, -vanWidthPx / 2, -vanLengthPx / 2 + 80, vanWidthPx / 2]}
                stroke="#eee"
                strokeWidth={1}
              />
              
              {/* Components */}
              {components.map((comp) => (
                <Group
                  key={comp.id}
                  x={comp.position.x * scale}
                  y={comp.position.z * scale}
                  rotation={comp.rotation.y}
                  draggable={activeTool === 'move'}
                  onDragEnd={(e) => {
                    updateComponent(comp.id, {
                      position: {
                        ...comp.position,
                        x: e.target.x() / scale,
                        z: e.target.y() / scale
                      }
                    });
                  }}
                  onClick={() => selectComponent(comp.id)}
                >
                  <Rect
                    width={comp.dimensions.width * scale}
                    height={comp.dimensions.depth * scale}
                    offsetX={(comp.dimensions.width * scale) / 2}
                    offsetY={(comp.dimensions.depth * scale) / 2}
                    fill={selectedComponentId === comp.id ? 'rgba(59, 130, 246, 0.1)' : '#fff'}
                    stroke={selectedComponentId === comp.id ? '#3b82f6' : '#94a3b8'}
                    strokeWidth={selectedComponentId === comp.id ? 2 : 1}
                    cornerRadius={2}
                  />
                  <Text
                    text={comp.type.toUpperCase()}
                    fontSize={8}
                    fontStyle="bold"
                    fill={selectedComponentId === comp.id ? '#3b82f6' : '#94a3b8'}
                    align="center"
                    width={comp.dimensions.width * scale}
                    offsetX={(comp.dimensions.width * scale) / 2}
                    y={comp.dimensions.depth * scale / 2 + 5}
                  />
                </Group>
              ))}

              {/* Annotations */}
              <Text
                text={`${vehicle.model.toUpperCase()} - ${vehicle.variant}`}
                x={-vanLengthPx / 2}
                y={-vanWidthPx / 2 - 25}
                fontSize={10}
                fontStyle="bold"
                fill="#64748b"
              />
            </Group>
          </Layer>
        </Stage>
      )}
    </div>
  );
}
