# Ground Token - Database Setup Guide

## Setup from Scratch

### Step 1: Clone and Install
```bash
git clone https://github.com/YOUR-USERNAME/ground-token-node.git
cd ground-token-node/backend
npm install
```

### Step 2: Create MySQL Database
```sql
CREATE DATABASE db_ground_token;
```

### Step 3: Create `.env` File
Create `backend/.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=db_ground_token
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
```

### Step 4: Run Migrations
```bash
npm run build
npm run migration:run
```

✅ Done! Database is ready.

---

## Schema Changes

```bash
# 1. Edit schema.ts
# 2. Generate migration
npm run migration:generate -- migrations/NewFeature

# 3. Run migration
npm run migration:run
```

See `schema.ts` for all table structures.

---

## Commands

```bash
npm run build              # Compile TypeScript
npm run migration:run      # Apply migrations
npm run migration:generate # Create migration from changes
npm run migration:revert   # Undo last migration
```
