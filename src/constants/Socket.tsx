import ReconnectingWebSocket from 'reconnecting-websocket'
//https://dev.to/bravemaster619/how-to-prevent-multiple-socket-connections-and-events-in-react-531d
export const WSC = new ReconnectingWebSocket(`ws://${process.env.NEXT_PUBLIC_NODE_IP}:7078`)