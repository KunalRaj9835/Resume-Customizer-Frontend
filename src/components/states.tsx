import { AlertCircle, Loader2 } from "lucide-react";
export const Loading = () => <div role="status" className="flex items-center gap-2 p-6 text-black/60"><Loader2 className="h-4 w-4 animate-spin" />Loading…</div>;
export const ErrorBox = ({ message, retry }: { message: string; retry?: () => void }) => (
  <div role="alert" className="card flex items-start gap-3 border-red-700 bg-red-50"><AlertCircle className="mt-0.5 h-5 w-5 text-red-700" /><div><p className="text-sm text-red-900">{message}</p>{retry && <button className="btn2 mt-3" onClick={retry}>Try again</button>}</div></div>);
export const Empty = ({ title, hint, children }: { title: string; hint: string; children?: React.ReactNode }) => (
  <div className="card text-center"><p className="font-medium">{title}</p><p className="mx-auto mt-1 max-w-sm text-sm text-ink/60">{hint}</p><div className="mt-4">{children}</div></div>);
