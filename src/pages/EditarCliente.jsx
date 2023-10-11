import Formulario from "../components/Formulario"
import { actualizarCliente, obtenerCliente } from "../data/clientes"
import { Form, useNavigate, useLoaderData, useActionData, redirect } from "react-router-dom"
import Error from "../components/Error"


export async function loader({params}){
    const cliente = await obtenerCliente(params.clienteId)
    if(Object.values(cliente).length===0){
        throw new Response('',{
            status: 404,
            statusText: 'Cliente no encontrado'
        })
    }
    
    return cliente
}

export async function action({request, params}){
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

  //Actualizar cliente
  await actualizarCliente(params.clienteId,datos)

  return redirect('/')
}


const EditarCliente = () => {

    const navigate=useNavigate()
    const cliente=useLoaderData()
    const errores=useActionData()

  return (
    <div>
      <h1 className="font-black text-4xl text-blue-800 text-center">Editar cliente</h1>
      

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
            <Formulario
                cliente={cliente}
            />
            <input 
                type="submit" 
                className="mt-5 w-full bg-blue-700 p-3 uppercase font-bold text-white text-lg"
                value="Guardar Cambios"
            />
            </Form>   
      </div>
    </div>
  )
}

export default EditarCliente
