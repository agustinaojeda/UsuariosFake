
let numUsuarios = document.getElementById("numUsuarios");
let form = document.getElementById("formulario");

let mujeres = [];
let hombres = [];

form.addEventListener("submit", async event => {
    event.preventDefault(); //para evitar que se refresque la pag al enviar el formulario

    if (validarNumero(numUsuarios.value)){
        numUsuarios.value = "";
        document.getElementById('filtraje').style.display = "none";
        document.getElementById("tabla").innerHTML = "";
        return ;
    }

    await cargarUsuarios();
    crearTabla();
    ponerUsuario(hombres, mujeres);

    sacarPaises();

    ordenarNYA();
    verViejos();
})



async function cargarUsuarios() {
    let mostrarFiltros = document.getElementById('filtraje');

    mujeres = [];
    hombres = [];

    for (let i = 0; i < numUsuarios.value; i++) {
        await fetch("https://randomuser.me/api/")
            .then(res => res.json())
            .then(res => {
                if (res.results[0].gender == "male") {
                    hombres.push(res.results[0]);
                    console.log("soy hombre");
                } else {
                    mujeres.push(res.results[0])
                    console.log("soy mujer");
                }
            })
            .catch(err => console.log(err));
    }

    mostrarFiltros.style.display = "block"
    return { hombres, mujeres };
}

function crearTabla() {
    let tablaUsu = document.getElementById("tabla");

    tablaUsu.innerHTML = "";

    let tabla = document.createElement("table");

    tabla.innerHTML = `<table class="tablaUsuarios"">
        <thead>
            <tr>
            <th>MASCULINOS</th>
            <th>FEMENINOS</th>
            </tr>
         </thead>
        <tbody>

        </tbody>
        </table>
        `;

    tablaUsu.appendChild(tabla);
}

function ponerUsuario(hom, muj) {
    let tabla = document.querySelector("#tabla table");

    for (let i = 0; i < Math.max(hom.length, muj.length); i++) {
        let imagen = document.createElement("img");
        imagen.width = 50;
        imagen.height = 50;

        let fila = document.createElement("tr");

        let hombre = document.createElement("td");
        if (hom[i]) {
            imagen.src = hom[i].picture.thumbnail;
            imagen.title = hom[i].name.first + " " + hom[i].name.last + ", " + hom[i].phone;
            imagen.addEventListener('load', () => {
                hombre.appendChild(imagen);
                hombre.appendChild(document.createTextNode(hom[i].name.first + " " + hom[i].name.last));
                hombre.appendChild(document.createElement("br"));
                hombre.appendChild(document.createTextNode(hom[i].email))  
            });

        }

        let mujer = document.createElement("td");
        if (muj[i]) {
            let imagenMujer = document.createElement("img");
            imagenMujer.width = 50;
            imagenMujer.height = 50;
            imagenMujer.src = muj[i].picture.thumbnail;
            imagenMujer.title = muj[i].name.first + " " + muj[i].name.last + ", " + muj[i].phone;
            imagenMujer.addEventListener('load', () => {
                mujer.appendChild(imagenMujer);
                mujer.appendChild(document.createTextNode(muj[i].name.first + " " + muj[i].name.last));
                mujer.appendChild(document.createElement("br"));
                mujer.appendChild(document.createTextNode(muj[i].email))
            });

        }

        fila.appendChild(hombre);
        fila.appendChild(mujer);

        tabla.appendChild(fila);
    }


}

function sacarPaises() {
    let paises = [];
    let div = document.getElementById('aggHijo');

    let btn = document.createElement('button');
    btn.textContent = "Ver";

    div.innerHTML = ""

    for (let i = 0; i < hombres.length; i++) {
        paises.push(hombres[i].location.country);
    }
    for (let i = 0; i < mujeres.length; i++) {
        paises.push(mujeres[i].location.country);
    }

    paises = new Set(paises);

    const select = document.createElement('select');

    paises.forEach(pais => {
        const opcion = document.createElement('option')
        opcion.value = pais;
        opcion.text = pais;
        select.appendChild(opcion);
    })

    select.id = "selectPaises";
    div.appendChild(select);
    div.appendChild(btn);

    btn.addEventListener('click', buscarPais);
}

const buscarPais = () => {
    let pais = document.getElementById('selectPaises');
    let cont = 0;

    let auxM;
    let auxH;

    auxM = [];
    auxH = [];

    for (let i = 0; i < hombres.length; i++) {
        if (hombres[i].location.country == pais.value) {
            auxH.push(hombres[i]);
            cont++;
        }
    }

    for (let i = 0; i < mujeres.length; i++) {
        if (mujeres[i].location.country == pais.value) {
            auxM.push(mujeres[i]);
            cont++;
        }
    }

    crearTabla();
    ponerUsuario(auxH, auxM);

    return cont;

}

function ordenarNYA() {

    let btn = document.getElementById("ordenarNA")


    const orden = () => {
        let ordenadosHombres = hombres.slice().sort((a, b) => a.name.first.localeCompare(b.name.first));
        let ordenadosMujeres = mujeres.slice().sort((a, b) => a.name.first.localeCompare(b.name.first));

        crearTabla();
        ponerUsuario(ordenadosHombres, ordenadosMujeres);
    };
    btn.addEventListener('click', orden);


}

function verViejos() {

    let anio = document.getElementById("aniosRegistrado");
    let btn = document.getElementById("verViejos");
    let mujeresV = [];
    let hombresV = [];



    const sacar = () => {
        if (validarNumero(anio.value)){
            anio.value = "";
            return ;
        }
        mujeresV = []
        hombresV = []

        for (let i = 0; i < mujeres.length; i++) {
            if (mujeres[i].registered.age > anio.value) {
                mujeresV.push(mujeres[i]);
            }

        }

        for (let i = 0; i < hombres.length; i++) {
            if (hombres[i].registered.age > anio.value) {
                hombresV.push(hombres[i]);
            }

        }

        console.log(hombresV, mujeresV)
        crearTabla();
        ponerUsuario(hombresV, mujeresV);
        console.log(anio.value)
    }

    btn.addEventListener('click', sacar);

}

function validarNumero(valor){
    if(valor < 0 || valor == null || isNaN(valor) || valor == ""){
        alert("Numero ingresado no valido.");
        return true;
    }
    return false;
}