export default function Introduction() {
  return (
    <div className="flex flex-col items-center place-content-center">
      <article className="px-4 py-8 font-serif max-w-4xl">
        <h1 className="text-2xl text-center font-bold py-4">INTRODUCTION</h1>
        <p className="py-4">
          This is a simple web application for Material Point Method (MPM) simulation. The whole
          project is created by{" "}
          <a href="https://vitejs.dev/" target="_blank" className="text-blue-600 hover:underline">
            vite
          </a>{" "}
          and used{" "}
          <a href="https://react.dev/" target="_blank" className="text-blue-600 hover:underline">
            react
          </a>{" "}
          for components construction, while the web page layout and styling are done by{" "}
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            tailwindcss
          </a>
          . The simulation is generated by{" "}
          <a
            href="https://github.com/AmesingFlank/taichi.js/tree/master/"
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            taichi.js
          </a>{" "}
          which wraps the WebGPU API, you can{" "}
          <a
            href="https://caniuse.com/?search=webgpu"
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            check your browser
          </a>{" "}
          if it support WebGPU for running simulation.{" "}
        </p>
        <p className="py-4">
          You can <span className="font-bold">reset</span>,{" "}
          <span className="font-bold">play-pause</span>, and{" "}
          <span className="font-bold">step forward</span> via the top control bar. Further more, the
          keyboard shortcut for these buttons are <span className="italic">r</span>,{" "}
          <span className="italic">space</span>, and <span className="italic">right arrow</span>{" "}
          respectively.
        </p>
        <p className="py-4">
          There are three panels, <span className="font-bold">STATS</span>,{" "}
          <span className="font-bold">CONTROLS</span>, and{" "}
          <span className="font-bold">PARAMETERS</span>, listing the information about the
          simulation.
        </p>
        <p className="py-4">
          The <span className="font-bold">STATS</span> panel shows the frame per second and the
          number of particles of each scenes. You can keep track of these information to undersand
          the performance of the real-time 2D MPM simulation on your device.
        </p>
        <p className="py-4">
          The <span className="font-bold">CONTROLS</span> panel contains three selectors, the Scenes
          which include several constitutive model implementation for different material and their
          coupling interaction, the Particle Volume which control the number of particles, and the
          Grid Resolution of background grid. The simulation will be re-generated after you select a
          new option, i.e. the code will be re-compiled and run.
        </p>
        <p className="py-4">
          The <span className="font-bold">PARAMETERS</span> panel contains three sliders. It is
          runtime chageable and will not terminate the simulation if you slide it. For more detail,
          the Substeps is the simulation step per frame, i.e. it will run a certain number of
          simulation steps and render a frame. The Young's Modulus is one of the material properties
          to control the material stiffness, you can get more information in{" "}
          <a
            href="https://caniuse.com/?search=webgpu"
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            wikipedia
          </a>
          . And the Particle Size is the rendered particle size.
        </p>
        <p className="py-4">Have fun!</p>
      </article>
    </div>
  );
}
