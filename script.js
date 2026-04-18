/* ============================================================
   VARIABLES GLOBALES — nuevas
   ============================================================ */
let longitud = 16;
let contador = 1;
let passGenerada = '';
let mostrarPass = false;
let entradasGuardadas = [];

/* ============================================================
   REFERENCIAS AL DOM
   ============================================================ */
const passwordInput = document.getElementById('passwordInput');

/* ============================================================
   OBJETO DE REQUISITOS 
   ============================================================ */
const requirements = [
    { regex: /.{8,}/,        element: document.getElementById('length') },
    { regex: /[A-Z]/,        element: document.getElementById('uppercase') },
    { regex: /[a-z]/,        element: document.getElementById('lowercase') },
    { regex: /[0-9]/,        element: document.getElementById('number') },
    { regex: /[^A-Za-z0-9]/, element: document.getElementById('special') }
];

/* ============================================================
   ESCUCHA EN TIEMPO REAL 
   ============================================================ */
passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    let completedRequirements = 0;

    // Evaluamos cada criterio 
    requirements.forEach(item => {
        const isValid = item.regex.test(value);

        if (isValid) {
            item.element.classList.add('valid');
            completedRequirements++;
        } else {
            item.element.classList.remove('valid');
        }
    });

    // Actualizamos barra visual 
    updateBar(completedRequirements);
});

/* ============================================================
   FUNCIÓN BARRA DE FORTALEZA 
   ============================================================ */
function updateBar(count) {
    const percentages = ['0%', '20%', '40%', '60%', '80%', '100%'];
    const colors = ['transparent', '#ff4d4d', '#ffad33', '#ffff4d', '#99ff33', '#2eb82e'];

    const bar = document.getElementById('progressBar');
    bar.style.width = percentages[count];
    bar.style.backgroundColor = colors[count];
}

/* ============================================================
   FUNCIONES NUEVAS — generador
   ============================================================ */

/** Ajusta la longitud de la contraseña a generar */
function ajustarLongitud(delta) {
    longitud = Math.max(4, Math.min(64, longitud + delta));
    document.getElementById('longitud-val').textContent = longitud;
}

/** Ajusta el contador */
function ajustarContador(delta) {
    contador = Math.max(1, Math.min(99, contador + delta));
    document.getElementById('contador-val').textContent = contador;
}

/** Construye el charset según los checkboxes marcados */
function obtenerCharset() {
    let charset = '';
    if (document.getElementById('opt-lower').checked) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (document.getElementById('opt-upper').checked) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (document.getElementById('opt-num').checked)   charset += '0123456789';
    if (document.getElementById('opt-spec').checked)  charset += '!@#$%^&*()-_=+[]{}';
    return charset || 'abcdefghijklmnopqrstuvwxyz';
}

/** Genera una contraseña aleatoria con las opciones actuales */
function generarContrasena() {
    const charset = obtenerCharset();
    let pass = '';
    for (let i = 0; i < longitud; i++) {
        pass += charset[Math.floor(Math.random() * charset.length)];
    }
    passGenerada = pass;

    const salida = document.getElementById('salidaPass');
    salida.textContent = mostrarPass ? pass : '•'.repeat(pass.length);
    return pass;
}

/** Genera la contraseña y la copia al portapapeles */
function generarYCopiar() {
    const pass = generarContrasena();
    navigator.clipboard.writeText(pass).catch(() => {});
    mostrarToast();

    const msg = document.getElementById('message');
    msg.textContent = '¡Contraseña generada y copiada!';
    msg.className = 'success';
    setTimeout(() => { msg.textContent = ''; }, 2000);
}

/** Copia la contraseña ya generada */
function copiarSalida() {
    if (!passGenerada) return;
    navigator.clipboard.writeText(passGenerada).catch(() => {});
    mostrarToast();
}

/** Muestra el toast de "¡Copiado!" por 1.5 segundos */
function mostrarToast() {
    const toast = document.getElementById('toast');
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 1500);
}

/** Alterna entre mostrar y ocultar la contraseña generada */
function alternarVista() {
    mostrarPass = !mostrarPass;
    const salida = document.getElementById('salidaPass');
    if (passGenerada) {
        salida.textContent = mostrarPass ? passGenerada : '•'.repeat(passGenerada.length);
    }
}

/** Guarda la entrada actual en la lista */
function guardarEntrada() {
    const sitio = document.getElementById('sitio').value.trim();
    const user  = document.getElementById('usuario').value.trim();
    // Usa la contraseña generada, o si no hay, la que escribió manualmente
    const passAGuardar = passGenerada || document.getElementById('passwordInput').value.trim();

    if (!sitio) {
        const msg = document.getElementById('message');
        msg.textContent = 'Escribe el nombre del sitio antes de guardar.';
        msg.className = 'error';
        setTimeout(() => { msg.textContent = ''; }, 2000);
        return;
    }
    if (!passAGuardar) {
        const msg = document.getElementById('message');
        msg.textContent = 'Escribe o genera una contraseña antes de guardar.';
        msg.className = 'error';
        setTimeout(() => { msg.textContent = ''; }, 2000);
        return;
    }

    entradasGuardadas.push({ sitio, usuario: user, pass: passAGuardar });

    const msg = document.getElementById('message');
    msg.textContent = '¡Guardada correctamente!';
    msg.className = 'success';
    setTimeout(() => { msg.textContent = ''; }, 2000);
}

