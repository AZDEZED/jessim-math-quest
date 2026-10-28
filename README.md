# Jessim Math Quest V2 — package privé

## Accès
Code : `NAKAMA-78-2026`

## Signature
Akim Zeboudj / AZ Consulting - Pédagogie  
zeboudjakim@gmail.com

## Visuels
Le fichier `index.html` pointe uniquement vers des fichiers locaux dans `assets/`.
Le workflow GitHub Actions `fetch-one-piece-assets.yml` récupère les visuels One Piece
depuis la page officielle ONE PIECE ODYSSEY de Bandai Namco et les stocke dans le dépôt.

Après le premier workflow réussi, le site ne dépend plus d'un chargement d'image externe
à chaque ouverture.

## Suivi
Google Sheet :
https://docs.google.com/spreadsheets/d/1u6WT7Zfuf3ExiisaSuL4sth1M8Atlk19zUME3UWYhdc/edit


## Publication GitHub Pages
Le dépôt doit être créé en **privé**.
Le workflow `deploy-pages.yml` publie le site depuis la branche `main`.

Important : sur un compte GitHub personnel, un dépôt privé ne signifie pas que le site
GitHub Pages lui-même est privé. Le site est donc protégé au niveau de l'application par
le code d'accès : `NAKAMA-78-2026`.

Étape GitHub requise après création du dépôt :
Settings → Pages → Source → GitHub Actions.

