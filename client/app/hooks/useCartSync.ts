'use client';

import usePartySocket from "partysocket/react";
import { useEffect } from "react";

type CartSyncMessage = {
  type: 'cart_updated' | 'item_added' | 'item_removed' | 'quantity_updated';
  payload: any;
  timestamp: number;
};

type UseCartSyncOptions = {
  roomId: string; // User ID or session ID
  enabled: boolean;
  onMessage: (message: CartSyncMessage) => void;
};

export function useCartSync({ roomId, enabled, onMessage }: UseCartSyncOptions) {
  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    party: "cart",
    room: roomId,
    // Only connect when enabled and we have a room ID
    enabled: enabled && Boolean(roomId),
  });

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message: CartSyncMessage = JSON.parse(event.data);
        onMessage(message);
      } catch (error) {
        console.error("Error parsing cart sync message:", error);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, onMessage]);

  const sendMessage = (type: CartSyncMessage['type'], payload: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type, payload }));
    }
  };

  return {
    socket,
    sendMessage,
    isConnected: socket?.readyState === WebSocket.OPEN,
  };
}
