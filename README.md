# Real Estate Full-Stack Web Application

A full-stack real estate web application built to allow users to browse properties, search and filter listings, contact property owners, manage favorites and bookings, submit reviews, and manage their own property listings.

The application has separate React and Node.js applications connected through REST APIs, with MySQL used for persistent data storage.

---

## Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3
* Axios
* React Router

### Backend

* Node.js
* Express.js
* REST APIs
* JWT
* bcrypt
* dotenv
* CORS

### Database

* MySQL

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Thunder Client

---

## Project Structure

The project is organized into separate frontend and backend applications.

```text
Realestateapp--Full-Stack/
│
├── real-estate-frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── Pages/
│   │   └── utils/
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── realestateapp/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── favoriteController.js
│   │   ├── inquiryController.js
│   │   ├── propertyController.js
│   │   └── reviewController.js
│   │
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── upload.js
│   │   └── uploadMiddleware.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── favoriteRoutes.js
│   │   ├── inquiryRoutes.js
│   │   ├── propertyRoutes.js
│   │   └── reviewRoutes.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

---

## Frontend

The frontend is built using React.js and Vite.

The application is divided into reusable components and separate pages for different user workflows.

### Main Frontend Areas

#### Pages

The application contains pages for:

* Home
* Properties
* Property Details
* Login
* Register
* Dashboard
* My Properties
* Add Property
* Edit Property
* Favorites
* Bookings
* Profile
* Edit Profile
* Admin Dashboard
* Reviews
* Contact Owner

#### Components

Reusable components include:

* Navbar
* Footer
* Property Card

The `PropertyCard` component is used to display property information consistently across property-related pages.

#### API Layer

API communication is handled through Axios.

The frontend sends requests to the Express backend instead of directly accessing the MySQL database.

For local development:

```text
React Frontend
http://localhost:5173

        |
        | Axios / HTTP Requests
        v

Express Backend
http://localhost:5000
```

---

## Backend

The backend is built with Node.js and Express.js.

It provides REST APIs that handle authentication, properties, bookings, favorites, inquiries, reviews, and administrative operations.

### Backend Structure

#### Routes

Routes define the API endpoints and connect incoming requests to the appropriate controller.

For example:

```text
/auth
/properties
/bookings
/favorites
/inquiries
/reviews
/admin
```

#### Controllers

Business logic is separated into controllers.

The project contains controllers for:

* Authentication
* Properties
* Bookings
* Favorites
* Inquiries
* Reviews
* Administration

This keeps the route files focused on defining endpoints while the controllers handle the actual operations.

#### Middleware

Middleware is used for operations that need to happen before the request reaches the controller.

The project uses middleware for:

* JWT authentication
* Admin authorization
* File/image upload handling
* CORS
* Request processing

---

## Database

The application uses MySQL for storing application data.

Database name:

```text
realestate_db
```

The database contains data related to users, properties, bookings, favorites, inquiries, and reviews.

The backend communicates with MySQL through the database configuration in:

```text
realestateapp/config/db.js
```

The general data flow is:

```text
React
  |
  | HTTP Request
  v
Express Route
  |
  v
Middleware
  |
  v
Controller
  |
  | SQL Query
  v
MySQL
  |
  v
Controller
  |
  | JSON Response
  v
React
```

---

## How the Application Works

The application follows a client-server architecture.

### 1. User Opens the Application

The React frontend loads the required page through React Router.

For example:

```text
/
 /properties
 /properties/:id
 /login
 /register
 /dashboard
```

### 2. Frontend Requests Data

When a page requires data, the frontend sends an HTTP request using Axios.

For example:

```text
GET /api/properties
```

### 3. Express Receives the Request

The Express application receives the request and sends it to the appropriate route.

The route then calls the corresponding controller.

### 4. Controller Communicates With MySQL

The controller executes the required SQL query against the `realestate_db` database.

### 5. Backend Sends a Response

The backend returns the result as JSON.

### 6. React Updates the Interface

The frontend receives the response and displays the information to the user.

---

## Authentication Flow

Authentication uses JWT.

```text
User
 |
 v
Login Form
 |
 v
POST /api/auth/login
 |
 v
Auth Controller
 |
 v
Check User in MySQL
 |
 v
Verify Password using bcrypt
 |
 v
Generate JWT
 |
 v
Return Token
 |
 v
