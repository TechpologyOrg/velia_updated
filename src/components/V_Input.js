import React, { useState } from "react";

export default function V_Input(props) {
  return (
    <div className="flex flex-col items-start w-full">
      <p className="pl-2">{props.title}</p>
      <input
        type="text"
        className="px-2 py-1 text-neutral-900 w-full rounded-full bg-white border-2"
        placeholder={props.placeholder}
        onChange={(e) => {
          props.setVal(e.target.value);
        }}
        onKeyDown={(e) => (props.keyDown ? props.keyDown(e) : "")}
      />
    </div>
  );
}
