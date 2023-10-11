import { useNavigate, Form, useActionData, redirect } from "react-router-dom"
import Formulario from "../components/Formulario"
import Error from "../components/Error"
import { agregarCliente } from "../data/clientes"

export async function action({request}){
  const formData = await request.formData()
  const datos = Object.fromEntries(formData)
    
  //Validación
  const errores = []
  const email = formData.get('email')

  if(Object.values(datos).includes('')){
    errores.push('Todos los campos son obligatorios')
  }
  let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

  if(!regex.test(email) && errores.length==0){
    errores.push('El Email no es válido')
  }


  //Retornar errores
  if(Object.keys(errores).length){
    return errores
  }

  await agregarCliente(datos)

  return redirect('/')
}

function NuevoCliente() {

    const navigate = useNavigate()
    const errores = useActionData()

  return (
    <>
      <h1 className="font-black text-4xl text-blue-800 text-center">Nuevo cliente</h1>
      <p className="mt-3 text-center text-xl">Llena todos los campos</p>

      <div className="flex justify-end">
        <button
          className="bg-blue-700 text-white px-3 py-0.5 font-bold uppercase"
          onClick={() =>navigate(-1)}
        >  
          Volver
        </button>
      </div>
      <div className="bg-white shadow rounded-md md:w-3/4 mx-auto px-5 py-10 mt-10">

        {errores?.length && errores.map((error, i)=><Error key={i}>{error}</Error>)}
        <Form
          method="post"
          noValidate  
        >
          <Formulario/>
          <input 
            type="submit" 
            className="mt-5 w-full bg-blue-700 p-3 uppercase font-bold text-white text-lg"
            value="Registrar Cliente"
          />
        </Form>
      </div>
    </>
  )
}

export default NuevoCliente
