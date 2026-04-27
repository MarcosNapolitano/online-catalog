"use client"
import { useActionState } from "react"
import { type Response } from "@/app/_data/types"
import { generateAPedir } from "@/app/_services/list_utils"

const initialState: Response = {
  success: false,
  message: "",
  error: undefined,
};

const ApedirForm = (): React.JSX.Element => {

  const [state, formAction, isPending] = useActionState(
    async (initialState: Response, formData: FormData) => {

      const files = formData.getAll("pedidos") as File[];

      if (!files) return { success: false, message: "Sin Archivos", error: "No files" };

      const blob = new Blob([await generateAPedir(files)], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "archivo.xlsx"
      a.click()

      URL.revokeObjectURL(url)
      return { success: true, message: "A pedir generado", error: undefined };

    }, initialState);

  return (
    <div>
      <form className="csv-form" action={formAction}>
        <label htmlFor="pedidos"><b>A pedir:</b></label>
        <fieldset className="product-submit">
          <input style={{ color: "whitesmoke" }}
            name="pedidos"
            multiple
            accept=".xlsx"
            type="file"
            required
          />
          <input className="button edit-button" value="Generar A Pedir" type="submit" />
          <p className={state.error ? 'error-message' : 'success-message'}>
            {state.message}
          </p>
        </fieldset>
      </form>
    </div>
  );
};

export default ApedirForm;
