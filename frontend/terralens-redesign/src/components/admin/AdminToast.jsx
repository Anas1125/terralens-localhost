import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

export default function AdminToast({
  message,
  type = "success",
  onClose,
}) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const styles = {
    success: {
      container: "border-emerald-200 bg-white text-emerald-700",
      icon: <CheckCircle2 size={20} />,
    },
    error: {
      container: "border-red-200 bg-white text-red-600",
      icon: <XCircle size={20} />,
    },
    warning: {
      container: "border-amber-200 bg-white text-amber-700",
      icon: <AlertTriangle size={20} />,
    },
    info: {
      container: "border-sky-200 bg-white text-sky-600",
      icon: <Info size={20} />,
    },
  };

  const currentStyle = styles[type] || styles.success;

  return (
    <div
      className="
        fixed
        right-6
        top-6
        z-[9999]
        w-[calc(100%-3rem)]
        max-w-sm
        animate-[slideIn_0.3s_ease-out]
        rounded-2xl
        border
        px-4
        py-3
        shadow-[0_15px_40px_rgba(15,23,42,0.12)]
        backdrop-blur-sm
        md:right-8
        md:top-8
      "
      role="alert"
    >
      <div
        className={`flex items-start gap-3 ${currentStyle.container}`}
      >
        <div className="mt-0.5 shrink-0">
          {currentStyle.icon}
        </div>

        <p className="flex-1 text-sm font-medium leading-5">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="
            shrink-0
            rounded-lg
            p-1
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-600
          "
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}