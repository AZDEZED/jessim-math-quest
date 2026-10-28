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


## Application en ligne — 28 octobre 2026

Lien à transmettre à Jessim :
https://jessim-math-quest.brownshark256.chatgpt.site/

Le dépôt AZDEZED/jessim-math-quest reste privé.
L'application est hébergée via Sites, indépendamment de GitHub Pages.
Aucun abonnement GitHub Pro n'a été activé.
Le code d'accès existant est conservé ; il s'agit d'une barrière dans le navigateur,
pas d'une protection du code source publié. La refonte avec logique serveur est reportée.

Contrôles réalisés sur le site publié : mauvais code refusé, bon code accepté,
accès au module Pythagore et à une activité, chargement des images affichées.

Les fichiers publiés sont uniquement index.html et assets/.
Le README, le code d'accès en clair qui y figure et les workflows ne sont pas publiés.

### Maintenance de l'hébergement

Site : appgprj_6ae20eec60f48191b28f408e1288d6f7
Version publiée : appgprj_6ae20eec60f48191b28f408e1288d6f7~appgver_a4a930ab873881918010cb6210d8265e
Commit du dépôt source Sites : 6cde5d09532a2530ec6845ad1c69b24365eadc2f
Les mises à jour du dépôt GitHub ne republient pas automatiquement le site Sites.
Pour une modification, synchroniser les fichiers et publier une nouvelle version du même Site.
Le workflow GitHub Pages est conservé uniquement pour un éventuel lancement manuel ultérieur.
