export default function ErrorDisplay({ error }) {
  return (
    <div className="error mt-8 text-sm px-4 py-2 rounded w-120 text-center">
      {error}
    </div>
  );
}
