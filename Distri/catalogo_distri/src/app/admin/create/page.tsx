'use client'
import { useState } from "react";

export default function Home() {

    const [res, setRes] = useState(null);

    const enviarPost = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/create_product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensaje: 'Hola desde el form' }),
            });

            if (!response.ok) throw new Error('Error en la request');

            const data = await response.json();
            setRes(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

        // product.sku = data[i];
        // product.name = data[i + 1];
        // product.price = new mongoose.Types.Decimal128(data[i + 2]);
        // product.price2 = new mongoose.Types.Decimal128(data[i + 3]);
        // product.active = data[i + 4] == "true" ? true : false;
        // product.orden = parseInt(data[i + 5]);
        // product.section = data[i + 6];
        // product.url = data[i];
        // product.sectionOrden = parseInt(data[i + 7]);
    return (
        <form onSubmit={enviarPost} style={{display: "flex", flexDirection: "column", width: "500px"}}>
            <label htmlFor="sku">Sku: </label>
            <input type="text" name="sku" placeholder="ARC0001"/>

            <label htmlFor="name">Nombre: </label>
            <input type="text" name="name" placeholder="Chocolate Arcor..."/>

            <label htmlFor="price">Precio GF </label>
            <input type="number" name="price"placeholder="627.80"/>

            <label htmlFor="price2" >Precio Distri </label>
            <input type="number" name="price2" placeholder="798.01"/>

            <label htmlFor="active">Active: </label>
            <input type="checkbox" name="active" defaultValue="true"/>

            <label htmlFor="orden">orden: </label>
            <input type="text" name="orden" placeholder="123"/>

            <label htmlFor="section">section: </label>
            <select id="pet-select" name="section">
                <option id="first-option" value="">--elegí categoría--</option>
                <option value="almacen">Almacén</option>
                <option value="bebidas">Bebidas</option>
                <option value="cafe">Café</option>
                <option value="edulcorantes">Edulcorantes</option>
                <option value="galletitas">Galletitas</option>
                <option value="medicamentos">Medicamentos</option>
                <option value="nucete">Nucete</option>
                <option value="kiosko">Kiosko</option>
                <option value="limpieza">Limpieza</option>
                <option value="varios">Varios</option>
                <option value="te">Té</option>
                <option value="yerba">Yerba</option>
                <option value="promocion">Promoción</option>
            </select>

            <label>Imágen: </label>
            <input type="file" />

            <button type="submit">Crear Producto!</button>
            {res && <pre>{JSON.stringify(res, null, 4)}</pre>}
        </form>
    );

};
