import { useCanister } from "@connect2ic/react";
import React, { useState } from "react";

const CreateProduct = () =>
{
    const [usuarios_backend] = useCanister("usuarios_backend");
    const [loading, setLoading] = useState("");


    const saveProduct = async (e) => {
        e.preventDefault();
        const form = e.target
        const nombre_Producto = form.nombre_Producto.value;
        const fabricante_Producto = form.fabricante_Producto.value;
        const precio_Producto = form.precio_Producto.value;

        setLoading("Loading...");

        await usuarios_backend.createProduct(nombre_Producto, fabricante_Producto, precio_Producto);
        setLoading("");

        {
            document.getElementById('btnProductList').click();
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
                        Registrar Producto
                    </div>
                    <div className="card-body">
                        <form onSubmit={saveProduct} style={{display:"inline"}} >
                        <div className="form-group">
                            <label htmlFor="nombre_Producto" >Producto</label>
                            <input type="text" className="form-control" id="nombre_Producto" placeholder="Iphone 15 Pro Max" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fabricante_Producto" >Fabricante</label>
                            <input type="text" className="form-control" id="fabricante_Producto" placeholder="Apple" />
                        </div>
                            <div className="form-group">
                            <label htmlFor="precio_Producto" >Precio</label>
                            <input type="text" className="form-control" id="precio_Producto" placeholder="1000$" />
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

export default CreateProduct;