# How to start guide?
1. Create your env with the following data:
   
```
MONGODB_URL=mongodb://localhost:27017
```

2. Install dependencies:
```
npm install
```

3. Start the code:
```
npm start
```

# Endpoints Documentation

This documentation provides information about the payload structure required for each endpoint.

## 1. POST: /saveuser

**Description:**
Hit this endpoint to save a user whenever the login is done. 

**Request Payload:**

```json
{
  "email": "current-user@gmail.com",
  "name":"user-name"
}
```

## 2. POST: /create-board

**Description:**
To create a new board.

**Request Payload:**

```json
{
  "boardId": "342-3424-543",
  "boardName": "new board 2",
  "user": "current-user@gmail.com"
}
```

## 3. POST: /add-participants

**Description:**
To add participant to existing board.

**URL structure:**

```
/add-participants/boardId
```

**Request Payload:**

```json
{
  "participant":"user1@gmail.com"
}
```

## 4. POST: /delete-board

**Description:**
To delete a board.

**Request Payload:**

```json
{
  "boardId": "342-3424-543",
  "userEmail": "current-user@gmail.com"
}
```

## 5. GET: /board-details

**Description:**
To get all details of board

**URL structure:**

```
/board-details/boardId
```

## 6. GET: /get-my-boards

**Description:**
To get all boards of a user

**URL structure:**

```
/get-my-boards/:userEmail
```

## 7. GET: /validate-boardid

**Description:**
To check validation of board ID.

**URL structure:**

```
/validate-boardid/:boardId
```

## 8. POST: /save-board-id

**Description:**
To save a board ID to collection.

**Request Payload:**

```json
{
  "boardId": "342-3424-543"
}
```

## 9. POST: /remove-board-id

**Description:**
To remove a board ID from collection.

**Request Payload:**

```json
{
  "boardId": "342-3424-543"
}
```

## 10. GET: /get-participated-board

**Description:**
To get all boards of a user where he has participated

**URL structure:**

```
/get-participated-board/:userEmail
```