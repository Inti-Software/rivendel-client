import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NotificationProvider from "./NotificationProvider.jsx";
import { useNotification } from "./Constants.jsx";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const HookHarness = () => {
  const { showSuccess, showError } = useNotification();

  return (
    <div>
      <button type="button" onClick={() => showSuccess("Guardado", 2000)}>success</button>
      <button type="button" onClick={() => showError("Falló", 3000)}>error</button>
    </div>
  );
};

describe("NotificationProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("expone showSuccess y showError y les pasa las opciones esperadas", () => {
    render(
      <NotificationProvider>
        <HookHarness />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "success" }));
    fireEvent.click(screen.getByRole("button", { name: "error" }));

    expect(toast.success).toHaveBeenCalledWith(
      "Guardado",
      expect.objectContaining({ autoClose: 2000, toastId: "Guardado" })
    );
    expect(toast.error).toHaveBeenCalledWith(
      "Falló",
      expect.objectContaining({ autoClose: 3000, toastId: "Falló" })
    );
  });
});
