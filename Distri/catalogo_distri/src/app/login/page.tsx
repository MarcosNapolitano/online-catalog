"use client"
import './login.css'
import backgroundImage from '@/../public/img/back.webp'
import { useActionState } from "react"
import { useRouter } from "next/navigation";
import { type Response } from "@/app/_data/types"
import { login } from '@/app/_services/user_utils';

const initialState: Response = {
  success: false,
  message: "",
  error: undefined,
};

export default function Login() {
  
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(async (initialState: Response, formData: FormData) => {

    const response: Response = await login(formData);

    if (response.success) {
      router.push("/")
    }
    else { console.error(response.error) };

    return response;

  }, initialState);

  return (
    <section id="0" className="section" style={{ backgroundImage: `url(${backgroundImage.src})`, minHeight: "100dvh" }}>
      <form className='loginForm' action={formAction}>
        <h2>Bienvenido</h2>
        <label htmlFor="user"><b>Usuario:</b></label>
        <input name="user" type="text" placeholder='Ingrese nombre de usuario...'required />

        <label htmlFor="pass"><b>Contraseña:</b></label>
        <input name="pass" type="password" required />

        <input style={{ margin: "1rem auto" }}type="submit" disabled={isPending} value="Login" />
        <p style={state.error ? { color: "red"} : {color : "green"}}>{state.error ? state.message : ""}</p>
      </form>
    </section>
  );
};
