/* ==========================================================================
   CULTIVA EN CASA — LÓGICA INTERACTIVA (JavaScript)
   Autor: Federico Moreno Villamizar (2026)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------------
    // 1. MANEJO DEL MENÚ HAMBURGUESA Y NAVEGACIÓN SPA
    // ----------------------------------------------------------------------
    const btnMenu = document.getElementById('btn-menu');
    const menuNavegacion = document.getElementById('menu-navegacion');
    const enlacesMenu = document.querySelectorAll('.enlace-menu');

    if (btnMenu && menuNavegacion) {
        btnMenu.addEventListener('click', () => {
            const estaAbierto = menuNavegacion.classList.contains('abierto');
            
            if (estaAbierto) {
                menuNavegacion.classList.remove('abierto');
                btnMenu.setAttribute('aria-expanded', 'false');
                menuNavegacion.setAttribute('aria-hidden', 'true');
            } else {
                menuNavegacion.classList.add('abierto');
                btnMenu.setAttribute('aria-expanded', 'true');
                menuNavegacion.setAttribute('aria-hidden', 'false');
            }
        });

        // Cierre automático al hacer clic en cualquier enlace del menú
        enlacesMenu.forEach(enlace => {
            enlace.addEventListener('click', () => {
                menuNavegacion.classList.remove('abierto');
                btnMenu.setAttribute('aria-expanded', 'false');
                menuNavegacion.setAttribute('aria-hidden', 'true');
            });
        });
    }

    // ----------------------------------------------------------------------
    // 2. ENCABEZADO INTELIGENTE (SMART HEADER ON SCROLL)
    // ----------------------------------------------------------------------
    let ultimoScrollY = window.scrollY;
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        const scrollActual = window.scrollY;
        
        // Evita ocultar si el menú está abierto
        if (menuNavegacion && menuNavegacion.classList.contains('abierto')) return;

        if (scrollActual > ultimoScrollY && scrollActual > 80) {
            // Deslizando hacia abajo: Ocultar sutilmente
            header.style.transform = 'translateY(-100%)';
        } else {
            // Deslizando hacia arriba: Mostrar de inmediato
            header.style.transform = 'translateY(0)';
        }
        ultimoScrollY = scrollActual;
    });

    // ----------------------------------------------------------------------
    // 3. ACTUALIZACIÓN VISUAL DE TACÓMETROS Y AGUJAS
    // ----------------------------------------------------------------------
    const agujaHumedad = document.getElementById('aguja-humedad');
    const valHumedadText = document.getElementById('val-humedad');
    const alertaHumedad = document.getElementById('alerta-humedad');

    const agujaTemperatura = document.getElementById('aguja-temperatura');
    const valTemperaturaText = document.getElementById('val-temperatura');

    // Función para convertir valores a grados (-90deg a +90deg)
    function actualizarHumedad(porcentaje) {
        if (!agujaHumedad || !valHumedadText) return;

        // Limitar rango de 0 a 100%
        const pct = Math.max(0, Math.min(100, porcentaje));
        valHumedadText.textContent = pct;

        // Mapeo: 0% -> -90deg (extrema izquierda), 100% -> +90deg (extrema derecha)
        const grados = (pct / 100) * 180 - 90;
        agujaHumedad.style.transform = `translateX(-50%) rotate(${grados}deg)`;

        // Evaluación de Alertas Excepcionales
        if (alertaHumedad) {
            if (pct < 30) {
                alertaHumedad.className = 'alerta-contenedor sequia';
                alertaHumedad.innerHTML = '⚠️ <strong>¡Alerta de Sequía!</strong> Humedad crítica en el suelo (<30%).';
            } else if (pct > 85) {
                alertaHumedad.className = 'alerta-contenedor encharcamiento';
                alertaHumedad.innerHTML = '🌊 <strong>¡Alerta de Encharcamiento!</strong> Riesgo de pudrición de raíz (>85%).';
            } else {
                alertaHumedad.className = 'alerta-contenedor oculta';
                alertaHumedad.innerHTML = '';
            }
        }
    }

    function actualizarTemperatura(celsius) {
        if (!agujaTemperatura || !valTemperaturaText) return;

        // Limitar rango de 0°C a 40°C
        const temp = Math.max(0, Math.min(40, celsius));
        valTemperaturaText.textContent = temp.toFixed(1);

        // Mapeo: 0°C -> -90deg, 40°C -> +90deg
        const grados = (temp / 40) * 180 - 90;
        agujaTemperatura.style.transform = `translateX(-50%) rotate(${grados}deg)`;
    }

    // Inicializar medidores con valores predeterminados (Óptimos)
    actualizarHumedad(65);
    actualizarTemperatura(21.5);

    // ----------------------------------------------------------------------
    // 4. CONTROL DE RIEGO MANUAL Y CONMUTADOR AUTOMÁTICO
    // ----------------------------------------------------------------------
    const btnRiego = document.getElementById('btn-riego');
    let enRiego = false;

    if (btnRiego) {
        btnRiego.addEventListener('click', () => {
            if (enRiego) return; // Evitar clics múltiples mientras riega

            enRiego = true;
            btnRiego.disabled = true;
            btnRiego.setAttribute('aria-pressed', 'true');
            
            let segundos = 15;
            btnRiego.innerHTML = `🚿 Regando (${segundos}s)...`;
            btnRiego.style.backgroundColor = '#2B6CB0'; // Azul indicando agua

            const cuentaRegresiva = setInterval(() => {
                segundos--;
                if (segundos > 0) {
                    btnRiego.innerHTML = `🚿 Regando (${segundos}s)...`;
                } else {
                    clearInterval(cuentaRegresiva);
                    enRiego = false;
                    btnRiego.disabled = false;
                    btnRiego.setAttribute('aria-pressed', 'false');
                    btnRiego.innerHTML = `<span class="icono-btn" aria-hidden="true">🚿</span> Activar Riego Manual`;
                    btnRiego.style.backgroundColor = ''; // Restablecer a verde bosque

                    // Al terminar el riego, simular subida de humedad al 70%
                    actualizarHumedad(70);
                }
            }, 1000);
        });
    }

    // ----------------------------------------------------------------------
    // 5. MÓDULO BETA (SIMULACIÓN DE EXCEPCIONES Y ALERTAS)
    // ----------------------------------------------------------------------
    const btnSimSequia = document.getElementById('btn-simular-sequia');
    const btnSimEncharcamiento = document.getElementById('btn-simular-encharcamiento');
    const btnSimReconexion = document.getElementById('btn-simular-reconexion');
    
    const estadoWifi = document.getElementById('estado-wifi');
    const textoWifi = document.getElementById('texto-wifi');

    if (btnSimSequia) {
        btnSimSequia.addEventListener('click', () => {
            actualizarHumedad(25); // Forzar 25% (Sequía)
            // Hacer scroll suave hacia el medidor
            document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (btnSimEncharcamiento) {
        btnSimEncharcamiento.addEventListener('click', () => {
            actualizarHumedad(90); // Forzar 90% (Encharcamiento)
            document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (btnSimReconexion) {
        btnSimReconexion.addEventListener('click', () => {
            if (!estadoWifi || !textoWifi) return;

            // Paso 1: Cambiar a estado "Leyendo sensores..."
            estadoWifi.className = 'estado-conexion';
            estadoWifi.style.color = '#F6AD55'; // Naranja lectura
            textoWifi.textContent = 'Leyendo sensores...';

            // Pausar agujas momentáneamente
            if (valHumedadText) valHumedadText.textContent = '--';
            if (valTemperaturaText) valTemperaturaText.textContent = '--';

            // Paso 2: Tras 3 segundos, simular desconexión definitiva de red
            setTimeout(() => {
                estadoWifi.className = 'estado-conexion desconectado';
                estadoWifi.style.color = '';
                textoWifi.textContent = 'Sensores: Desconectados';
            }, 3000);

            // Paso 3: Tras 6 segundos, simular reconexión exitosa
            setTimeout(() => {
                estadoWifi.className = 'estado-conexion en-linea';
                textoWifi.textContent = 'Sensores: En línea';
                actualizarHumedad(65);
                actualizarTemperatura(21.5);
            }, 6000);
        });
    }

    // ----------------------------------------------------------------------
    // 6. RENDERIZADO DEL GRÁFICO HISTÓRICO EN CANVAS NATIVO
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('grafico-lineas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        function dibujarGrafico() {
            // Ajustar resolución del canvas
            canvas.width = canvas.parentElement.clientWidth || 380;
            canvas.height = 180;

            const w = canvas.width;
            const h = canvas.height;

            ctx.clearRect(0, 0, w, h);

            // Datos simulados (Horas: 06:00, 09:00, 12:00, 15:00, 18:00, 21:00)
            const puntosHumedad = [75, 70, 62, 65, 68, 65];
            const puntosTemperatura = [17, 19, 23, 24, 21, 19];

            const pasoX = w / (puntosHumedad.length - 1);

            // Dibujar rejilla de fondo
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 1;
            for (let i = 1; i < 4; i++) {
                ctx.beginPath();
                ctx.moveTo(0, (h / 4) * i);
                ctx.lineTo(w, (h / 4) * i);
                ctx.stroke();
            }

            // Dibujar Línea de Humedad (Azul)
            ctx.beginPath();
            ctx.strokeStyle = '#2B6CB0';
            ctx.lineWidth = 3;
            puntosHumedad.forEach((val, i) => {
                const x = i * pasoX;
                const y = h - (val / 100) * h; // Escala 0-100%
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Dibujar Puntos de Humedad
            puntosHumedad.forEach((val, i) => {
                const x = i * pasoX;
                const y = h - (val / 100) * h;
                ctx.beginPath();
                ctx.fillStyle = '#2B6CB0';
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            });

            // Dibujar Línea de Temperatura (Verde)
            ctx.beginPath();
            ctx.strokeStyle = '#48BB78';
            ctx.lineWidth = 3;
            puntosTemperatura.forEach((val, i) => {
                const x = i * pasoX;
                const y = h - (val / 40) * h; // Escala 0-40°C
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        }

        dibujarGrafico();
        window.addEventListener('resize', dibujarGrafico);

        // Control de pestañas de tiempo (Diario, Semanal, etc.)
        const tabs = document.querySelectorAll('.btn-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('activa'));
                tab.classList.add('activa');
                dibujarGrafico(); // Redibujar gráfica al cambiar pestaña
            });
        });
    }

});