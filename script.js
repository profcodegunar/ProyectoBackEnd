document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const inputs = form.querySelectorAll("input[required], input[pattern]");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const meter = document.getElementById("strengthMeter");
  const result = document.getElementById("result");

  // Validación en tiempo real
  inputs.forEach(input => {
    input.addEventListener("input", () => validateInput(input));
  });

  // Evaluar fuerza de contraseña
  password.addEventListener("input", () => {
    const strength = getPasswordStrength(password.value);
    meter.value = strength;
  });

  // Validación al enviar formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;
    result.textContent = "";

    inputs.forEach(input => {
      if (!validateInput(input)) isValid = false;
    });

    // Validación de coincidencia de contraseñas
    if (password.value !== confirmPassword.value) {
      showError(confirmPassword, "Las contraseñas no coinciden.");
      isValid = false;
    }

    if (isValid) {
      result.textContent = "✅ Registro exitoso.";
      form.reset();
      meter.value = 0;
    }
  });

  // Función para validar campos individualmente
  function validateInput(input) {
    const errorEl = input.parentElement.querySelector(".error");
    let valid = true;

    if (input.validity.valueMissing) {
      showError(input, "Este campo es obligatorio.");
      valid = false;
    } else if (input.validity.tooShort) {
      showError(input, `Debe tener al menos ${input.minLength} caracteres.`);
      valid = false;
    } else if (input.type === "email" && input.validity.typeMismatch) {
      showError(input, "Introduce un correo electrónico válido.");
      valid = false;
    } else if (input.type === "tel" && input.pattern && !input.value.match(new RegExp(input.pattern))) {
      showError(input, "El teléfono debe tener entre 7 y 15 dígitos.");
      valid = false;
    } else if (input.id === "terms" && !input.checked) {
      showError(input, "Debes aceptar los términos.");
      valid = false;
    } else {
      clearError(input);
    }

    return valid;
  }

  // Mostrar mensaje de error
  function showError(input, message) {
    const errorEl = input.parentElement.querySelector(".error");
    if (errorEl) {
      errorEl.textContent = message;
      input.classList.add("invalid");
    }
  }

  // Limpiar mensaje de error
  function clearError(input) {
    const errorEl = input.parentElement.querySelector(".error");
    if (errorEl) {
      errorEl.textContent = "";
      input.classList.remove("invalid");
    }
  }

  // Evaluar fuerza de contraseña (0 a 4)
  function getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;
    return strength;
  }
});
