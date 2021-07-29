import React from "react";
import {EventConfig} from '../trrackvis/src';
import {OrdinoEvents} from './TrrackFunctions'
import {} from '@fortawesome/fontawesome-free'

type AddTaskGlyphProps = {
  size?: number;
  fill?: string;
  scale?: number;
};


function translate(x: number, y: number) : string {
    return `translate(${x}, ${y})`
}

function CreateView({
  size = 15,
  fill = "#ccc",
}: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g transform={translate(-size / 2, -size / 2)}>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width={size}
          height={size}
          viewBox="0 0 120.522 138.944"
        >
          <polygon
            stroke="black"
            fill={fill}
            points="63.166,138.946 120.33,105.942 63.166,72.937 	"
          />
          <polygon
            stroke="black"
            fill={fill}
            points="59.164,72.937 2,105.942 59.164,138.944 	"
          />
          <polygon
            stroke="black"
            fill={fill}
            points="57.164,69.472 0,36.468 0,102.478 	"
          />
          <polygon
            stroke="black"
            fill={fill}
            points="59.164,0 2,33.003 59.164,66.007 	"
          />
          <polygon
            stroke="black"
            fill={fill}
            points="63.166,66.008 120.33,33.004 63.166,0 	"
          />
        </svg>
      </g>
    </g>
  );
}

function RemoveView({
  size = 15,
  fill = "#ccc",
}: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g>
        <text
          dominantBaseline="middle"
          fill={fill}
          fontFamily="FontAwesome"
          fontSize={size}
          textAnchor="middle"
        >
          &#xf61f;
        </text>
      </g>
    </g>
  );
}

function EditView({
  size = 15,
  fill = "#ccc",
}: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g>
        <text
          dominantBaseline="middle"
          fill={fill}
          fontFamily="FontAwesome"
          fontSize={size}
          textAnchor="middle"
        >
          &#xf61f;
        </text>
      </g>
    </g>
  );
}

function FocusView({
  size = 15,
  fill = "#ccc",
}: AddTaskGlyphProps) {
  return (
    <g>
      <circle fill="white" r={size - size / 4} />
      <g>
        <text
          dominantBaseline="middle"
          fill={fill}
          fontFamily="FontAwesome"
          fontSize={size}
          textAnchor="middle"
        >
          &#xf61f;
        </text>
      </g>
    </g>
  );
}


export const eventConfig: EventConfig<OrdinoEvents> = {
  "Create View": {
    backboneGlyph: <CreateView size={22} />,
    currentGlyph: <CreateView fill="#2185d0" size={22} />,
    regularGlyph: <CreateView size={16} />,
    bundleGlyph: <CreateView fill="#2185d0" size={22} />,
  },
  "Remove View": {
    backboneGlyph: <CreateView size={22} />,
    currentGlyph: <CreateView fill="#2185d0" size={22} />,
    regularGlyph: <CreateView size={16} />,
    bundleGlyph: <CreateView fill="#2185d0" size={22} />,
  },
  "Change View": {
    backboneGlyph: <CreateView size={22} />,
    currentGlyph: <CreateView fill="#2185d0" size={22} />,
    regularGlyph: <CreateView size={16} />,
    bundleGlyph: <CreateView fill="#2185d0" size={22} />,
  },
  "Change Focus View": {
    backboneGlyph: <CreateView size={22} />,
    currentGlyph: <CreateView fill="#2185d0" size={22} />,
    regularGlyph: <CreateView size={16} />,
    bundleGlyph: <CreateView fill="#2185d0" size={22} />,
  },
  "Select Focus": {
    backboneGlyph: <CreateView size={22} />,
    currentGlyph: <CreateView fill="#2185d0" size={22} />,
    regularGlyph: <CreateView size={16} />,
    bundleGlyph: <CreateView fill="#2185d0" size={22} />,
  },
  "Replace View": {
    backboneGlyph: <CreateView size={22} />,
    currentGlyph: <CreateView fill="#2185d0" size={22} />,
    regularGlyph: <CreateView size={16} />,
    bundleGlyph: <CreateView fill="#2185d0" size={22} />,
  },
};