/** Limpia todos los campos */
function limpiarTodo() {
    document.getElementById('sitio').value        = '';
    document.getElementById('usuario').value      = '';
    document.getElementById('passwordInput').value = '';
    passGenerada = '';
    mostrarPass  = false;
    document.getElementById('salidaPass').textContent = '••••••••••••••••';
    document.getElementById('message').textContent    = '';
    updateBar(0);

    // Resetear también los requisitos visuales
    requirements.forEach(item => item.element.classList.remove('valid'));
}

/* ============================================================
   FUNCIONES DE PESTAÑAS — nueva
   ============================================================ */

/** Cambia entre el panel Generador y Lista */
function cambiarPestana(nombre) {
    // Paneles
    document.getElementById('panel-generador').classList.toggle('active', nombre === 'generador');
    document.getElementById('panel-lista').classList.toggle('active', nombre === 'lista');

    // Botones de pestaña
    document.getElementById('tab-generador').classList.toggle('active', nombre === 'generador');
    document.getElementById('tab-lista').classList.toggle('active', nombre === 'lista');

    if (nombre === 'lista') renderizarLista();
}

/** Renderiza la lista de contraseñas guardadas */
function renderizarLista() {
    const contenedor = document.getElementById('lista-container');

    if (!entradasGuardadas.length) {
        contenedor.innerHTML = '<p class="estado-vacio">Aún no hay contraseñas guardadas. Genera y guarda una primero.</p>';
        return;
    }

    contenedor.innerHTML = entradasGuardadas.map((entrada, i) => `
        <div class="lista-item" id="item-${i}">
            <div style="flex:1" id="vista-${i}">
                <div class="lista-sitio">${entrada.sitio}</div>
                <div class="lista-usuario">${entrada.usuario || '(sin usuario)'}</div>
                <div class="lista-pass" id="pass-texto-${i}" style="font-size:12px; color:#888; letter-spacing:1px;">••••••••</div>
            </div>
            <div id="edicion-${i}" style="display:none; flex:1; gap:6px; flex-direction:column">
                <input class="campo-input" id="edit-sitio-${i}" value="${entrada.sitio}" placeholder="Sitio">
                <input class="campo-input" id="edit-usuario-${i}" value="${entrada.usuario}" placeholder="Usuario">
                <input class="campo-input" id="edit-pass-${i}" value="${entrada.pass}" placeholder="Contraseña">
            </div>
            <button class="icono-btn" title="Mostrar contraseña" onclick="alternarVistaLista(${i})">👁</button>
            <button class="icono-btn" title="Copiar" onclick="copiarEntrada(${i})">⧉</button>
            <button class="icono-btn" title="Editar" id="btn-editar-${i}" onclick="alternarEdicion(${i})">✏️</button>
            <button class="icono-btn" title="Eliminar" onclick="eliminarEntrada(${i})">🗑️</button>
        </div>
    `).join('');
}

/** Copia la contraseña de una entrada guardada */
function copiarEntrada(indice) {
    navigator.clipboard.writeText(entradasGuardadas[indice].pass).catch(() => {});
    mostrarToast();
}

function eliminarEntrada(indice) {
    entradasGuardadas.splice(indice, 1);
    renderizarLista();
}
/** gstiona la contraseña guardada */
function alternarEdicion(indice) {
    const vista   = document.getElementById(`vista-${indice}`);
    const edicion = document.getElementById(`edicion-${indice}`);
    const btn     = document.getElementById(`btn-editar-${indice}`);
    const editando = edicion.style.display === 'none';

    if (editando) {
        vista.style.display   = 'none';
        edicion.style.display = 'flex';
        btn.textContent       = '💾';
        btn.title             = 'Guardar cambios';
    } else {
        // Guardar los cambios editados
        entradasGuardadas[indice].sitio   = document.getElementById(`edit-sitio-${indice}`).value.trim();
        entradasGuardadas[indice].usuario = document.getElementById(`edit-usuario-${indice}`).value.trim();
        entradasGuardadas[indice].pass    = document.getElementById(`edit-pass-${indice}`).value.trim();
        renderizarLista();
    }
}
function alternarVistaMaestra() {
    const campo = document.getElementById('passwordInput');
    campo.type = campo.type === 'password' ? 'text' : 'password';
}
function alternarVistaLista(indice) {
    const el = document.getElementById(`pass-texto-${indice}`);
    el.textContent = el.textContent === '••••••••'
        ? entradasGuardadas[indice].pass
        : '••••••••';
}
