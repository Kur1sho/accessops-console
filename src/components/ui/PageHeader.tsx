export function PageHeader({
  title,
  description,
  right,
}: {
  title: string;
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <div>
        <h1 style={{ margin: 0 }}>{title}</h1>
        {description && <p style={{ marginTop: 6 }}>{description}</p>}
      </div>
      {right}
    </div>
  );
}