import React from "react";
import Plotly from "plotly.js-basic-dist";

function Plot({ expr, plotType, plotData }) {
  const plotRef = React.useRef();

  React.useEffect(() => {
    if (!plotData) return;

    if (plotType === "2d") {
      // Compute real and imaginary parts
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
            visible: true,
            colorbar: { title: "Re(f(z))" }
          },
          {
            z: imagZ,
            x: plotData.x,
            y: plotData.y,
            type: "heatmap",
            colorscale: "Cividis",
            name: "Im(f(z))",
            visible: false,
            colorbar: { title: "Im(f(z))" }
          }
        ],
        {
          title: `2D Plot of f(z) = ${expr}`,
          xaxis: { title: "Re(z)" },
          yaxis: { title: "Im(z)" },
          updatemenus: [
            {
              type: "buttons",
              direction: "right",
              x: 0.5,
              y: 1.15,
              showactive: true,
              buttons: [
                {
                  label: "Real part",
                  method: "update",
                  args: [
                    { visible: [true, false] },
                    { "colorbar.title": "Re(f(z))" }
                  ]
                },
                {
                  label: "Imaginary part",
                  method: "update",
                  args: [
                    { visible: [false, true] },
                    { "colorbar.title": "Im(f(z))" }
                  ]
                }
              ]
            }
          ],
          height: 500
        },
        { responsive: true }
      );
    } else {
      // 3D plots remain unchanged
      Plotly.newPlot(
        plotRef.current,
        [
          {
            z: plotData.z,
            x: plotData.x,
            y: plotData.y,
            type: "surface",
            colorscale: plotType === "3d-modulus" ? "Viridis" : "Phase",
            colorbar: { title: plotType === "3d-modulus" ? "|f(z)|" : "arg(f(z))" }
          }
        ],
        {
          title:
            plotType === "3d-modulus"
              ? `3D Modulus |f(z)| of ${expr}`
              : `3D Argument arg(f(z)) of ${expr}`,
          scene: {
            xaxis: { title: "Re(z)" },
            yaxis: { title: "Im(z)" },
            zaxis: { title: plotType === "3d-modulus" ? "|f(z)|" : "arg(f(z))" }
          },
          height: 500
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