Frontend stores authentication information
```

For protected requests, the token is sent with the request:

```text
Authorization: Bearer <token>
```

The authentication middleware verifies the token before allowing access to protected routes.

---

## Property Management Flow

Property owners can manage their own listings.

```text
Owner
 |
 v
Dashboard
 |
 v
My Properties
 |
 +------> Add Property
 |
 +------> Edit Property
 |
 +------> Delete Property
 |
 v
Property API
 |
 v
MySQL
```

The backend verifies authentication before allowing protected property operations.

---

## Contact Owner Flow

Users can contact a property owner directly from the property details page.

```text
Property Details
       |
       v
Contact Owner
       |
       v
Owner Email
       |
       v
Email Composer
       |
       v
User writes message
       |
       v
User sends email
```

The application provides the owner's email so the user can compose and send the message through their email client.

---

## Features

### User Features

* User registration
* User login
* JWT authentication
* Profile viewing
* Profile editing
* Personalized dashboard
* Logout functionality

### Property Features

* Browse properties
* View property details
* Search properties by location
* Filter properties by property type
* View property information such as price, location, bedrooms, bathrooms, area, purpose, and description
* Add properties
* Edit properties
* Delete properties
* View personal property listings

### Favorites

* Add properties to favorites
* Remove properties from favorites
* View saved properties
* Manage favorites from the user account

### Bookings

* Book properties
* View booking information
* Access bookings from the dashboard
* Manage booking-related information

### Reviews

* Submit property reviews
* View property reviews
* Associate reviews with users and properties

### Contact and Inquiries

* Contact property owners
* Access owner email from property details
* Compose an email to the property owner
* Submit property-related inquiries

### Admin Features

The application includes a separate admin dashboard with protected administrative functionality.

Administrators can manage:

* Users
* Properties
* Bookings
* Other application data

Admin access is controlled through authentication and admin authorization middleware.

---

## Security

The application includes:

* JWT-based authentication
* bcrypt password hashing
* Protected backend routes
* Admin authorization middleware
* Environment variables for database and authentication configuration
* CORS configuration
* `.env` files excluded from Git

Sensitive configuration is stored locally in environment variables and is not committed to the repository.

---

## Running the Project Locally

### Prerequisites

Install:

* Node.js
* npm
* MySQL
* Git

### Clone the Repository

```bash
git clone https://github.com/Shivaniyadav628/Realestateapp--Full-Stack.git

cd Realestateapp--Full-Stack
```

### Backend

```bash
cd realestateapp
npm install
```

Create a `.env` file:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=realestate_db
PORT=5000
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
node server.js
```

Backend:

```text
http://localhost:5000
```

### Frontend

Open another terminal:

```bash
cd real-estate-frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## API Overview

### Authentication

| Method | Endpoint             | Purpose                |
| ------ | -------------------- | ---------------------- |
| POST   | `/api/auth/register` | Register a user        |
| POST   | `/api/auth/login`    | Login                  |
| GET    | `/api/auth/profile`  | Get authenticated user |

### Properties

| Method | Endpoint                 | Purpose                  |
| ------ | ------------------------ | ------------------------ |
| GET    | `/api/properties`        | Get properties           |
| GET    | `/api/properties/:id`    | Get property details     |
| GET    | `/api/properties/search` | Search/filter properties |
| POST   | `/api/properties`        | Add property             |
| PUT    | `/api/properties/:id`    | Update property          |
| DELETE | `/api/properties/:id`    | Delete property          |

Additional API endpoints are available for bookings, favorites, reviews, inquiries, and administration.

---

## What I Learned From This Project

This project helped me understand how a frontend and backend communicate in a full-stack application.

Some of the main concepts I worked with include:

* Building REST APIs with Express
* Connecting Node.js to MySQL
* Designing CRUD operations
* Implementing JWT authentication
* Using middleware for protected routes
* Implementing role-based authorization
* Connecting React applications to backend APIs using Axios
* Managing application state and user flows
* Structuring a full-stack project into separate frontend and backend applications
* Debugging CORS and frontend-backend connection issues
* Using Git and GitHub for version control

---

## Future Improvements

* Deploy frontend and backend
* Add cloud-based image storage
* Improve property search and filtering
* Add pagination and sorting
* Add map-based property discovery
* Add online payment functionality
* Add real-time notifications
* Add automated testing
* Add CI/CD

---

## Author

**Shivani Gundemoni**

Computer Science Engineering Student

GitHub: https://github.com/Shivaniyadav628

---

## Repository

https://github.com/Shivaniyadav628/Realestateapp--Full-Stack
