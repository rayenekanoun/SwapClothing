
# Clothing Swap App

The Clothing Swap App is a platform for users to trade, sell, or donate clothing items. It allows users to create accounts, upload items they wish to trade, and interact with other users to facilitate clothing swaps. The application includes features for geolocation-based item searches, secure authentication, and user management.

---

## Features

- **User Authentication**: 
  - Sign up, log in, refresh tokens, password reset, and secure authentication.
  - Role-based access control (e.g., admin privileges).

- **Item Management**:
  - Create, update, and delete clothing items.
  - View all items or specific items based on unique IDs.
  - Search for items within a specified distance using geolocation.

- **User Management**:
  - Update user profiles, passwords, and account settings.
  - Admins can manage all user accounts.

- **Geolocation Search**:
  - Search for items based on proximity to a specified location.

---

## Installation



1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   DATABASE_URL=<your-database-url>
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRES_IN=<token-expiry-time>
   JWT_COOKIE_EXPIRES_IN=<cookie-expiry-time>
   EMAIL_HOST=<email-host>
   EMAIL_PORT=<email-port>
   EMAIL_USER=<email-username>
   EMAIL_PASS=<email-password>
   ```

3. **Run the application:**
   ```bash
   npm start
   ```

---

## Launching the Server

The server can be started using:
```bash
npm start
```
This will run the application on the port specified in the `.env` file (default is `3000`).

For development, use:
```bash
npm run dev
```
This enables hot-reloading.

---

## API Routes

### Item Routes
Base URL: `/api/v1/items`

| Method | Endpoint                                      | Description                                    |
|--------|-----------------------------------------------|-----------------------------------------------|
| GET    | `/`                                           | Fetch all items.                              |
| GET    | `/:id`                                        | Fetch a specific item by ID.                  |
| POST   | `/`                                           | Create a new item (authenticated users only). |
| PATCH  | `/:id`                                        | Update an item by ID (authenticated users).   |
| DELETE | `/:id`                                        | Delete an item by ID (authenticated users).   |
| DELETE | `/`                                           | Delete all items (admin only).                |
| GET    | `/items-within/:distance/center/:latlng/unit/:unit` | Fetch items within a specified distance of a location. |

### User Routes
Base URL: `/api/v1/users`

| Method | Endpoint                 | Description                                    |
|--------|--------------------------|-----------------------------------------------|
| POST   | `/signup`                | Register a new user.                          |
| POST   | `/login`                 | Log in a user.                                |
| POST   | `/refresh`               | Refresh JWT tokens.                           |
| POST   | `/forgotPassword`        | Send a password reset email.                  |
| PATCH  | `/resetPassword/:token`  | Reset user password.                          |
| POST   | `/logout`                | Log out a user.                               |
| PATCH  | `/updateMyPassword`      | Update the current user's password.           |
| GET    | `/me`                    | Fetch the current user's profile.             |
| PATCH  | `/updateMe`              | Update the current user's profile.            |
| DELETE | `/deleteMe`              | Delete the current user's account.            |
| GET    | `/`                      | Fetch all users (admin only).                 |
| GET    | `/:id`                   | Fetch a specific user by ID (admin only).     |
| PATCH  | `/:id`                   | Update a user by ID (admin only).             |
| DELETE | `/:id`                   | Delete a user by ID (admin only).             |

---

## Notes

1. **Authentication Middleware:**
   - `authController.protect`: Ensures the user is logged in before accessing certain routes.
   - `authController.restrictTo`: Restricts access based on user roles.

2. **Validation Middleware:**
   - `validateObj.validateParam`: Ensures required parameters are present in requests.
   - `itemValidationCreate` and `itemValidationUpdate`: Validate item creation and update data.

3. **Geolocation:**
   - The route `/items-within/:distance/center/:latlng/unit/:unit` requires `latlng` in the format `latitude,longitude`.

---

Feel free to reach out for further details or enhancements!
