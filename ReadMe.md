### **To run this project:**
* Download the file from git :
```bash
git init
git clone link_of_this_project
```
* try the follow command :
```bash
npm install
```

**If you need the step of creation projet, try :**

```bash
mkdir backend
cd backend
npm init -y
npm install typescript @types/node --save-dev
npx tsc --init
mkdir src
touch src/app.ts
```
* download dependencies

```bash
npm i @types/express @types/mongoose bcrypt bcryptjs cookie-parser dotenv express jsonwebtoken mongoose morgan nodemailer nodemon @types/bcrypt @types/bcryptjs @types/body-parser @types/cookie-parser @types/jsonwebtoken @types/morgan @types/nodemailer express-mongo-sanitize express-rate-limit ts-node swagger-jsdoc swagger-ui-express
```
### **if your project already exist, follow the next step.**
* create .env file and add your configuration. Example:
````
PORT=3000
MODE_ENV=development
MONGO_URL=mongodb://localhost:27017/
JWT_SECRET=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.gmail.address
SMTP_PASS='your password via smtp google'
````
* create env.d.ts file to fix your configuration on env file. Example:
````
declare global{
    namespace NodeJS{
        interface ProcessEnv{
            PORT: string;
            MODE_ENV: "development" | "production";
            MONGO_URL: string;
            JWT_SECRET: string;
            SMTP_SECRET: string;
            SMTP_HOST: string;
            SMTP_PORT: string;
            SMTP_PASSWORD: string;
            BASE_URL: string;
        }
    }
}
````
* => copy the all file and their code to have a project
* In the end, run the next command:
```bash
npm start
```
