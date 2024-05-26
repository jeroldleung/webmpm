export default function Stats({ fps, pnum }) {
  return (
    <div className="flex flex-col gap-1 sm:w-56">
      <p className="font-bold text-lg">STATS</p>
      <div>
        <label className="text-stone-400 text-sm text-center">FPS: {fps}</label>
      </div>
      <div>
        <label className="text-stone-400 text-sm text-center">Particle Numbers: {pnum}</label>
      </div>
    </div>
  );
}
