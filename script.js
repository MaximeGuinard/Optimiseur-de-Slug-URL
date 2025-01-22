document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('text-input');
    const slugOutput = document.getElementById('slug-output');
    const copyButton = document.getElementById('copy-button');
    const options = {
        lowercase: document.getElementById('lowercase'),
        removeAccents: document.getElementById('remove-accents'),
        removeSpecial: document.getElementById('remove-special'),
        trimSpaces: document.getElementById('trim-spaces'),
        removeNumbers: document.getElementById('remove-numbers'),
        maxLength: document.getElementById('max-length'),
        maxLengthValue: document.getElementById('max-length-value')
    };

    function createSlug(text, options) {
        let slug = text;
        
        // Convertir en minuscules si l'option est activée
        if (options.lowercase) {
            slug = slug.toLowerCase();
        }
        
        // Supprimer les espaces au début et à la fin
        if (options.trimSpaces) {
            slug = slug.trim();
        }
        
        // Remplacer les accents si l'option est activée
        if (options.removeAccents) {
            slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
        
        // Supprimer les chiffres si l'option est activée
        if (options.removeNumbers) {
            slug = slug.replace(/[0-9]/g, '');
        }
        
        // Remplacer les caractères spéciaux si l'option est activée
        if (options.removeSpecial) {
            slug = slug.replace(/[^a-zA-Z0-9\s-]/g, '');
        }
        
        // Remplacer les espaces par des tirets
        slug = slug.replace(/\s+/g, '-');
        
        // Nettoyer les tirets multiples
        slug = slug.replace(/-+/g, '-');
        
        // Limiter la longueur si l'option est activée
        if (options.maxLength > 0 && slug.length > options.maxLength) {
            slug = slug.substring(0, options.maxLength);
            const lastSeparator = slug.lastIndexOf('-');
            if (lastSeparator !== -1) {
                slug = slug.substring(0, lastSeparator);
            }
        }
        
        // Supprimer les tirets au début et à la fin
        slug = slug.replace(/^-+|-+$/g, '');
        
        return slug;
    }

    function generateSlugs(text) {
        const currentOptions = {
            lowercase: options.lowercase.checked,
            removeAccents: options.removeAccents.checked,
            removeSpecial: options.removeSpecial.checked,
            trimSpaces: options.trimSpaces.checked,
            removeNumbers: options.removeNumbers.checked,
            maxLength: options.maxLength.checked ? parseInt(options.maxLengthValue.value) : 0
        };

        // Traiter chaque ligne séparément
        const lines = text.split('\n');
        const slugs = lines
            .filter(line => line.trim())
            .map(line => createSlug(line, currentOptions));
        
        slugOutput.value = slugs.join('\n');
    }

    // Événements pour la génération des slugs
    textInput.addEventListener('input', () => {
        if (textInput.value.trim()) {
            generateSlugs(textInput.value);
        } else {
            slugOutput.value = '';
        }
    });

    // Événements pour les options
    Object.values(options).forEach(option => {
        option.addEventListener('change', () => {
            if (textInput.value.trim()) {
                generateSlugs(textInput.value);
            }
        });
    });

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
            console.error('Erreur de copie:', err.message);
        }
    });
});