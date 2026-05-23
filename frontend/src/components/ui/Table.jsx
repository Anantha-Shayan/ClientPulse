export default function Table({ columns, rows, getRowKey }) {
  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant bg-white shadow-sm">
      <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-surface-container-low text-label uppercase tracking-wide text-on-surface-variant">
          <tr>{columns.map((column) => <th key={column.key} className="px-4 py-3 font-bold">{column.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/60">
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="min-h-12 transition hover:bg-surface-container-lowest">
              {columns.map((column) => <td key={column.key} className="px-4 py-3">{column.render ? column.render(row) : row[column.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
