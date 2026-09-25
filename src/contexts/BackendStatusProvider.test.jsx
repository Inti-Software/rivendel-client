import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { BackendStatusProvider } from "./BackendStatusProvider.jsx";
import { useBackendStatus } from "./Constants.jsx";
import {
  BACKEND_STATUS_CHECKING,
  BACKEND_STATUS_DOWN,
  BACKEND_STATUS_UP,
  setBackendDown,
} from "../stores/backend-status.js";

const HookHarness = () => {
  const { isBackendDown } = useBackendStatus();
  return <span data-testid="status">{String(isBackendDown)}</span>;
};

describe("BackendStatusProvider", () => {
  beforeEach(() => {
    setBackendDown(BACKEND_STATUS_CHECKING);
  });

  it("lee el valor inicial del store y reacciona a cambios de estado", async () => {
    act(() => {
      setBackendDown(BACKEND_STATUS_DOWN);
    });

    render(
      <BackendStatusProvider>
        <HookHarness />
      </BackendStatusProvider>
    );

    expect(screen.getByTestId("status")).toHaveTextContent(String(BACKEND_STATUS_DOWN));

    act(() => {
      setBackendDown(BACKEND_STATUS_UP);
    });

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent(String(BACKEND_STATUS_UP));
    });
  });
});
