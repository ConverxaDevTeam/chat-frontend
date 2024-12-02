// Base interface for all WebSocket responses
export interface WebSocketBaseResponse {
  conf: {
    threadId: string;
    agentId: string;
  };
}

export interface WebSocketChatTestResponse extends WebSocketBaseResponse {
  text: string;
}

// Message response interface
export type WebSocketMessageResponse = WebSocketChatTestResponse | string;
