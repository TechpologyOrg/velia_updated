import * as React from "react";

const SvgComponent = ({ size = 180, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 180 180"          // <-- crucial: matches your art’s coordinates
    preserveAspectRatio="xMidYMid meet"
    width={size}
    height={size}
    {...props}
  >
    <path
      fill="#058EFF"
      d="M.394 121.215c32.985 0 73.878 39.19 90.202 58.785v-66.855C73.687 83.258 23.416 65.262.394 60c-.297 20.405-.714 61.215 0 61.215ZM179.605 58.785c-32.984 0-73.877-39.19-90.201-58.785v66.855c16.909 29.887 67.18 47.883 90.201 53.145.298-20.405.715-61.215 0-61.215Z"
    />
  </svg>
);

export default SvgComponent;