// Seleccionamos los elementos del DOM
const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('strength-bar');

// Objeto con las reglas y sus elementos de la lista
const requirements = [
    { regex: /.{8,}/, element: document.getElementById('length') },      // Para los 8+ caracteres
    { regex: /[A-Z]/, element: document.getElementById('uppercase') },   // Para la Mayúscula
    { regex: /[a-z]/, element: document.getElementById('lowercase') },   // Para la Minúscula
    { regex: /[0-9]/, element: document.getElementById('number') },      // Para el Número
    { regex: /[^A-Za-z0-9]/, element: document.getElementById('special') } // Esto es Especial
];

// Escuchamos la escritura en tiempo real
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

/**
 * Función para cambiar color y tamaño de la barra
 * @param {number} count - Cantidad de criterios cumplidos
 */
function updateBar(count) {
    const percentages = ['0%', '20%', '40%', '60%', '80%', '100%'];
    const colors = ['transparent', '#ff4d4d', '#ffad33', '#ffff4d', '#99ff33', '#2eb82e'];

    strengthBar.style.width = percentages[count];
    strengthBar.style.backgroundColor = colors[count];
}