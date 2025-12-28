/* JavaScript para el modal de certificados  - Borja (28 dic 2025 13:18)*/

/* Función de efecto de máquina de escribir para el título principal - Borja (28 dic 2025 13:50) */
document.addEventListener("DOMContentLoaded", () => {
  const text = "Vitrina de certificados";
  const speed = 80; // milisegundos
  const target = document.getElementById("typing");

  if (!target) return; // evita errores si no existe

  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      target.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }

  typeWriter();
});


/* Función para abrir el modal con la imagen del certificado - Borja (28 dic 2025 13:18) */
window.verCertificado = function (imagen) {
  document.getElementById("img-modal").src = imagen;
  document.getElementById("modal").style.display = "block";
};

/* Funciones para cerrar el modal.  - Borja (28 dic 2025 13:18) */
  /* Función para cerrar el modal aprentando la X - Borja (28 dic 2025 13:18) */
  window.cerrarModal = function () {
    document.getElementById("modal").style.display = "none";
  };

  /* Función para cerrar el modal al hacer clic fuera de la imagen - Borja (28 dic 2025 13:18) */
  window.onclick = function(event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
      cerrarModal();
    }
  }
  /* Función para c errar el modal al presionar la tecla ESC - Borja (28 dic 2025 13:18) */
  document.addEventListener("keydown", function(event) {
    if(event.key === "Escape") {
      cerrarModal();
    }
  });
