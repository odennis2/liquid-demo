import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import "./Matter.css";

const MatterScene = () => {
  const sceneRef = useRef(null);
  const staticCanvasRef = useRef(null);
  const particlesCanvasRef = useRef(null);

  useEffect(() => {
    const {
      Engine,
      Render,
      Runner,
      Bodies,
      MouseConstraint,
      Mouse,
      Composite,
      World,
    } = Matter;

    var engine = Engine.create();
    const staticRender = Render.create({
      element: sceneRef.current,
      engine: engine,
      canvas: staticCanvasRef.current,
      options: {
        width: window.screen.width,
        height: window.screen.height,
        wireframes: false,
        background: "#000",
      },
    });

    const particlesRender = Render.create({
      element: sceneRef.current,
      engine: engine,
      canvas: particlesCanvasRef.current,
      options: {
        width: window.screen.width,
        height: window.screen.height,
        wireframes: false,
        background: "transparent",
      },
    });

    // SVG Filter for Goo Effect
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filter = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter"
    );
    filter.setAttribute("id", "gooey-filter");

    const gaussianBlur = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feGaussianBlur"
    );
    gaussianBlur.setAttribute("in", "SourceGraphic");
    gaussianBlur.setAttribute("stdDeviation", "8"); // Deviation for blur

    const colorMatrix = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feColorMatrix"
    );
    colorMatrix.setAttribute("in", "blur");
    colorMatrix.setAttribute("mode", "matrix");
    colorMatrix.setAttribute(
      "values",
      "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
    );

    filter.appendChild(gaussianBlur);
    filter.appendChild(colorMatrix);
    defs.appendChild(filter);
    svg.appendChild(defs);
    document.body.appendChild(svg);

    particlesCanvasRef.current.style.filter = "url(#gooey-filter)";

    
    // Bodies declarations
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const reducedWidth = window.innerWidth * 0.9;
    const reducedHeight = window.innerHeight * 0.9;
    
    var ground = Bodies.rectangle(screenWidth / 2, screenHeight - (0.1 * screenHeight), reducedWidth, 20, { isStatic: true });
    var leftWall = Bodies.rectangle(0.1 * screenWidth, screenHeight / 2, 20, reducedHeight, { isStatic: true });
    var rightWall = Bodies.rectangle(screenWidth - (0.1 * screenWidth), screenHeight / 2, 20, reducedHeight, { isStatic: true });

    var circles = [];

    for (let i = 0; i < 2500; i++) {
      let x = (Math.random() + 0.15) * 1500;
      let y = Math.random() * 400;
      let yPercentage = y / 10;
      let color = `hsl(${210 + yPercentage}, 100%, 60%)`;

      circles.push(
        Bodies.circle(x, y, 8, {
          restitution: 0, // Bounce value
          friction: 0, // Low friction for sliding
          frictionAir: 0.02, // Low air friction
          label: "balls",
          render: {
            strokeStyle: "blue",
            fillStyle: color,
          },
        })
      );
    }

    // Big object to interact with
    var bigBall = Bodies.circle(800, 50, 20, {
      restitution: 0.5,
      friction: 0,
      frictionAir: 0,
      render: {
        strokeStyle: "red",
        lineWidth: 0,
      },
    });

    // Add mouse control
    var mouse = Mouse.create(particlesRender.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    // Add all bodies
    World.add(engine.world, [
      ...circles,
      ground,
      leftWall,
      rightWall,
      bigBall,
      mouseConstraint
    ]);

    // Run the renders
    Render.run(staticRender);
    Render.run(particlesRender);
    var runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      Render.stop(staticRender);
      Render.run(particlesRender);
      Composite.clear(engine.world);
      Engine.clear(engine);
      staticRender.canvas.remove();
      particlesRender.canvas.remove();
      staticRender.textures = {};
      particlesRender.textures = {};
      document.body.removeChild(svg);
    };
  }, []);

  return (
    <div ref={sceneRef} style={{ position: "relative", width: "1500px", height: "800px" }}>
      <canvas ref={staticCanvasRef} style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }} />
      <canvas ref={particlesCanvasRef} style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }} />
    </div>
  );
};

export default MatterScene;
