import { describe, expect, it, vi } from "vitest";
import { handleKeyDown } from "./eventHandlers.js";

describe("handleKeyDown (ClausulasAcuerdo)", () => {
  it("acepta al presionar Enter", () => {
    const event = { key: "Enter" };
    const onAccept = vi.fn();
    const onCancel = vi.fn();

    handleKeyDown(event, onAccept, onCancel);

    expect(onAccept).toHaveBeenCalledWith(event);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("cancela al presionar Escape", () => {
    const event = { key: "Escape" };
    const onAccept = vi.fn();
    const onCancel = vi.fn();

    handleKeyDown(event, onAccept, onCancel);

    expect(onCancel).toHaveBeenCalledWith(event);
    expect(onAccept).not.toHaveBeenCalled();
  });

  it("ignora otras teclas", () => {
    const onAccept = vi.fn();
    const onCancel = vi.fn();

    handleKeyDown({ key: "Tab" }, onAccept, onCancel);

    expect(onAccept).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });
});