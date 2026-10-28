# Jessim Math Quest

Application pédagogique de mathématiques — niveau 4e.

## Ouvrir l’application

https://azdezed.github.io/jessim-math-quest/

Le code d’accès est transmis séparément par Akim. Aucun compte GitHub n’est nécessaire pour utiliser l’application.
Le dépôt est public et le code d’accès est vérifié dans le navigateur : ce dispositif ne protège pas le code source contre la récupération.

## Parcours

Tables de multiplication, fractions, carrés et racines, fondations géométriques et théorème de Pythagore.
Les visuels sont embarqués dans le dossier assets/.

## Publication

GitHub Pages, via GitHub Actions depuis main.
Le site publié contient uniquement index.html, .nojekyll et assets/.
Une modification sur main déclenche une nouvelle publication.

## Signature

Akim Zeboudj / AZ Consulting - Pédagogie

## Correctif V2.1 — 28 octobre 2026

- Cartes sans numéro avant sélection ; numérotation selon l’ordre des clics et renumérotation au retrait.
- Bouton pour recommencer la sélection.
- Indice après la première erreur, aide plus précise après la deuxième et correction à la troisième pour la compréhension, la procédure et le rappel.
- Réponse attendue explicite après trois erreurs dans les exercices et les micro-transferts.
- Les aides reçues sur la méthode sont prises en compte dans le bilan d’autonomie.

Vérification des régressions : `node tests/interaction-regressions.cjs`.
