import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-2 text-4xl font-bold">404</h1>
      <p className="mb-6 text-muted-foreground">Page not found.</p>
      <Link
        href="/"
        className="text-sm font-medium text-primary hover:underline"
      >
        Go back home
      </Link>
    </div>
  );
}
