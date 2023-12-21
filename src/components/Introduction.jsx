export default function Introduction() {
  return (
    <div className="flex flex-col items-center place-content-center">
      <article className="px-4 py-8 font-serif max-w-4xl">
        <h1 className="text-2xl text-center font-bold py-4">INTRODUCTION</h1>
        <p className="py-4">
          This is a simple web application for Material Point Method (MPM) simulation. The whole
          project was created by{" "}
          <a href="https://vitejs.dev/" target="_blank" className="text-blue-600 hover:underline">
            vite
          </a>{" "}
          and used{" "}
          <a href="https://react.dev/" target="_blank" className="text-blue-600 hover:underline">
            react
          </a>{" "}
          for components construction. The simulation part was done by{" "}
          <a
            href="https://github.com/AmesingFlank/taichi.js/tree/master/"
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            taichi.js
          </a>
          , and the web page layout and styling were done by{" "}
          <a
            href="https://tailwindcss.com/"
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            tailwindcss
          </a>
          .
        </p>
        <p className="py-4">
          In the <span className="font-bold">CONTROLS</span> part,
        </p>
        <ul className="py-4 list-disc list-inside">
          <li>
            the grid resolution controls the Eulerian grid resolution in MPM rather than the canvas
            resolution,
          </li>
          <li>
            the number of particles controls the total number of particles during the simulation,
            i.e., the number of particles of each material block is the average of the total number
            of particles,
          </li>
          <li>the time step is the simulation time step,</li>
          <li>the substeps is the number of simulation steps for per frame,</li>
          <li>
            and the double grids of the collision method is for non-sticky coupling. You can easily
            catch the sticky effect in fluid-solid coupling simulation in MPM.
          </li>
        </ul>
        <p className="py-4">
          All simulation control items will be applied immediately after selecting.
        </p>
        <p className="py-4">
          In the <span className="font-bold">PARAMETERS</span> part, all items control properties of
          materials. For example, the smaller the Young's modulus of jelly, the more elastic it is.
        </p>
        <p className="py-4">
          Since the simulation call WebGPU, it may not run successfully in your browser. I recommend
          you use Chrome 113+ or Edge 113+ on any devices with Vulkan or Direct3D support.
        </p>
        <p className="py-4">Have fun!</p>
      </article>
    </div>
  );
}
