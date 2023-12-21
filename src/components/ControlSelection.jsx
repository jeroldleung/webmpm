function Selection({ control_item }) {
  const value_options = control_item.values.map((single_value) => (
    <option value={single_value}>{single_value}</option>
  ));
  return (
    <div>
      <label className="text-stone-400 text-sm text-center">
        {control_item.name}
        <select
          id={control_item.id}
          defaultValue={control_item.defaultValue}
          className="py-0.5 block w-full text-sm text-black bg-transparent border-0 border-b border-stone-400 focus:outline-none focus:ring-0 focus:border-black"
        >
          {value_options}
        </select>
      </label>
    </div>
  );
}

export default function ControlSelection({ options }) {
  const items = options.map((single_item) => <Selection control_item={single_item} />);
  return (
    <div className="flex flex-col gap-1 sm:w-56">
      <p className="font-bold text-lg">CONTROLS</p>
      {items}
    </div>
  );
}
