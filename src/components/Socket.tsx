import ReconnectingWebSocket from 'reconnecting-websocket'
//https://dev.to/bravemaster619/how-to-prevent-multiple-socket-connections-and-events-in-react-531d
export const WS = new ReconnectingWebSocket('ws://98.35.209.116:7078')