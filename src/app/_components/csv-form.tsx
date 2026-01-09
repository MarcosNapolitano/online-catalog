"use client"
import { useActionState, useEffect, useState } from "react"
import { createPortal } from "react-dom";
import { type IProduct } from "@/app/_data/types"
import { type Response } from "@/app/_data/types"
import { createTask, updateProducts } from "@/app/_services/product_utils";
import { TASKS } from "@/app/_data/task";
import { Portal } from "./portal";

const initialState: Response = {
  success: false,
  message: "",
  error: undefined,
};

const CsvForm = (): React.JSX.Element => {

  const [filename, setFilename] = useState("Ningún archivo seleccionado")
  const [taskID, setTaskID] = useState("")

  const [state, formAction, isPending] = useActionState(
    async (initialState: Response, formData: FormData) => {

      const taskID = await createTask();
      state.message = "Actualizando Productos...";
      setTaskID(taskID)
      return updateProducts(formData, taskID);

    }, initialState);

  return <div style={{ marginTop: "2%" }}>
    <form className="csv-form" action={formAction}>
      <label htmlFor="csv"><b>Importador Precios CSV:</b></label>
      <label>Columnas: SKU - PRICE - PRICE2</label>
      <fieldset className="misc-functions">
        <label className="file-input">
          <span className="button">Seleccionar archivo</span>
          <span style={{ textAlign: "center" }}>{filename}</span>
          <input className="file-input"
            style={{ display: "none" }}
            name="csv"
            type="file"
            accept=".csv"
            onChange={(e) => setFilename(e.target.files ? e.target.files[0].name : filename)} />
        </label>
        <input className="button" value="Subir CSV" type="submit" />
      </fieldset>
      <p className={state.success ? 'success-message' : 'error-message'}>
        {state.message}
      </p>
    </form>

    {isPending && <ProgressModal taskID={taskID} />}
  </div>
};

function ProgressModal({ taskID }: { taskID: string }) {

  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!taskID) return;
    const es = new EventSource(`/api/job?id=${taskID}`);
    if (!es) return;

    es.onerror = () => {
      return () => es.close()
    };

    es.onmessage = (e) => setMessage(e.data);
    return () => es.close();
  }, [taskID]);

  return (
    <Portal>
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Actualizando productos...</h3>
          <p><strong>Task: </strong>{taskID}</p>
          <br />
          <p style={{color: "orangered"}}>{message}</p>
        </div>
      </div>
    </Portal>
  );
};


export default CsvForm;
