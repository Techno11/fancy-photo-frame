import { createContext } from "react";
import SocketHelper from "../helpers/SocketHelper";

const ws = new SocketHelper(window.location.hostname + ":8008");

export const SocketContext = createContext(ws);

interface ISocketProvider {
  children: any;
}

export const SocketProvider = (props: ISocketProvider) => (
  <SocketContext.Provider value={ws}>{props.children}</SocketContext.Provider>
);