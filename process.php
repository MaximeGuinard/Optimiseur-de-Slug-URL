<?php
header('Content-Type: application/json');

function createSlug($text, $options) {
    $slug = $text;
    
    // Convertir en minuscules si l'option est activée
    if ($options['lowercase']) {
        $slug = mb_strtolower($slug, 'UTF-8');
    }
    
    // Supprimer les espaces au début et à la fin
    if ($options['trimSpaces']) {
        $slug = trim($slug);
    }
    
    // Remplacer les accents si l'option est activée
    if ($options['removeAccents']) {
        $slug = transliterator_transliterate('Any-Latin; Latin-ASCII', $slug);
    }
    
    // Supprimer les chiffres si l'option est activée
    if ($options['removeNumbers']) {
        $slug = preg_replace('/[0-9]/', '', $slug);
    }
    
    // Remplacer les caractères spéciaux si l'option est activée
    if ($options['removeSpecial']) {
        $slug = preg_replace('/[^a-zA-Z0-9\s-]/', '', $slug);
    }
    
    // Remplacer les espaces par des tirets
    $slug = preg_replace('/\s+/', '-', $slug);
    
    // Nettoyer les tirets multiples
    $slug = preg_replace('/-+/', '-', $slug);
    
    // Limiter la longueur si l'option est activée
    if ($options['maxLength'] > 0 && mb_strlen($slug) > $options['maxLength']) {
        $slug = mb_substr($slug, 0, $options['maxLength']);
        $lastSeparator = mb_strrpos($slug, '-');
        if ($lastSeparator !== false) {
            $slug = mb_substr($slug, 0, $lastSeparator);
        }
    }
    
    // Supprimer les tirets au début et à la fin
    $slug = trim($slug, '-');
    
    // Ajouter le préfixe https://[DOMAIN]/
    return 'https://[DOMAIN]/' . $slug;
}

try {
    if (!isset($_POST['text']) || !isset($_POST['options'])) {
        throw new Exception('Données manquantes');
    }

    $text = $_POST['text'];
    $options = json_decode($_POST['options'], true);
    
    if (!$options) {
        throw new Exception('Options invalides');
    }

    // Traiter chaque ligne séparément
    $lines = explode("\n", $text);
    $slugs = array_map(function($line) use ($options) {
        return createSlug($line, $options);
    }, array_filter($lines));

    echo json_encode([
        'success' => true,
        'slugs' => $slugs
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}