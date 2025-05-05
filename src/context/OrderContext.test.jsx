import { renderHook, act } from "@testing-library/react-hooks";
import { OrderProvider, useOrders } from "./OrderContext";

describe("OrderContext", () => {
  it("fetches orders correctly", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { orderId: "1", totalAmount: 20.0, orderStatus: "PROCESSING" },
          ]),
      })
    );

    const { result, waitForNextUpdate } = renderHook(() => useOrders(), {
      wrapper: OrderProvider,
    });

    await waitForNextUpdate();

    expect(result.current.orders).toHaveLength(1);
    expect(result.current.orders[0].orderStatus).toBe("PROCESSING");
  });
});
