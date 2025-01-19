# Summary of Middleware Updates and Route Changes

## **Middleware Updates**

1. **New Middleware Added**:
   - **`ensureAdmin`**:
     Ensures that the user is an admin (i.e., `isAdmin` is true in the JWT payload). Throws an UnauthorizedError if not.

   - **`ensureCorrectUserOrAdmin`**:
     Ensures the user is either the specified user (matching `req.params.username`) or an admin. Throws an UnauthorizedError if neither condition is met.

2. **Existing Middleware**:
   - **`authenticateJWT`**:
     - Unchanged: Decodes the JWT token and stores the payload in `res.locals.user` for subsequent middleware and route handlers.

   - **`ensureLoggedIn`**:
     - Unchanged: Ensures that the user is authenticated (i.e., `res.locals.user` exists).

3. **Purpose**:
   - These middleware functions encapsulate the logic for user authentication and authorization, making them reusable across multiple routes and reducing redundancy.

---

## **Changes to Companies Routes**

1. **Authorization Updates**:
   - **POST `/`**: Restricted to logged-in users with admin privileges using `ensureLoggedIn` and `ensureAdmin`.
   - **PATCH `/:handle`**: Restricted to logged-in admin users with `ensureLoggedIn` and `ensureAdmin`.
   - **DELETE `/:handle`**: Restricted to logged-in admin users with `ensureLoggedIn` and `ensureAdmin`.

2. **No Changes**:
   - **GET `/`** and **GET `/:handle`**: Open to all users, including anonymous users, with no authorization required.

---

## **Changes to Users Routes**

1. **Authorization Updates**:
   - **POST `/`**: Restricted to logged-in admin users using `ensureLoggedIn` and `ensureAdmin`.
   - **GET `/`**: Restricted to logged-in admin users with `ensureLoggedIn` and `ensureAdmin`.
   - **GET `/:username`**: Restricted to logged-in admin users or the specific user using `ensureLoggedIn` and `ensureCorrectUserOrAdmin`.
   - **PATCH `/:username`**: Restricted to logged-in admin users or the specific user using `ensureLoggedIn` and `ensureCorrectUserOrAdmin`.
   - **DELETE `/:username`**: Restricted to logged-in admin users or the specific user using `ensureLoggedIn` and `ensureCorrectUserOrAdmin`.

2. **No Changes**:
   - Routes for user registration (handled via the `auth` routes) remain open to all users without any restrictions.

---

## **Advantages of Changes**

1. **Centralized Authorization Logic**:
   - The middleware ensures that routes do not contain duplicated or hardcoded authorization checks, making the code cleaner and easier to maintain.

2. **JWT-Based Authentication**:
   - Authorization relies on information embedded in the JWT token, eliminating the need for frequent database queries to check user roles or privileges.

3. **Flexible and Scalable**:
   - The new middleware can be reused for additional routes or features requiring similar permission checks.

4. **Testable**:
   - The changes are structured to allow easy testing of authorization rules by verifying access for various roles (e.g., admin vs. non-admin, specific user vs. unauthorized user).

---

## Implementation Checklist

- [x] Add `ensureAdmin` and `ensureCorrectUserOrAdmin` middleware to `auth.js`.
- [x] Update `companies` routes to restrict create, update, and delete actions to admins.
- [x] Update `users` routes to restrict sensitive actions based on user roles and identities.
- [x] Test all routes to confirm that the new authorization rules work as expected.

