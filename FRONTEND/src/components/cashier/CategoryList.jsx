function CategoryList({ categories, activeId, onSelect }) {
  return (
    <div className="flex flex-col gap-2">
      {categories.map((c) => {
        const active = c.id === activeId;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c)}
            className={[
              "w-full text-left px-4 py-3 rounded-xl border transition duration-300",
              active
                ? "bg-mokkaCoffee text-white border-mokkaCoffee"
                : "bg-white/70 border-white/60 text-gray-700 hover:bg-mokkaCoffee/10 hover:text-mokkaCoffee",
            ].join(" ")}
          >
            <span className="text-sm font-extrabold">{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryList;

