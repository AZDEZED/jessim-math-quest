# Jessim Math Quest — V3

Application pédagogique de mathématiques, niveau 4e.

## Utilisation

https://azdezed.github.io/jessim-math-quest/

Le code d’accès est transmis séparément par Akim. Aucun compte GitHub n’est nécessaire.
Le dépôt est public : le contrôle du code d’accès dans le navigateur ne protège pas le code source.

## Parcours

- T1 : comprendre multiplication et division ; T2 : produits ; T3 : facteurs manquants ; T4 : mélange.
- C1 : comprendre carrés et racines ; C2 : carrés de 1 à 12 ; C3 : racines ; C4 : mélange.
- Entraînement continu, défis de 10, 20 ou 30 bonnes réponses consécutives, tables de 7 et 8 prioritaires.
- Après une erreur : appui sur un calcul connu et deuxième essai. Après deux erreurs : réponse et explication.
- Produits et carrés : +1 si juste, −2 si faux. Calculs inverses et racines : +2 si juste, −1 si faux. Minimum zéro.
- Coffre rempli progressivement, total exact affiché. Les autres blocs (fractions, géométrie, Pythagore) restent accessibles.

## Sauvegarde et suivi

Progression, réponses en cours, indices, historique et trésor sont enregistrés dans le même navigateur sur le même appareil (clé historique `jmq_v1`, migration sans suppression). Export/import JSON dans « Ma progression ». Un changement d’appareil ou l’effacement des données du navigateur nécessite une sauvegarde exportée.

Chaque bloc peut être effacé uniquement après confirmation explicite. Les autres blocs et le trésor sont conservés.
Les anciens identifiants de compétences restent dans l’historique ; les nouveaux exercices utilisent des identifiants distincts.

Le bouton de suivi ouvre le vrai formulaire prérempli. L’utilisateur doit cliquer sur **Envoyer dans Google Forms** pour transmettre le bilan. L’application ne prétend pas confirmer elle-même cette transmission. La feuille liée est réservée à son propriétaire et aux personnes autorisées.

## Sources et publication

- `index.html` : parcours et écrans d’origine.
- `app-progress.js` : sauvegarde, reprise, historique, export/import et effacement par bloc.
- `app-practice.js` : entraînement continu, défis, pièces et coffre SVG.
- `app-forms.js` : formulaire et tableau de suivi.
- `app.css` : styles des nouveaux écrans.
- `assets/` : huit visuels embarqués, sans dépendance distante à l’exécution.

GitHub Pages via `.github/workflows/deploy-pages.yml`, à chaque modification de `main`.
L’artefact publié contient index.html, les trois scripts, app.css, .nojekyll et assets/.

Vérification : `node tests/v3-regressions.cjs`.
Le test technique dans la feuille de réponses est nommé TEST_TECHNIQUE, sans évaluation élève.

Akim Zeboudj / AZ Consulting - Pédagogie
