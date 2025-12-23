"use client"
import { useActionState } from "react"
import { type Response } from "@/app/_data/types"

const initialState: Response = {
  success: false,
  message: "",
  error: undefined,
};

const TxtForm = (): React.JSX.Element => {

  const [state, formAction, isPending] = useActionState(
    async (initialState: Response, formData: FormData) => {


      const getText = async (formData: FormData) => {

        const res = await fetch("/api/txt", {
          method: "POST",
          body: formData.get("pdf"),
        });

        if (!res.ok) {
          return { success: false, message: "PDF Error", error: undefined }
        }

        const url = URL.createObjectURL(await res.blob());

        const a = document.createElement("a");
        a.href = url;
        a.download = "test.txt";
        a.click();

        URL.revokeObjectURL(url);
      }

      getText(formData)
      return { success: true, message: "Text received", error: undefined }

    }, initialState);

  return <div style={{ marginTop: "2%" }}>
    <form className="csv-form" action={formAction}>
      <label htmlFor="pdf"><b>Transformador PDF:</b></label>
      <fieldset className="misc-functions">
        <input style={{ color: "whitesmoke" }} name="pdf" type="file" />
        <input value="Subir PDF" type="submit" />
      </fieldset>
      <p style={state.error ? { color: "red" } : { color: "green" }}>{state.error}</p>
    </form>
  </div>
};

export default TxtForm;
