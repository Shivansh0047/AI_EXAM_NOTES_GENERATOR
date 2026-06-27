# AI Exam Notes Generator

A full-stack MERN (MongoDB, Express, React, Node.js) web application designed to help students generate study notes from specific topics. It features user authentication, a history page to track saved PDF notes, and integration with Stripe for payment processing.

## 🚀 Features
- **AI-Powered Note Generation:** Input a topic and generate structured exam notes instantly.
- **PDF Export:** Easily save your generated notes as PDFs.
- **Personalized Dashboard:** View your history of previously generated notes.
- **Stripe Integration:** Secure payment gateway for premium features/services.
- **Responsive Design:** Built with React for a seamless experience on all devices.

## 🛠 Tech Stack
- **Frontend:** React, CSS/Styled Components
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Payments:** Stripe API
- **Authentication:** JSON Web Tokens (JWT)

## 📋 Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas cloud account)

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shivansh0047/AI_EXAM_NOTES_GENERATOR.git
   cd AI_EXAM_NOTES_GENERATOR
   ```

2. **Setup Server:**
   ```bash
   cd server
   npm install
   # Create a .env file and add your MONGO_URI, STRIPE_SECRET_KEY, etc.
   npm run dev
   ```

3. **Setup Client:**
   ```bash
   cd ../client
   npm install
   npm start
   ```

## 🔑 Environment Variables
Create a `.env` file in the `server` directory and include the following variables:
- `PORT`: 8000
- `MONGO_URI`: <your_mongodb_connection_string>
- `STRIPE_SECRET_KEY`: <your_stripe_key>
- `JWT_SECRET`: <your_secret_key>

## 🤝 Contributing
Contributions are welcome! If you have suggestions or find bugs, feel free to open an issue or submit a pull request.

## 📝 License
This project is licensed under the MIT License.
