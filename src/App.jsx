import React, { useState } from "react";
import * as math from "mathjs";
import Plot from "./components/Plot";
import Calculator from "./components/Calculator";
import MathKeyboard from "./components/MathKeyboard";

const GRID_SIZE = 60; // Increase for more detail, decrease for speed

export default function App() {
  const [expr, setExpr] = useState("sin(z)");
  const [plotType, setPlotType] = useState("2d"); // 2d, 3d-modulus, 3d-arg
  const [plotData, setPlotData] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [parseSuccess, setParseSuccess] = useState(true);
  const [showCalculator, setShowCalculator] = useState(false);

  // Debounce for input parsing
  React.useEffect(() => {
    const handler = setTimeout(() => {
      try {
        // Try to compile (not evaluate) the expression
        math.compile(expr);
        setParseError(null);
        setParseSuccess(true);
      } catch (e) {
        setParseError(e && e.message ? e.message : "Invalid expression.");
        setParseSuccess(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [expr]);

  // Generate grid for z in complex plane
  function generateGrid(size = GRID_SIZE, range = 2 * Math.PI) {
    const x = math.range(-range, range, (2 * range) / size, true).toArray();
    const y = math.range(-range, range, (2 * range) / size, true).toArray();
    const grid = [];
    for (let i = 0; i < x.length; i++) {
      for (let j = 0; j < y.length; j++) {
        grid.push({ 
          x: x[i], 
          y: y[j], 
          z: math.complex(x[i], y[j])
        });
      }
    }
    return { x, y, grid };
  }

  function plot() {
    try {
      const { x, y, grid } = generateGrid();
      const code = math.compile(expr);
      let Z = Array(y.length)
        .fill(0)
        .map(() => Array(x.length).fill(0));
      let outX = x, outY = y, outZ = Z;

      grid.forEach(({ x: xi, y: yi, z }, idx) => {
        const i = y.findIndex((yy) => yy === yi);
        const j = x.findIndex((xx) => xx === xi);
        let val;
        try {
          val = code.evaluate({ z });
        } catch {
          val = math.complex(NaN, NaN);
        }
        if (plotType === "2d") {
          // For 2D, we plot the real and imaginary parts as two heatmaps
          Z[i][j] = val;
        } else if (plotType === "3d-modulus") {
          Z[i][j] = math.abs(val);
        } else if (plotType === "3d-arg") {
          Z[i][j] = math.arg(val);
        }
      });

      setPlotData({
        x: outX,
        y: outY,
        z: Z
      });
    } catch (e) {
      setPlotData(null);
    }
  }

  // For initial render
  React.useEffect(() => {
    plot();
    // eslint-disable-next-line
  }, []);

  function handleKeyboardInput(str) {
    setExpr(expr + str);
  }

  function handleInputChange(e) {
    setExpr(e.target.value);
  }

  function handleParseCheck() {
    try {
      math.compile(expr);
      setParseError(null);
      setParseSuccess(true);
    } catch (e) {
      setParseError(e && e.message ? e.message : "Invalid expression.");
      setParseSuccess(false);
    }
  }

  function handlePlotClick() {
    handleParseCheck();
    if (parseSuccess) plot();
  }

  return (
    <div className="app-container">
      <h1>🧮 Complex Function Visualizer</h1>
      
      <div className="input-section">
        <label>
          <b>Enter function of <code>z</code>:</b>
          <input
            value={expr}
            onChange={handleInputChange}
            placeholder="e.g. sin(z), exp(z), z^2, 1/z"
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>
        <MathKeyboard onInput={handleKeyboardInput} />

        {/* Parse feedback */}
        <div style={{ minHeight: 22 }}>
          {parseSuccess && !parseError && (
            <span style={{ color: "#006400" }}>Expression parsed successfully ✔️</span>
          )}
          {!parseSuccess && parseError && (
            <span style={{ color: "red" }}>Parse error: {parseError}</span>
          )}
        </div>

        <label>
          <b>Graph type:</b>
          <select value={plotType} onChange={e => setPlotType(e.target.value)}>
            <option value="2d">2D Color: Real/Imag</option>
            <option value="3d-modulus">3D: |f(z)| (Modulus)</option>
            <option value="3d-arg">3D: arg(f(z)) (Argument)</option>
          </select>
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handlePlotClick}>Plot!</button>
          <button
            type="button"
            onClick={() => setShowCalculator((show) => !show)}
            style={{
              background: showCalculator ? "#f0f7fc" : "#0074d9",
              color: showCalculator ? "#0074d9" : "#fff",
              border: "1px solid #0074d9"
            }}
          >
            {showCalculator ? "Hide Calculator" : "Show Calculator"}
          </button>
        </div>
      </div>

      {/* Calculator is hidden unless toggled */}
      {showCalculator && <Calculator />}

      <div className="plot-container">
        <Plot expr={expr} plotType={plotType} plotData={plotData} />
      </div>
      <div style={{marginTop: 32, fontSize: '0.95rem', color: '#777'}}>
        Powered by <a href="https://mathjs.org/" target="_blank" rel="noreferrer">math.js</a> & <a href="https://plotly.com/javascript/" target="_blank" rel="noreferrer">Plotly.js</a>
      </div>
    </div>
  );
}
