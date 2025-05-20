import React, { useState } from "react";
import * as math from "mathjs";
import MathKeyboard from "./MathKeyboard";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [err, setErr] = useState(null);

  function evaluate() {
    setErr(null);
    try {
      // Evaluate the expression using math.js
      const val = math.evaluate(input);
      setOutput(val && val.toString());
    } catch (e) {
      setErr("Invalid expression!");
      setOutput("");
    }
  }

  function handleKeyboardInput(str) {
    setInput(input + str);
  }

  return (
    <div className="calculator">
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Calculator</div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type an expression, e.g. sqrt(3+4i)"
        style={{ width: "100%" }}
      />
      <MathKeyboard onInput={handleKeyboardInput} />
      <button onClick={evaluate}>Calculate</button>
      {output && (
        <div style={{ marginTop: 8, color: "#006400" }}>
          <b>Result:</b> {output}
        </div>
      )}
      {err && (
        <div style={{ marginTop: 8, color: "red" }}>
          <b>{err}</b>
        </div>
      )}
    </div>
  );
}