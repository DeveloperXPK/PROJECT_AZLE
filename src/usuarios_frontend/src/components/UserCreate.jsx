import { useCanister } from "@connect2ic/react";
import React, { useState } from "react";


const UserCreate = () => {
    const [usuarios_backend] = useCanister("usuarios_backend");
    const [loading, setLoading] = useState("");


    const saveUser = async (e) => {
        e.preventDefault();
        const form = e.target
        const nombre = form.nombre.value;
        const direccion = form.direccion.value;
        const telefono = form.telefono.value;

        setLoading("Loading...");

        await usuarios_backend.createUser(nombre, direccion, telefono);
        setLoading("");

        {
            document.getElementById('btnUserList').click();
        }

        
    }

    
    return (
     
        <div className="row  mt-5">
            <div className="col-2"></div>
            <div className="col-8">
                {loading != "" 
                    ? 
                    <div className="alert alert-primary">{loading}</div>
                    :
                    <div></div>
                }
                <div className="card">
                    <div className="card-header">
                        Registrar Usuario
                    </div>
                    <div className="card-body">
                        <form onSubmit={saveUser} style={{display:"inline"}} >
                        <div className="form-group">
                            <label htmlFor="nombre" >Nombre usuario</label>
                            <input type="text" className="form-control" id="nombre" placeholder="Homer" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="direccion" >Direccion</label>
                            <input type="text" className="form-control" id="direccion" placeholder="calle siempre viva" />
                        </div>
                            <div className="form-group">
                            <label htmlFor="telefono" >Telefono</label>
                            <input type="text" className="form-control" id="telefono" placeholder="123" />
                        </div>
                        <br />
                        <div className="form-group">
                            <input type="submit" className="btn btn-success" value="Agregar"/>  
                        </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-2"></div>

        </div>
    )
  }
  
  
  export default UserCreate