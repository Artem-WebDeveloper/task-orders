import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SOCKET_EVENTS } from "@task-orders/shared";

import { getSocket } from "@/shared/socket/socketClient";
import { useAuth } from "@/features/auth";
import { ordersQueryKey } from "./useOrders";

function useOrderEvents() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKey });
    };

    const events: string[] = [];

    if (user?.role.code === "operator") {
      events.push(SOCKET_EVENTS.ORDER_STATUS_CHANGED);
    }

    if (user?.role.code === "team") {
      events.push(
        SOCKET_EVENTS.ORDER_STATUS_CHANGED,
        SOCKET_EVENTS.ORDER_CREATED,
        SOCKET_EVENTS.ORDER_DELETED,
        SOCKET_EVENTS.ORDER_ASSIGNED,
      );
    }

    events.forEach((event) => socket.on(event, invalidate));

    return () => {
      events.forEach((event) => socket.off(event, invalidate));
    };
  }, [queryClient, user?.role.code]);
}

export default useOrderEvents;
