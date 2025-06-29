# MoodleClone
WE4/SI40 project, by Clément Lebert, Nathan Duranel, Nathan Lamey, Louis Roger, Matthieu Hiessler
---
## How to start the project : 
### 1. Start the db :
run ``docker compose up -d 'mongodb'``

### 2. Start the Backend :
run :
- ``npm i --include-dev`` to fetch all dependancies
- ``npx prisma generate`` in order to build the required files for the ORM
- ``npm run start:dev`` to start the backend

### 3. Start the Frontend
run : 
- ``cd app``
- ``npm i --include-dev``
- ``npm run start``
