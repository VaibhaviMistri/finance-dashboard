import { theme } from "../../constants/theme";
import { formatCurrency } from "../../utils/finance";
const { COLORS } = theme;

/**
 * Shared Recharts custom tooltip used across all charts.
 */
export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background:   COLORS.bgCard,
        border:       `1px solid ${COLORS.borderHover}`,
        borderRadius: 10,
        padding:      "10px 14px",
        fontSize:     13,
        boxShadow:    "0 8px 24px rgba(0,0,0,0.3)",
      }}
    >
      <p style={{ color: COLORS.textMuted, marginBottom: 6, fontWeight: 600, margin: "0 0 6px" }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{ color: p.color, display: "flex", gap: 8, marginBottom: 2 }}
        >
          <span>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}
