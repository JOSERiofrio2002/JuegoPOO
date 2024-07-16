# JuegoPOO

**Integrantes:** 

- Nathaly Nikooll Camacho Ordoñez. 
- Iván Alexander Fernandez Cañar. 
- José Francisco Riofrío Maldonado. 
- Ariana Sophía Sarango Tandazo.

**Ciclo:**

- Segundo "A"

# Diagrama UML
![UML.jpeg](UML.jpeg)

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

### **Clases Principales**

#### **Jugador**
- **Métodos:**
  - `+realizarMovimientos() : void`
- **Descripción:**
  La clase que representa al jugador del juego, encargada de realizar movimientos en el juego.

#### **JuegoPrincipal**
- **Atributos:**
  - `+Tablero : string`
  - `+piezaActual : string`
  - `+puntuacion : string`
- **Métodos:**
  - `+iniciar() : void`
  - `+pausar() : void`
  - `+pararJuego() : void`
- **Descripción:**
  La clase principal que controla el flujo del juego. Maneja el tablero, la pieza actual, y la puntuación del jugador.

#### **Tablero**
- **Atributos:**
  - `+ancho : int`
  - `+alto : int`
  - `+bloque : string`
- **Métodos:**
  - `+agregarPieza() : void`
  - `+eliminarLineas() : void`
  - `+finJuego() : void`
- **Descripción:**
  Representa el tablero de juego donde las piezas caen. Controla las dimensiones y los bloques ocupados.

#### **Pieza**
- **Atributos:**
  - `+bloques : string`
  - `+posicion : string`
  - `+forma : string`
  - `+color : string`
- **Métodos:**
  - `+rotar() : string`
  - `+moverIzquierda() : string`
  - `+moverDerecha() : string`
  - `+moverAbajo() : string`
- **Descripción:**
  Modela las piezas que caen en el tablero. Puede rotar y moverse en distintas direcciones.

#### **Bloque**
- **Atributos:**
  - `+color : string`
  - `+posicion`
- **Descripción:**
  Representa un bloque individual dentro de una pieza. Cada pieza está compuesta por varios bloques.

#### **Posicion**
- **Atributos:**
  - `+x : int`
  - `+y : int`
- **Métodos:**
  - `+establecePosicion() : int`
- **Descripción:**
  Define la posición de un bloque o una pieza en el tablero usando coordenadas (x, y).

#### **Puntuacion**
- **Atributos:**
  - `+puntuacionActual : int`
  - `+puntuacionFinal : int`
- **Métodos:**
  - `+reiniciar() : void`
  - `+mostrarPuntajeFinal() : int`
- **Descripción:**
  Maneja la puntuación del juego. Puede reiniciarse y mostrar la puntuación final.

### **Relaciones**

#### **Jugador y JuegoPrincipal**
- **Relación de asociación:** `Jugador` puede participar en uno o más (`1..*`) `JuegoPrincipal`.

#### **JuegoPrincipal y Tablero**
- **Relación de composición:** `JuegoPrincipal` contiene un `Tablero`.

#### **JuegoPrincipal y Puntuacion**
- **Relación de composición:** `JuegoPrincipal` contiene una `Puntuacion`.

#### **Tablero y Pieza**
- **Relación de composición:** `Tablero` contiene varias (`1..*`) `Pieza`.

#### **Pieza y Bloque**
- **Relación de composición:** `Pieza` está compuesta por varios (`1..*`) `Bloque`.

#### **Pieza y Posicion**
- **Relación de composición:** `Pieza` tiene varias (`1..*`) `Posicion`.
