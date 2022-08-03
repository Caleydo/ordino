/* eslint-disable import/no-cycle */

import { BaseArtifactType } from '@trrack/core';
import React, { useState, useMemo } from 'react';
import { defaultIcon } from '../Utils/IconConfig';
import { ProvVisConfig } from './ProvVis';
import { StratifiedMap } from './useComputeNodePosition';

export function IconLegend<T, S extends string, A extends BaseArtifactType<any>>({
  colorMap,
  nodes,
  config,
}: {
  colorMap: Record<S | 'Root', string>;
  nodes: StratifiedMap<T, S, A>;
  config: ProvVisConfig<T, S, A>;
}) {
  const legendCategories = useMemo(() => {
    const categoryList: (S | 'Root')[] = [];

    Object.values(nodes).forEach((node) => {
      if (!categoryList.includes(node.data.meta.eventType)) {
        categoryList.push(node.data.meta.eventType);
      }
    });

    return categoryList;
  }, [nodes]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {legendCategories.map((cat) => {
        return (
          <div key={cat} style={{ display: 'flex' }}>
            <svg height="20px" width="20px">
              <g transform="translate(10, 10)">
                {config.iconConfig?.[cat] && config.iconConfig[cat].glyph ? config.iconConfig?.[cat]?.glyph?.() : defaultIcon(colorMap[cat]).glyph()}
              </g>
            </svg>
            <p style={{ margin: 0 }}>{cat}</p>
          </div>
        );
      })}
    </div>
  );
}
