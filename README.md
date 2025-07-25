# Buzzer WebRTC 🔴

Un sistema de buzzer o pulsador en tiempo real construido con React y WebRTC. Permite a un anfitrión crear una sala y a múltiples invitados unirse a través de un código QR para competir por quién presiona el botón más rápido.

[**Ver Demo en Vivo**](https://pablogguizar.github.io/buzzer-webrtc/)

## Funcionamiento

La aplicación tiene dos roles principales:

1. **Anfitrión:**

   * Al iniciar la aplicación, se le asigna un ID de conexión único a través de un servidor de señalización de PeerJS.

   * Muestra este ID en forma de **código QR** y también en texto.

   * Recibe conexiones directas de los invitados y muestra una lista de los participantes unidos.

   * Cuando los invitados presionan el buzzer, el anfitrión recibe los eventos en tiempo real y muestra una clasificación ordenada de quién presionó primero.

   * Puede reiniciar la ronda para todos los participantes.

2. **Invitado:**

   * Se une a la sala escaneando el código QR del anfitrión o introduciendo su ID manualmente.

   * Una vez conectado, ve un gran botón de "BUZZ!".

   * Al presionarlo, su nombre se envía al anfitrión para entrar en la clasificación. El botón se deshabilita para ese invitado hasta que la ronda sea reiniciada.

   * Puede ver la clasificación en tiempo real en su propia pantalla.

La comunicación es **peer-to-peer** (directa entre anfitrión e invitados) gracias a **WebRTC (PeerJS)**, lo que la hace muy rápida y eficiente.

## Características

* **Conexión en Tiempo Real:** Latencia mínima gracias a WebRTC.

* **Conexión por QR:** Sistema fácil y rápido para que los invitados se unan desde sus móviles.

* **Clasificación Ordenada:** Muestra el orden exacto en que los participantes presionaron el buzzer.

* **Lista de Participantes:** El anfitrión puede ver quién está conectado a la sala.

* **Estilo Retro Gamer:** Interfaz inspirada en los videojuegos clásicos tipo Atari.

* **Desplegado en GitHub Pages:** Configurado para una fácil implementación y acceso público.

## Tecnologías Utilizadas

* [**React**](https://react.dev/) (con [Vite](https://vitejs.dev/))

* [**PeerJS**](https://peerjs.com/) (para la capa de abstracción sobre WebRTC)

* [**react-qr-code**](https://github.com/rosskhanas/react-qr-code) (para generar los códigos QR)

* [**Tone.js**](https://tonejs.github.io/) (para la generación del sonido del buzzer en el navegador)

## Instalación y Uso Local

1. **Clona el repositorio:**

   ```
   git clone [https://github.com/PabloGGuizar/buzzer-webrtc.git](https://github.com/PabloGGuizar/buzzer-webrtc.git)
   cd buzzer-webrtc
   
   ```

2. **Instala las dependencias:**

   ```
   npm install
   
   ```

3. **Inicia el servidor de desarrollo:**

   ```
   npm run dev
   
   ```

   La aplicación estará disponible en `http://localhost:5173`.

## Despliegue

Este proyecto está configurado para ser desplegado fácilmente en GitHub Pages con el siguiente comando:

```
npm run deploy

```

## Limitaciones

El límite de invitados no está programado, sino que depende de los recursos del **dispositivo y la red del anfitrión**.

* **Arquitectura:** Cada invitado establece una conexión directa con el anfitrión.

* **Cuello de Botella:** El **ancho de banda de subida** y la **CPU** del anfitrión son los principales factores limitantes. El anfitrión debe enviar una copia de cada actualización a todos los participantes.

* **Límite Práctico:** En una red doméstica y una computadora moderna, la aplicación debería funcionar de manera estable con **20 a 50 participantes**. Más allá de esa cifra, podría empezar a notarse latencia o desconexiones.

## Créditos y Comunidad

La idea y desarrollo de **Buzzer WebRTC** fue realizada por **Juan Pablo Guízar** ([PabloGGuizar](https://github.com/PabloGGuizar)) con ayuda de **Gemini**.

El repositorio de este proyecto se encuentra en: [GitHub - PabloGGuizar/buzzer-webrtc](https://github.com/PabloGGuizar/buzzer-webrtc).

Este proyecto está indexado en el **Repositorio de aplicaciones educativas**, una colección de recursos creados por la comunidad **Vibe Coding Educativo**.

Consulta más aplicaciones de esta comunidad en: [Repositorio Vibe Coding Educativo](https://vceduca.github.io/repositorio-vceduca/).

Únete a la comunidad en Telegram: [t.me/vceduca](https://t.me/vceduca).

Este proyecto se adhiere al [Decálogo del Conocimiento Abierto](https://vceduca.github.io/decalogo-vceduca/).

## Licencia

Este proyecto está bajo la licencia [Creative Commons Atribución 4.0 Internacional](https://creativecommons.org/licenses/by/4.0/).