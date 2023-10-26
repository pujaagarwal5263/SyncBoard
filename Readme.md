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
  "participants":["user1@gmail.com","user2@gmail.com"]
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