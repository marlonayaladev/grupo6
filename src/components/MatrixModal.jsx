import { categories, relationMatrix } from '../data';

export default function MatrixModal({ filters, onClose }) {
  const activeCategories = categories.filter((cat) => {
    const hasActive = cat.items.some((item) => filters[cat.id]?.[item.id]);
    return hasActive;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-dash-surface border border-dash-border rounded-lg w-full max-w-5xl max-h-[80vh] flex flex-col mx-4">
        <div className="flex items-center justify-between p-4 border-b border-dash-border">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-dash-text">
            Matriz de Relaciones Estratégicas
          </h2>
          <button
            onClick={onClose}
            className="text-dash-muted hover:text-dash-text transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 text-dash-muted uppercase tracking-wider font-semibold border-b border-dash-border sticky top-0 bg-dash-surface">
                  Elemento
                </th>
                {activeCategories.map((cat) => (
                  <th
                    key={cat.id}
                    className="px-3 py-2 text-dash-muted uppercase tracking-wider font-semibold border-b border-dash-border sticky top-0 bg-dash-surface text-center"
                  >
                    {cat.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeCategories.map((cat) =>
                cat.items
                  .filter((item) => filters[cat.id]?.[item.id])
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-dash-text font-medium border-b border-dash-border/50">
                        <span className="text-ring-0">{item.id}</span>{' '}
                        <span className="text-dash-muted">{item.nombre}</span>
                      </td>
                      {activeCategories.map((otherCat) => {
                        const otherItems = otherCat.items.filter((oi) =>
                          filters[otherCat.id]?.[oi.id]
                        );
                        const connections = relationMatrix[item.id] || [];
                        const connectedInOther = otherItems.filter((oi) =>
                          connections.includes(oi.id)
                        );

                        return (
                          <td
                            key={otherCat.id}
                            className="px-3 py-2 text-center border-b border-dash-border/50"
                          >
                            {connectedInOther.length > 0 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ring-0/20 text-ring-0 text-[10px] font-bold">
                                {connectedInOther.length}
                              </span>
                            ) : (
                              <span className="text-dash-muted/30">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-dash-border text-[10px] text-dash-muted">
          Total elementos activos:{' '}
          {activeCategories.reduce(
            (sum, cat) =>
              sum + cat.items.filter((i) => filters[cat.id]?.[i.id]).length,
            0
          )}
        </div>
      </div>
    </div>
  );
}
