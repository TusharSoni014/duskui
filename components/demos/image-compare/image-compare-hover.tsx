import { ImageCompare } from "@/components/dusk/image-compare/image-compare";

function StatCard({ styled }: { styled: boolean }) {
  return (
    <div
      className={
        styled
          ? "grid place-items-center bg-background"
          : "grid place-items-center bg-neutral-200"
      }
    >
      <div
        className={
          styled
            ? "w-56 rounded-xl border bg-card p-5 shadow-sm"
            : "w-56 rounded border border-neutral-400 bg-white p-5"
        }
      >
        <p className={styled ? "text-xs text-muted-foreground" : "text-xs text-neutral-500"}>Monthly revenue</p>
        <p className={styled ? "mt-1 text-3xl font-semibold text-foreground tabular-nums" : "mt-1 text-3xl font-semibold text-neutral-900 tabular-nums"}>
          $48,210
        </p>
        <div className="mt-4 flex h-12 items-end gap-1.5">
          {[38, 52, 44, 70, 62, 88, 100].map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className={styled ? "flex-1 rounded-sm bg-primary/80" : "flex-1 bg-neutral-400"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ImageCompareHoverDemo() {
  return (
    <ImageCompare
      mode="hover"
      defaultPosition={50}
      className="aspect-video max-w-lg"
      label="Compare default and DuskUI styles"
      beforeLabel="Default"
      afterLabel="DuskUI"
      before={<StatCard styled={false} />}
      after={<StatCard styled />}
    />
  );
}
