
/**
 * Funcion que valida los argumentos de forma individual
 * *(esta funcion no retorna ningu dato)*
 */
const ValidateSingleOperation = (singleOperation = {}) => new Promise((resolve, reject) => {
  try {
    // validaremos el atributo start 
    if (!singleOperation.start) {
      throw String(`Start Value is requires`)
    }

    // validaremos el atributo length 
    if (!singleOperation.length) {
      throw String(`Length Value is requires`)
    }

    // validaremos el atributo callback
    if (!singleOperation.callback) {
      throw String(`Callback Value is requires`)
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
      // empecamos que con el blocke incial
      const BlocksArray = []

      // let BlockNumber = data.start

      const totalLength = (data.start + data.length)

      // calcularemos el rango
      // si la base es 3  y el rango es 2
      // tendremos que construir algo asi -> [3, 4, 5]
      for (let base = data.start; base <= totalLength; base++) {
        console.log(base)

        BlocksArray.push(base)
      }

      data.callback(BlocksArray)
    }
  } catch (error) {
    console.log(`Error in buffer: ${error.toString()}`)
  }
}


// console.log()

read([{ start: 3, length: 1, callback: (data) => console.log(data) }, { start: 1, length: 2, callback: (data) => console.log(data) }])