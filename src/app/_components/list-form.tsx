"use client"
import { useActionState } from "react"
import { type Response } from "@/app/_data/types"
import { updateList } from "@/app/_services/list_utils"

const initialState: Response = {
  success: false,
  message: "",
  error: undefined,
};

const ListForm = (): React.JSX.Element => {

  const [state, formAction, isPending] = useActionState(
    async (initialState: Response, formData: FormData) => {

      const pdf = formData.get("pdf") as File;
      const listId = parseInt(formData.get("lista") as string);
      const response: Response = await updateList(pdf, listId as 1 | 2);

      return response;

    }, initialState);

  return (
    <div>
      <form className="csv-form" action={formAction}>
        <label htmlFor="lista"><b>Lista:</b></label>
        <select name="lista" id="cat-select" defaultValue="1">
          <option value="1">Mayorista</option>
          <option value="2">Minorista</option>
        </select>
        <label htmlFor="pdf"><b>PDF:</b></label>
        <input style={{ color: "whitesmoke" }} name="pdf" accept=".pdf" type="file" required />

        <fieldset className="product-submit">
          <input className="button edit-button" value="Actualizar Lista" type="submit" />
          <p className={state.error ? 'error-message' : 'success-message'}>
            {state.message}
          </p>
        </fieldset>
      </form>
    </div>
  );
};

export default ListForm;
