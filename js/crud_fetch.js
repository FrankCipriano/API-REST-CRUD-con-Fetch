const d=document,
      $table=d.querySelector(`.tabla`),
      $form=d.querySelector(`.formulario`),
      $h1_title=d.querySelector(`.titulo`),
      $plantilla=d.getElementById(`plantilla`).content,
      $fragmento=d.createDocumentFragment()

      //-METODO DE PETICION GET CON FETCH
const getFetch=async()=>{
    try {
        let respuesta= await fetch(`http://127.0.0.1:3000/lenguajes`)
        let datos_JSON=await respuesta.json()
        if(!respuesta.ok)throw respuesta
        datos_JSON.forEach((dato) => {
            $plantilla.querySelector(`.tecnologia`).textContent=dato.tecnologia
            $plantilla.querySelector(`.stack`).textContent=dato.stack
            $plantilla.querySelector(`.editar`).dataset.id=dato.id
            $plantilla.querySelector(`.editar`).dataset.tecnologia=dato.tecnologia
            $plantilla.querySelector(`.editar`).dataset.stack=dato.stack
            $plantilla.querySelector(`.eliminar`).dataset.id=dato.id

            let $clon=d.importNode($plantilla,true)
            $fragmento.appendChild($clon)
        });
        $table.querySelector(`tbody`).appendChild($fragmento)
    } catch (er) {
        let mensaje=er.statusText || `Ocurrio un error`
        $table.insertAdjacentHTML(`afterend`,`<p><b>Error ${er.status}: ${mensaje}</b></p>`)
    }
}
d.addEventListener(`DOMContentLoaded`,getFetch)

//-METODO DE PETICION POST, PUT Y DELETE CON FETCH
d.addEventListener(`submit`,async(e)=>{
    if(e.target==$form){
        e.preventDefault()
        if(!e.target.id.value){
            //-POST
            try {
                let parametros={
                    method:`POST`,
                    headers:{
                        "Content-type":`application/json; charset=utf-8`
                    },
                    body:JSON.stringify({
                        tecnologia:e.target.tecnologia.value,
                        stack:e.target.stack.value
                    })
                }
                let respuesta=await fetch(`http://127.0.0.1:3000/lenguajes`,parametros)
                //let datos_JSON=await respuesta.json()

                if(!respuesta.ok)   throw respuesta
                location.reload()
            } catch (er) {
                let mensaje=er.statusText || `Ocurrio un error`
                $form.insertAdjacentHTML(`afterend`,`<p><b>Error ${er.status}: ${mensaje}</p></b>`)
            }
        }else{
            //-PUT
            try {
                let parametros={
                    method:`PUT`,
                    headers:{
                        "Content-type":`application/json;charset=utf-8`
                    },
                    body:JSON.stringify({
                        tecnologia:e.target.tecnologia.value,
                        stack:e.target.stack.value
                    })
                }
                let respuesta=await fetch(`http://127.0.0.1:3000/lenguajes/${e.target.id.value}`,parametros)
                //let datos_JSON=await respuesta.json()

                if(!respuesta.ok) throw respuesta
                location.reload()
            } catch (er) {
                let mensaje=er.statusText || `Ocurrio un error`
                $form.insertAdjacentHTML(`afterend`,`<p></b>Error ${er.status}: ${mensaje}</b></p>`)
            }
        }
    }
})
d.addEventListener(`click`,async(e)=>{
    if(e.target.matches(`.editar`)){
        $h1_title.textContent=`EDITAR TECNOLOGIA`
        $form.tecnologia.value=e.target.dataset.tecnologia
        $form.stack.value=e.target.dataset.stack
        $form.id.value=e.target.dataset.id
    }
    if(e.target.matches(`.eliminar`)){
        let respuesta=confirm(`Seguro que deseas eliminar ${e.target.dataset.id}?`)
        if(respuesta){
            //-DELETE
            try {
               let parametros={
                   method:`DELETE`,
                   headers:{
                       "Content-type":`application/json;charset=utf-8`
                   }
               } 
               let respuesta=await fetch(`http://127.0.0.1:3000/lenguajes/${e.target.dataset.id}`,parametros)
               if(!respuesta.ok)    throw respuesta
               location.reload()
            } catch (er) {
                let mensaje=er.statusText || `Ocurrio un error`
                alert(`Error ${er.status}: ${mensaje}`)
            }
        }
    }
})