# MoodleClone
Projet WE4B/SI40, par Clément Lebert, Nathan Duranel, Nathan Lamey, Louis Roger, Matthieu Hiessler

---
Nous n'avons pas réussi à faire fonctionner la connexion entre le backend et le frontend. Cependant, ils fonctionnent indépendamment, et nous avons mis en place un système de données fictives pour tester le frontend.

Il suffit d'activer la variable d'environnement `useMockData` dans le fichier `/app/src/environments/environment.ts`

---

## Comment démarrer le projet :

### 1. Démarrer la base de données :
Exécutez ``docker compose up -d 'mongodb'``

### 2. Démarrer le Backend :
Exécutez :
- ``npm i --include-dev`` pour récupérer toutes les dépendances
- ``npx prisma generate`` afin de construire les fichiers nécessaires pour l'ORM
- ``npm run start:dev`` pour démarrer le backend

### 3. Démarrer le Frontend
Exécutez :
- ``cd app``
- ``npm i --include-dev``
- ``npm run start``
