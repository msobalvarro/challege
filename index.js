const { Buffer } = require("buffer")

/**
 * Funcion que valida los argumentos de forma individual
 * *(esta funcion no retorna ningu dato)*
 */
const ValidateSingleOperation = (singleOperation = { start, length, callback }) => new Promise((resolve, reject) => {
  try {
    // validaremos el atributo start 
    if (!singleOperation.start) {
      throw String(`Start Value is required`)
    }    

    // validaremos el atributo length 
    if (!singleOperation.length) {
      throw String(`Length Value is required`)
    }

    // validamos los tipos de formatos
    if (typeof singleOperation.start !== "number" || typeof singleOperation.length !== "number") {
      throw String("Start value or length value is not a number")
    }

    // validaremos el atributo callback
    if (!singleOperation.callback) {
      throw String(`Callback Value is required`)
    }

    resolve()
  } catch (error) {
    reject(error.toString())
  }
})


/**
 * Funcion que valida el tipo de operacion,
 * esta funcion se encarga de identificar el tipo de datos
 * que recibiremos como argunmentos en al funcion `read`
 * esta promesa siempre retornara un arreglo o un error
 */

const ValidateOperations = (operation) => new Promise(async (resolve, reject) => {
  try {
    // verificaremos si es una lista de procesos
    // tipo de objeto `Arreglo`
    if (Array.isArray(operation)) {
      // resolve()

      // mapearemos los datos para validar los atributos
      // O: Datos de operacion individual
      // _i: Inidice de la operacion
      // Este proceso valida los atributos de forma unica
      await operation.map(async o => await ValidateSingleOperation(o))

      // terminado el mapping del arreglo, retornaremos el arreglo validado
      resolve(operation)
    } else if (typeof operation === "object") { // validaremos si es un objeto
      // validaremos el atributo de la operacion
      await ValidateSingleOperation(operation)

      // Esta operacion if nos indica si el `object`
      // contiene los atributos correcto
      // asi que retornaremos un arreglo con esta operacion 
      resolve([operation])
    } else {
      // si no es ninguno
      throw String(`Argument is data type ${typeof operation}`)
    }
  } catch (error) {
    // reject errror
    reject(error.toString())
  }
})


/**
* operation to read from specific amount of bytes starting at a given position
* and executes the provided callback with the read payload
*
* @param start start register
* @param length amount of bytes to read (important: maxi mum length is 10!)
* @param callback the callback receives the read payload of type Buffer as parameter
*/
const read = async (operations = [] || {}) => {
  try {
    const operationsValidated = await ValidateOperations(operations)

    // mapearemos las operaciones
    for (const operation_index in operationsValidated) {
      // Asignaremos la operacion
      const data = operationsValidated[operation_index]

      // creamos el contenedor de los buffer
      // empezamos que con el bloque incial
      const BlocksArray = []

      // Sumamos los bloques
      const totalLength = (data.start + data.length)

      // calcularemos el rango
      // si la base es 3  y el rango es 2
      // tendremos que construir algo asi -> [3, 4, 5]
      for (let base = data.start; base <= totalLength; base++) {
        BlocksArray.push(base)
      }

      // Buscamos el buffer de los bloues
      const b = Buffer.from(BlocksArray)

      // Ejecutamos el callback del bloque indicado
      data.callback(b)
    }
  } catch (error) {
    console.log(`Error in buffer: ${error.toString()}`)
  }
}


// console.log()

// En este ejemplo podremos ejecutar la funcnion read
// cuantas veces querramos pansando solo un dato como objeto
new Array(10).fill(2).map((value, index) => read({ 
  start: (index * value), 
  length: (index * value)  * 3,
  callback: (data) => console.log(data)
}))

// En este ejemplo podremos que pasaremos muchos elementos
// dentro de un arreglo, esto es para ejecutar una vez
// la funcion `read` con muchos datos a la vez
// read([{ start: 3, length: 1, callback: (data) => console.log(data) }, { start: 1, length: 2, callback: (data) => console.log(data) }])