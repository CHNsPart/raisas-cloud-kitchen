"use client";

import React from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUI } from "@/contexts/UIContext";
import { ANIMATION_CONFIG, Z_INDEX } from "@/lib/constants";

export function ToastContainer() {
  const { toasts, removeToast } = useUI();

  return (
    <div
      className={cn(
        "fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6",
        "flex flex-col gap-2",
        "pointer-events-none"
      )}
      style={{ zIndex: Z_INDEX.toast }}
    >
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
          index={index}
        />
      ))}
    </div>
  );
}

interface ToastProps {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
  index: number;
}

function Toast({ message, type, onClose, index }: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        "w-full md:w-auto md:min-w-[320px] md:max-w-[420px]",
        "bg-background border border-border",
        "rounded-xl shadow-lg",
        "p-4 pr-12",
        "pointer-events-auto",
        "animate-in slide-in-from-bottom-4 fade-in-0",
        "transition-all duration-300"
      )}
      style={{
        animationDelay: `${index * ANIMATION_CONFIG.stagger}ms`,
        animationDuration: `${ANIMATION_CONFIG.transition}ms`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-6 h-6 rounded-full flex-shrink-0",
            "flex items-center justify-center",
            colors[type]
          )}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        
        <p className="text-sm text-foreground flex-1">
          {message}
        </p>
        
        <button
          onClick={onClose}
          className={cn(
            "absolute top-3 right-3",
            "w-6 h-6 rounded-full",
            "flex items-center justify-center",
            "hover:bg-muted transition-colors",
            "text-muted-foreground hover:text-foreground"
          )}
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Success Toast Helper
export function showSuccessToast(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("show-toast", {
        detail: { message, type: "success" },
      })
    );
  }
}

// Error Toast Helper
export function showErrorToast(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("show-toast", {
        detail: { message, type: "error" },
      })
    );
  }
}

// Info Toast Helper
export function showInfoToast(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("show-toast", {
        detail: { message, type: "info" },
      })
    );
  }
}