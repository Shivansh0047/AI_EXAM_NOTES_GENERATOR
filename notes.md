# AI_EXAM_NOTES_GENERATOR

## Flow -

1. client - for frontend
2. server - for backend
3. cd server and npm init and set type to module in package to use import syntax
4. Any anytime during the making, create add puch code onto github
4. install required package (express mongoose nodemon cookie-parser jsonwebtoken cors dotenv pdfkit) by npm install
5. chnage script to dev in package json to easily use nom run dev
6. create Server to run in server/index.js. Check if it is listening on port and response is compoint in browser.
7. initialize .env for all the sensitive information, put info of port inside it, and call it using dotenv. Now env is setup
8. create folders like models(for all the models), controllers(for all functions to do some work), routes (for fetch API form frontend to backend), utiles (for creating thinks like DB connection), middleware (for all middlewhere auth)
9. setup MongoDB connection. Create new Project and do the required. Create a cluster. New in the windows after deployment , create DB user , choose a connection method, choose mongoDB for VScode and copy the link and paste it in env. Add the db name AFTER slash
10. connect mongoDB with mongoose using mongoose.connect, make a file connectdb in utils and write code there. Now import this function in index.js with database is listening. Make sure to use the non-srv link if srv is not working
11. Now create the user model inside models. first create Schema for user and then on that schema create model, all using mongoose