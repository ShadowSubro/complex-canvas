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
  const [err, setErr] = useState(null);

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
    setErr(null);
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
      setErr(
        "Error parsing expression. Try functions like sin(z), exp(z), z^2, 1/z, etc."
      );
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

  return (
    <div className="app-container">
      <h1>🧮 Complex Function Visualizer</h1>
      
      <div className="input-section">
        <label>
          <b>Enter function of <code>z</code>:</b>
          <input
            value={expr}
            onChange={e => setExpr(e.target.value)}
            placeholder="e.g. sin(z), exp(z), z^2, 1/z"
            style={{ width: "100%", marginTop: 4 }}
          />
        </label>
        <MathKeyboard onInput={handleKeyboardInput} />

        <label>
          <b>Graph type:</b>
          <select value={plotType} onChange={e => setPlotType(e.target.value)}>
            <option value="2d">2D Color: Real/Imag</option>
            <option value="3d-modulus">3D: |f(z)| (Modulus)</option>
            <option value="3d-arg">3D: arg(f(z)) (Argument)</option>
          </select>
        </label>
        <button onClick={plot}>Plot!</button>
        {err && <div style={{ color: "red" }}>{err}</div>}
      </div>

      <Calculator />

      <div className="plot-container">
        <Plot expr={expr} plotType={plotType} plotData={plotData} />
      </div>
      <div style={{marginTop: 32, fontSize: '0.95rem', color: '#777'}}>
        Powered by <a href="https://mathjs.org/" target="_blank" rel="noreferrer">math.js</a> & <a href="https://plotly.com/javascript/" target="_blank" rel="noreferrer">Plotly.js</a>
      </div>
    </div>
  );
}