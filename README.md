## GlobeTrekker — Travel Booking Website

Live Website Link : https://globetrekker-travel-website.vercel.app/
---

##  About GlobeTrekker

**GlobeTrekker** is a full-stack travel booking platform that allows users to:
- Register for travel destinations & packages
- Subscribe to newsletters
- Send contact messages directly to admin email
- Store bookings securely in MongoDB
- Receive booking confirmation (admin alerts via email)

Designed with a clean modern UI, secure backend, and cloud deployment.

---

##  Features

| Feature | Description |
|---------|------------|
| Booking Registration | Users book travel packages with form validation |
| Contact Form | Message delivered to admin email |
| Newsletter | Subscribe via email |
| Email Notifications | Admin receives booking & contact alerts |
| MongoDB Storage | All booking details saved in database |
| Authentication | Login & Sign-up system |
| Cloud Hosting | Frontend on Vercel, Backend on Render |

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React, React Router, Material UI, CSS |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Email Service | Resend |
| Hosting | Vercel + Render |
| Version Control | Git & GitHub |

---

## Getting Started (Run Locally)

### **Clone the project**
```bash
git clone https://github.com/your-username/GlobeTrekker.git
cd GlobeTrekker
````

### **Start Backend**

```bash
cd backend
npm install
npm start   # or nodemon server.js
```

### **Start Frontend**

```bash
cd ../frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000/`
Backend runs on: `http://localhost:5000/`

---

## 📡 API Endpoints

| Method | Route        | Description             |
| ------ | ------------ | ----------------------- |
| POST   | `/register`  | Submit travel booking   |
| POST   | `/contact`   | Send contact message    |
| POST   | `/subscribe` | Newsletter subscription |
| POST   | `/signup`    | Create new user         |
| POST   | `/login`     | User login              |
| GET    | `/`          | Base route test         |

---

## Environment Variables

Create a `.env` file inside **backend** folder:

```
PORT=5000
MONGO_URI=your-mongodb-url
RESEND_API_KEY=your-resend-api-key
EMAIL_ADMIN=your-admin-email@example.com
```

### Add `.env` to `.gitignore`

```
.env
```

---

## Project Structure

GlobeTrekker/
│
├── frontend/                # React Frontend
│   ├── src/
│   ├── components/
│   └── pages/
│
└── backend/                 # Express Backend
    ├── server.js
    ├── models/
    ├── routes/
    └── .env  (not public)

## How It Works

### Registration Flow

1. User fills booking form
2. Backend validates & stores in MongoDB
3. Admin receives booking alert email
4. User sees success modal

### Contact Form Flow

1. User sends message
2. Admin receives email notification instantly
3. User sees success alert

---

## Future Improvements

* User dashboard for booking history
* Payment gateway integration
* Email verification for accounts
* Automated ticket PDF generation

---

### Thanks for visiting GlobeTrekker!

 *Travel the world, one click at a time.*

### Tell us the most challenging problem you solved recently, in 5–7 sentences. Be specific.
One of the hardest problems I recently tackled was building a unified backend that supports two independent features — a newsletter/subscriber system and a full-fledged trip-registration form — in a clean, maintainable way. I needed to make sure each feature had its own route, storage schema (collections in the database), and email-notification workflow, so they didn’t interfere with each other. Doing this meant carefully designing the API endpoints and database collections so that subscriber data and trip-registration data remain logically separate but manageable under the same backend. I also had to integrate an email delivery mechanism (using something like Nodemailer) to send separate kinds of emails — a welcome email for subscribers, and a confirmation email for trip registrations. Lastly, I ensured that everything remains modular so I or another developer could add more features or modify one without breaking the other.
