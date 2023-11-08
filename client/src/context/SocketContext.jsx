import { createContext, useState } from "react";

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [unreadMessages, setunreadMessages] = useState([]);

  const updateArray = newArray => {
    console.log(newArray,"update")
    setunreadMessages(newArray);
    console.log(unreadMessages,"myArray")
  }


  return (
    <SocketContext.Provider value={{ unreadMessages ,updateArray}}>
      {children}
    </SocketContext.Provider>
  );
};
