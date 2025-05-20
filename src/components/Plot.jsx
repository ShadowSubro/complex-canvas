import React from "react";
import Plotly from "plotly.js-basic-dist";

function Plot({ expr, plotType, plotData }) {
  const plotRef = React.useRef();

  React.useEffect(() => {
    if (!plotData) return;
    if (plotType === "2d") {
      // 2D: Show real and imaginary parts as two heatmaps
      const realZ = plotData.z.map((row) => row.map((v) => v.re));
      const imagZ = plotData.z.map((row) => row.map((v) => v.im));
      Plotly.newPlot(
        plotRef.current,
        [
          {
            z: realZ,
            x: plotData.x,
            y: plotData.y,
            type: "heatmap",
            colorscale: "Viridis",
            name: "Re(f(z))",
            colorbar: { title: "Re(f(z))" },
          },
          {
            z: imagZ,
            x: plotData.x,
            y: plotData.y,
            type: "heatmap",
            colorscale: "Cividis",
            name: "Im(f(z))",
            colorbar: { title: "Im(f(z))" },
            visible: "legendonly",
          },
        ],
        {
          title: `2D Plot of f(z) = ${expr}`,
          xaxis: { title: "Re(z)" },
          yaxis: { title: "Im(z)" },
          legend: { x: 1.1, y: 0.5 },
          height: 500,
        },
        { responsive: true }
      );
    } else {
      // 3D: Plot modulus or argument
      Plotly.newPlot(
        plotRef.current,
        [
          {
            z: plotData.z,
            x: plotData.x,
            y: plotData.y,
            type: "surface",
            colorscale: plotType === "3d-modulus" ? "Viridis" : "Phase",
            colorbar: { title: plotType === "3d-modulus" ? "|f(z)|" : "arg(f(z))" },
          },
        ],
        {
          title:
            plotType === "3d-modulus"
              ? `3D Modulus |f(z)| of ${expr}`
              : `3D Argument arg(f(z)) of ${expr}`,
          scene: {
            xaxis: { title: "Re(z)" },
            yaxis: { title: "Im(z)" },
            zaxis: { title: plotType === "3d-modulus" ? "|f(z)|" : "arg(f(z))" },
          },
          height: 500,
        },
        { responsive: true }
      );
    }
  }, [expr, plotType, plotData]);

  return (
    <div>
      <div ref={plotRef} />
    </div>
  );
}

export default Plot;