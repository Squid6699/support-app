
import { useContext } from "react";
import { SesionContext } from "../context/sesion";

export function useSesion(){
    const context = useContext(SesionContext);

    if (context === undefined){
        throw new Error("useContext debe ser usado en un SesionContextProvider");
    }

    return context;
}