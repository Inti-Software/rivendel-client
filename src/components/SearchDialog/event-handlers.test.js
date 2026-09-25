import { describe, expect, it, vi } from "vitest";
import { handleKeyDown } from "./event-handlers.js";

describe("handleKeyDown", () => {
  it("ejecuta onAccept al presionar Enter", () => {
    const onAccept = vi.fn();
    const onCancel = vi.fn();
    const event = { key: "Enter" };

    handleKeyDown(event, onAccept, onCancel);

    expect(onAccept).toHaveBeenCalledWith(event);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("ejecuta onCancel al presionar Escape", () => {
    const onAccept = vi.fn();
    const onCancel = vi.fn();
    const event = { key: "Escape" };

    handleKeyDown(event, onAccept, onCancel);

    expect(onCancel).toHaveBeenCalledWith(event);
    expect(onAccept).not.toHaveBeenCalled();
  });

  it("ignora las demás teclas", () => {
    const onAccept = vi.fn();
    const onCancel = vi.fn();

    handleKeyDown({ key: "Tab" }, onAccept, onCancel);

    expect(onAccept).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });
});
