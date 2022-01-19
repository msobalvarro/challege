# Coding Challenge `“industrialProtocol.read()”`

El desafío es implementar una función que maneje de manera eficiente las llamadas de una operación de lectura para un protocolo industrial. El lenguaje de programación que se utilizará es Python, ¡puede ser la versión 2 o 3!

## Contexto

Tenemos un dispositivo común que aloja memoria en 4096 bloques, enumerados del 0 al 4095. Para acceder a una sección de memoria del dispositivo existe una función ya implementada “read(start, length, callback)” que recibe como parámetros, el número de bloque de partida, el largo del buffer a leer y retorna una lista de largo del segmento a leer, donde cada elemento corresponde a la información de un bloque.

Llamar a esta función tiene un costo computacional alto, y su costo también aumenta según la cantidad de bloques a leer.

El problema está en que cada cierta cantidad de tiempo se acumulan solicitudes para leer memoria del dispositivo, y queremos responder a todas, entregando la información que contienen los bloques solicitados, sujeto a las restricciones de:

 * Minimizar la cantidad de llamadas a la función “read”.
 * No leer bloques que no han sido solicitados.

### Dado

```py
# operation to read from specific amount of bytes starting at a given position
# and executes the provided callback with the read payload @param start start register
# @param length amount of bytes to read (important: maximum length is 10!)
# @param callback the callback receives the read payload of type Buffer as parameter

def industrialProtocol.read(start, length, callback):
```

## Implementar
Implementar un algoritmo que lea múltiples valores desde el dispositivo y se lo entregue a la respectiva función de callback en la forma más eficiente posible. El método que construyas, debe ser simple de usar.

Para esto tendrás que implementar una función que recibe como argumentos, una lista de tuplas, donde la lista representa las solicitudes de lectura y donde cada tupla indica (start, length, callback). Donde callback corresponde a la función que debe ser ejecutada en la salida de cada payload de la solicitud, y (start, length) indican el segmento a leer, incluido el bloque con índice “start”. Como output debe ejecutar cada callback con el payload del buffer correspondiente, independiente de la forma de lectura en que se haya completado..

Dentro de esta función tendrás que ver cómo organizar las llamadas a la función read, y resolver como armar el retorno de la función.


## Funcion base

Considerar una situación en la que se obtengan regularmente los registros de interés.
Consideremos que el método "read" es de lectura lenta y costosa, así que intente reducir la cantidad de veces que es llamada al mínimo, agregando múltiples lecturas, en menores operaciones (agrupar lecturas).

```py
# @param inputList List of values to read: [{3, 5, callbackA}, {5, 7, callbackB}]

def yourFunction(inputList):
```


## Ejemplo de agregación:

```py
inputList = [{3, 5, cb1}, {5, 7, cb2}]

industrialProtocol.read(3, 5, cb1) & industrialProtocol.read(5, 7, cb2)
Aggregation: industrialProtocol.read(3, 9) ➔ cb1(payload1) & cb2(payload2)
```

Asegúrese de que cada callback sea ejecutado con el payload correcto.

El payload de cada callback sería una lista de largo “length” (parámetro de la función) con el contenido leido de los bloques correspondientes al buffer requerido.