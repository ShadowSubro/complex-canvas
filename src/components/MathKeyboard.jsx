import React from "react";

const BUTTONS = [
  "sin(", "cos(", "tan(", "exp(", "log(", 
  "abs(", "arg(", "sqrt(", "π", "e", 
  "Re(", "Im(", "^", "i", "z", "(", ")", "+", "-", "*", "/", ","
];

export default function MathKeyboard({ onInput }) {
  return (
    <div className="math-keyboard">
      {BUTTONS.map((btn, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onInput(btn)}
          title={btn}
        >
          {btn}
        </button>
      ))}
    </div>
  );
}