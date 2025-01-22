function createSlug(text, options = {}) {
  const {
    lowercase = true,
    removeAccents = true,
    removeSpecial = true,
    trimSpaces = true,
    removeNumbers = false,
    maxLength = 0
  } = options;

  let slug = text;

  // Convertir en minuscules si l'option est activée
  if (lowercase) {
    slug = slug.toLowerCase();
  }

  // Supprimer les espaces au début et à la fin
  if (trimSpaces) {
    slug = slug.trim();
  }

  // Remplacer les accents si l'option est activée
  if (removeAccents) {
    slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // Supprimer les chiffres si l'option est activée
  if (removeNumbers) {
    slug = slug.replace(/[0-9]/g, '');
  }

  // Remplacer les caractères spéciaux si l'option est activée
  if (removeSpecial) {
    slug = slug.replace(/[^a-zA-Z0-9\s-]/g, '');
  }

  // Remplacer les espaces par des tirets
  slug = slug.replace(/\s+/g, '-');

  // Nettoyer les tirets multiples
  slug = slug.replace(/-+/g, '-');

  // Limiter la longueur si l'option est activée
  if (maxLength > 0 && slug.length > maxLength) {
    // Couper au dernier tiret pour éviter de couper un mot
    slug = slug.substr(0, maxLength);
    const lastSeparatorIndex = slug.lastIndexOf('-');
    if (lastSeparatorIndex !== -1) {
      slug = slug.substr(0, lastSeparatorIndex);
    }
  }

  // Supprimer les tirets au début et à la fin
  slug = slug.replace(/^-+|-+$/g, '');

  // Ajouter le préfixe https://[DOMAIN]/
  return `https://[DOMAIN]/${slug}`;
}

// Éléments du DOM
const textInput = document.querySelector('#text-input');
const slugOutput = document.querySelector('#slug-output');
const copyButton = document.querySelector('#copy-button');
const lowercaseCheckbox = document.querySelector('#lowercase');
const removeAccentsCheckbox = document.querySelector('#remove-accents');
const removeSpecialCheckbox = document.querySelector('#remove-special');
const trimSpacesCheckbox = document.querySelector('#trim-spaces');
const removeNumbersCheckbox = document.querySelector('#remove-numbers');
const maxLengthCheckbox = document.querySelector('#max-length');
const maxLengthValue = document.querySelector('#max-length-value');

// Fonction de mise à jour des slugs
function updateSlug() {
  const options = {
    lowercase: lowercaseCheckbox.checked,
    removeAccents: removeAccentsCheckbox.checked,
    removeSpecial: removeSpecialCheckbox.checked,
    trimSpaces: trimSpacesCheckbox.checked,
    removeNumbers: removeNumbersCheckbox.checked,
    maxLength: maxLengthCheckbox.checked ? parseInt(maxLengthValue.value) : 0
  };
  
  // Traiter chaque ligne séparément
  const lines = textInput.value.split('\n');
  const slugs = lines.map(line => createSlug(line, options));
  
  // Filtrer les lignes vides et joindre les résultats
  slugOutput.value = slugs.filter(slug => slug.length > 0).join('\n');
}

// Écouteurs d'événements
textInput.addEventListener('input', updateSlug);
lowercaseCheckbox.addEventListener('change', updateSlug);
removeAccentsCheckbox.addEventListener('change', updateSlug);
removeSpecialCheckbox.addEventListener('change', updateSlug);
trimSpacesCheckbox.addEventListener('change', updateSlug);
removeNumbersCheckbox.addEventListener('change', updateSlug);
maxLengthCheckbox.addEventListener('change', updateSlug);
maxLengthValue.addEventListener('input', updateSlug);

// Fonction de copie
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(slugOutput.value);
    const originalText = copyButton.textContent;
    copyButton.textContent = '✓';
    setTimeout(() => {
      copyButton.textContent = originalText;
    }, 1000);
  } catch (err) {
    console.error('Erreur lors de la copie :', err);
  }
});

// Initialisation
updateSlug();