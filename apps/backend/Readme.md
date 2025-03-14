<!-- BACKEND ROUTES -->

# Backend Routes

## User Routes

### POST /api/user/signup

Request Body:

```
{
  "username": "string (3-20 chars)",
  "email": "valid email",
  "password": "string (min 6 chars)"
}
```

Success Response:

```
{
  "status": 201,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "username": "string"
    }
  },
  "message": "User created successfully."
}
```

### POST /api/user/signin

Request Body:

```
{
  "email": "valid email",
  "password": "string (min 6 chars)"
}
```

Success Response:

```
{
  "status": 200,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "username": "string"
    },
    "accessToken": "jwt-token"
  },
  "message": "User signed in successfully."
}
```

Set Cookie:

```
accessToken=<JWT>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

### POST /api/user/reset-password

Request Body:

```
{
  "oldPassword": "current password",
  "newPassword": "new password (min 6 chars)"
}
```

Success Response:

```
{
  "status": 200,
  "data": null,
  "message": "Password reset successfully."
}
```
