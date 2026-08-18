Library Management System — Admin API Documentation

Base URL

https://sec-libraray-backend.onrender.com

Note: The backend hostname contains library exactly as provided in the original API document.

1. Admin Authentication

1.1 Admin Register

Method: POST

Endpoint:

/api/admin/register

Full URL:

https://sec-libraray-backend.onrender.com/api/admin/register

Request Body

{
  "name": "Kawser",
  "email": "admin2@gmail.com",
  "regNo": "20203315323",
  "password": "Admin@123456",
  "role": "admin"
}

Response

{
  "success": true,
  "message": "Admin registered successfully",
  "data": {
    "admin": {
      "id": "6a8141657da9fbab55bbcb02",
      "name": "Kawser",
      "email": "admin2@gmail.com",
      "regNo": "20203315323",
      "role": "admin"
    }
  }
}

1.2 Admin Login

Method: POST

Endpoint:

/api/admin/login

Full URL:

https://sec-libraray-backend.onrender.com/api/admin/login

Request Body

{
  "regNo": "2020331532",
  "password": "Admin@123456"
}

Response

{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "admin": {
      "id": "6a7f42580099ab75c51d9663",
      "name": "Kawser Hamim",
      "email": "admin@gmail.com",
      "regNo": "2020331532",
      "role": "admin"
    }
  }
}

1.3 Admin Logout

Method: POST

Endpoint:

/api/admin/logout

Full URL:

https://sec-libraray-backend.onrender.com/api/admin/logout

Request Body

No request body.

Response

{
  "success": true,
  "message": "Admin logged out successfully"
}

1.4 Get Current Admin

Method: GET

Endpoint:

/api/admin/me

Full URL:

https://sec-libraray-backend.onrender.com/api/admin/me

Response

{
  "success": true,
  "message": "Admin details fetched successfully",
  "data": {
    "admin": {
      "id": "6a7f42580099ab75c51d9663",
      "name": "Kawser Hamim",
      "email": "admin@gmail.com",
      "regNo": "2020331532",
      "role": "admin"
    }
  }
}

2. Book Management

2.1 Add Book

Method: POST

Endpoint:

/api/admin/access/books

Full URL:

https://sec-libraray-backend.onrender.com/api/admin/access/books

Request Body

{
  "title": "Introduction to Algorithms",
  "authors": [
    "Thomas H. Cormen",
    "Charles E. Leiserson",
    "Ronald L. Rivest",
    "Clifford Stein"
  ],
  "isbn": "9780262046398",
  "coverImage": {
    "url": "https://covers.openlibrary.org/isbn/9780262046305-L.jpg",
    "publicId": null
  },
  "totalCopies": 12,
  "availableCopies": 8,
  "category": "CSE"
}

Response

{
  "success": true,
  "message": "Book added successfully",
  "book": {
    "title": "Introduction to Algorithms",
    "authors": [
      "Thomas H. Cormen",
      "Charles E. Leiserson",
      "Ronald L. Rivest",
      "Clifford Stein"
    ],
    "isbn": "9780262046398",
    "coverImage": {
      "url": "https://covers.openlibrary.org/isbn/9780262046305-L.jpg",
      "publicId": null
    },
    "totalCopies": 12,
    "availableCopies": 8,
    "category": "CSE",
    "_id": "6a8146a4163b0ba918971c50",
    "createdAt": "2026-08-16T05:12:04.678Z",
    "updatedAt": "2026-08-16T05:12:04.678Z"
  }
}

2.2 Update Book

Method: PATCH

Endpoint:

/api/admin/access/books/:bookId

Example:

/api/admin/access/books/6a8146a4163b0ba918971c50

Request Body

{
  "totalCopies": 88
}

Response

{
  "success": true,
  "message": "Book updated",
  "book": {
    "coverImage": {
      "url": "https://covers.openlibrary.org/isbn/9780262046305-L.jpg",
      "publicId": null
    },
    "_id": "6a8146a4163b0ba918971c50",
    "title": "Introduction to Algorithms",
    "authors": [
      "Thomas H. Cormen",
      "Charles E. Leiserson",
      "Ronald L. Rivest",
      "Clifford Stein"
    ],
    "isbn": "9780262046398",
    "totalCopies": 88,
    "availableCopies": 8,
    "category": "CSE",
    "createdAt": "2026-08-16T05:12:04.678Z",
    "updatedAt": "2026-08-16T05:13:52.712Z"
  }
}

2.3 Delete Book

Method: DELETE

Endpoint:

/api/admin/access/books/:bookId

Example:

/api/admin/access/books/6a8146a4163b0ba918971c50

Response

{
  "success": true,
  "message": "Book deleted"
}

2.4 Get All Books

Method: GET

Endpoint:

/api/admin/access/books

Full URL:

https://sec-libraray-backend.onrender.com/api/admin/access/books

Response

{
  "success": true,
  "count": 1,
  "totalBooks": 1,
  "pageCount": 1,
  "offset": 0,
  "limit": 10,
  "data": [
    {
      "_id": "6a80b7634bce2a5128a693d8",
      "title": "Introduction to Algorithms",
      "authors": [
        "Thomas H. Cormen",
        "Charles E. Leiserson",
        "Ronald L. Rivest",
        "Clifford Stein"
      ],
      "isbn": "9780262046305",
      "totalCopies": 12,
      "availableCopies": 0,
      "category": "CSE"
    }
  ]
}

2.5 Search Books

Searches books by title, authors, category, or ISBN.

Method: GET

Endpoint:

/api/admin/access/books/search

Query Parameter

query=<book name | author name | ISBN>

Example:

/api/admin/access/books/search?query=9780135957059

Response

{
  "success": true,
  "query": "Thomas H",
  "searchedFields": [
    "title",
    "authors",
    "category",
    "isbn"
  ],
  "count": 1,
  "data": [
    {
      "coverImage": {
        "url": "https://covers.openlibrary.org/isbn/9780262046305-L.jpg",
        "publicId": null
      },
      "_id": "6a80b7634bce2a5128a693d8",
      "title": "Introduction to Algorithms",
      "authors": [
        "Thomas H. Cormen",
        "Charles E. Leiserson",
        "Ronald L. Rivest",
        "Clifford Stein"
      ],
      "isbn": "9780262046305",
      "totalCopies": 12,
      "availableCopies": 0,
      "category": "CSE"
    }
  ]
}

3. Student Management

3.1 Get All Students

Method: GET

Endpoint:

/api/admin/access/students

Response

{
  "success": true,
  "count": 1,
  "totalStudents": 1,
  "pageCount": 1,
  "offset": 0,
  "limit": 20,
  "filters": {
    "department": "all",
    "Session": "all"
  },
  "data": [
    {
      "_id": "6a80b295155253f787c0cc3e",
      "name": "Kawser Hamim",
      "regNo": "2020331533",
      "email": "hamim@gmail.com",
      "department": "Computer Science and Engineering",
      "Session": "2020-2021",
      "role": "user"
    }
  ]
}

3.2 Search Student by Registration Number

Method: POST

Endpoint:

/api/admin/access/students/search

Request Body

{
  "regNo": "2020331533"
}

Response

{
  "success": true,
  "student": {
    "_id": "6a80b295155253f787c0cc3e",
    "name": "Kawser Hamim",
    "regNo": "2020331533",
    "email": "hamim@gmail.com",
    "department": "Computer Science and Engineering",
    "Session": "2020-2021"
  },
  "issuedBooks": [],
  "reservations": [
    {
      "_id": "6a80ca242040ce93b57c1ff6",
      "book": {
        "_id": "6a80b7634bce2a5128a693d8",
        "title": "Introduction to Algorithms",
        "authors": [
          "Thomas H. Cormen",
          "Charles E. Leiserson",
          "Ronald L. Rivest",
          "Clifford Stein"
        ]
      },
      "book_title": "Introduction to Algorithms",
      "book_authors": [
        "Thomas H. Cormen",
        "Charles E. Leiserson",
        "Ronald L. Rivest",
        "Clifford Stein"
      ],
      "user": "6a80b295155253f787c0cc3e",
      "user_name": "Kawser Hamim",
      "user_regNo": "2020331533",
      "user_department": "Computer Science and Engineering",
      "user_Session": "2020-2021",
      "status": "expired",
      "reservedAt": "2026-08-15T20:20:52.980Z",
      "expiresAt": "2026-08-15T20:22:52.980Z",
      "reservedId": "RB-1786825252984-302830",
      "createdAt": "2026-08-15T20:20:52.987Z",
      "updatedAt": "2026-08-15T20:23:00.283Z",
      "__v": 0
    }
  ]
}

The original document's response example ends at the reservations array and only provides one reservation object.

4. Book Issue and Return Management

4.1 Issue Book Directly

Method: POST

Endpoint:

/api/admin/access/books/:bookId/issue-to

Example:

/api/admin/access/books/6a80b7634bce2a5128a693d8/issue-to

Request Body

{
  "regNo": "2020331533"
}

Response

{
  "success": true,
  "message": "Book issued successfully (direct)",
  "data": {
    "book": "6a80b7634bce2a5128a693d8",
    "bookTitle": "Introduction to Algorithms",
    "bookAuthors": [
      "Thomas H. Cormen",
      "Charles E. Leiserson",
      "Ronald L. Rivest",
      "Clifford Stein"
    ],
    "user": "6a80b295155253f787c0cc3e",
    "userName": "Kawser Hamim",
    "userRegNo": "2020331533",
    "userDepartment": "Computer Science and Engineering",
    "userSession": "2020-2021",
    "returnedAt": null,
    "status": "borrowed",
    "reservation": null,
    "_id": "6a81520cde86fea5a2dba323",
    "issuedId": "IS-1786860044406-979661",
    "borrowedAt": "2026-08-16T06:00:44.406Z",
    "dueDate": "2026-08-23T06:00:44.406Z",
    "createdAt": "2026-08-16T06:00:44.406Z",
    "updatedAt": "2026-08-16T06:00:44.406Z",
    "__v": 0
  }
}

4.2 Issue a Reserved Book

Method: POST

Endpoint:

/api/admin/access/books/:bookId/issue/:reservationId

Example:

/api/admin/access/books/6a80b7634bce2a5128a693d8/issue/6a815577de86fea5a2dba325

Parameters

bookId — Book ID

reservationId — Reservation ID

The original document only provides the route and parameter meaning. It does not provide the request body or response example.

4.3 Return an Issued Book

Method: POST

Endpoint:

/api/admin/access/issued/:issueId/return

Example:

/api/admin/access/issued/6a81520cde86fea5a2dba323/return

Parameters

issueId — Issued-book record ID

The original document does not provide the response example for this endpoint.

4.4 Get All Issued Books

Method: GET

Endpoint:

/api/admin/access/issued

Response

{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6a81520cde86fea5a2dba323",
      "book": {
        "_id": "6a80b7634bce2a5128a693d8",
        "title": "Introduction to Algorithms",
        "authors": [
          "Thomas H. Cormen",
          "Charles E. Leiserson",
          "Ronald L. Rivest",
          "Clifford Stein"
        ]
      },
      "bookTitle": "Introduction to Algorithms",
      "bookAuthors": [
        "Thomas H. Cormen",
        "Charles E. Leiserson",
        "Ronald L. Rivest",
        "Clifford Stein"
      ],
      "user": {
        "_id": "6a80b295155253f787c0cc3e",
        "name": "Kawser Hamim",
        "regNo": "2020331533",
        "email": "hamim@gmail.com",
        "department": "Computer Science and Engineering",
        "Session": "2020-2021"
      },
      "userName": "Kawser Hamim",
      "userRegNo": "2020331533",
      "userDepartment": "Computer Science and Engineering",
      "userSession": "2020-2021",
      "returnedAt": "2026-08-16T06:27:42.412Z",
      "status": "returned",
      "reservation": null,
      "issuedId": "IS-1786860044406-979661",
      "borrowedAt": "2026-08-16T06:00:44.406Z",
      "dueDate": "2026-08-23T06:00:44.406Z",
      "createdAt": "2026-08-16T06:00:44.406Z",
      "updatedAt": "2026-08-16T06:27:42.413Z",
      "__v": 0
    }
  ]
}

4.5 Get All Reservations

Method: GET

Endpoint:

/api/admin/access/reservations

Response

{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "6a815577de86fea5a2dba325",
      "book": {
        "_id": "6a80b7634bce2a5128a693d8",
        "title": "Introduction to Algorithms",
        "authors": [
          "Thomas H. Cormen",
          "Charles E. Leiserson",
          "Ronald L. Rivest",
          "Clifford Stein"
        ]
      },
      "book_title": "Introduction to Algorithms",
      "book_authors": [
        "Thomas H. Cormen",
        "Charles E. Leiserson",
        "Ronald L. Rivest",
        "Clifford Stein"
      ],
      "user": {
        "_id": "6a81539ade86fea5a2dba324",
        "name": "Tajwarul Hasan Chowdhury",
        "regNo": "2020331511",
        "email": "tajwarulchowdhury@gmail.com",
        "department": "Computer Science and Engineering",
        "Session": "2020-2021"
      },
      "user_name": "Tajwarul Hasan Chowdhury",
      "user_regNo": "2020331511",
      "user_department": "Computer Science and Engineering",
      "user_Session": "2020-2021",
      "status": "expired",
      "reservedAt": "2026-08-16T06:15:19.618Z",
      "expiresAt": "2026-08-16T06:17:19.618Z",
      "reservedId": "RB-1786860919619-759633",
      "createdAt": "2026-08-16T06:15:19.619Z",
      "updatedAt": "2026-08-16T06:18:00.268Z",
      "__v": 0
    }
  ]
}

The original document contains two reservation objects but this documentation preserves the complete response structure while showing the first object as the representative example.

5. Statistics

5.1 User Statistics

Method: GET

Endpoint:

/api/admin/access/stats/users

Response

{
  "success": true,
  "message": "User stats fetched successfully",
  "data": {
    "totalUsers": 2,
    "totalStudents": 2
  }
}

5.2 Book Statistics

Method: GET

Endpoint:

/api/admin/access/stats/books

Response

{
  "success": true,
  "message": "Book stats fetched successfully",
  "data": {
    "totalBookTitles": 1,
    "totalCopies": 12,
    "availableCopies": 9,
    "issuedCopies": 3
  }
}

5.3 Issued Book Statistics

Method: GET

Endpoint:

/api/admin/access/stats/issued

Response

{
  "success": true,
  "message": "Issue stats fetched successfully",
  "data": {
    "totalIssued": 1,
    "activeIssued": 0,
    "totalReturned": 1
  }
}

5.4 Reservation Statistics

Method: GET

Endpoint:

/api/admin/access/stats/reservations

Response

{
  "success": true,
  "message": "Reservation stats fetched successfully",
  "data": {
    "totalReservations": 2,
    "activeReservations": 0,
    "expiredReservations": 2,
    "issuedReservations": 0
  }
}

6. Search Students from Main Database

6.1 Search Student

Method: POST

Endpoint:

/api/main/student/search

Request Body

{
  "query": "tajwarulchowdhury@gmail.com"
}

Response

{
  "success": true,
  "message": "Search results retrieved successfully",
  "data": [
    {
      "_id": "6a80936b155253f787c0cc3c",
      "name": "Tajwarul Hasan Chowdhury",
      "gmail": "tajwarulchowdhury@gmail.com",
      "regNo": "2020331511",
      "gender": "Male",
      "Session": "2020-21",
      "department": "CSE",
      "createdAt": "2026-08-15T16:27:23.489Z",
      "updatedAt": "2026-08-15T16:27:23.489Z",
      "__v": 0
    }
  ]
}

7. API Migration Notes

The following items should be clarified before using this document as the sole source for frontend API integration.

Authentication

The documentation shows login, logout, and /me, but it does not specify:

Whether authentication uses cookies or an Authorization header.

Whether the login response sets an HTTP-only cookie.

Required Axios configuration such as withCredentials: true.

Cookie SameSite, Secure, and domain requirements.

Authentication middleware requirements for protected endpoints.

Expected response when the admin is unauthenticated.

HTTP status codes for authentication errors.

Pagination and Filtering

GET /api/admin/access/books and GET /api/admin/access/students return pagination-related fields, but the documentation does not define:

Supported query parameters.

Meaning of offset, limit, pageCount, and count.

Maximum limit.

Default limit.

Department filter format.

Session filter format.

Whether pagination is page-based or offset-based.

Search pagination behavior.

Error Responses

The document provides successful responses but does not document:

HTTP status codes.

Error response JSON structure.

Validation errors.

Authentication errors.

Authorization errors.

Not-found responses.

Duplicate ISBN/admin/student errors.

Invalid book/student/reservation/issue IDs.

Missing Request/Response Examples

The following endpoints need complete examples:

Issue a reserved book:
POST /api/admin/access/books/:bookId/issue/:reservationId

Return an issued book:
POST /api/admin/access/issued/:issueId/return

Data Model Details

The documentation does not define:

Required vs optional fields.

Field types.

Validation rules.

Allowed values for category.

Allowed values for issue status.

Allowed values for reservation status.

Whether availableCopies can be manually updated.

Whether availableCopies is automatically calculated.

ISBN validation rules.

Maximum/minimum values for copies.

Naming Inconsistencies

The API uses both Session and session-style concepts, but the documented responses contain:

Session
userSession
user_Session

Student search also returns:

gmail

while other student responses use:

email

These should ideally be standardized.

URL Documentation

The original document sometimes gives a full URL and sometimes only a route. This Markdown version normalizes them using the base URL and route notation.

Example Data

The examples contain real-looking names, email addresses, registration numbers, IDs, and passwords. For documentation shared publicly or committed to Git, these should be replaced with dummy values.

8. Recommended Frontend Feature Mapping

For a React + React Query frontend, the documented endpoints can be organized approximately as:

src/
└── features/
    ├── auth/
    │   ├── api/
    │   │   └── auth.api.js
    │   └── hooks/
    │       └── useAuth.js
    │
    ├── books/
    │   ├── api/
    │   │   └── books.api.js
    │   ├── hooks/
    │   │   └── useBooks.js
    │   ├── components/
    │   └── pages/
    │
    ├── students/
    │   ├── api/
    │   │   └── students.api.js
    │   ├── hooks/
    │   │   └── useStudents.js
    │   ├── components/
    │   └── pages/
    │
    ├── issued-books/
    │   ├── api/
    │   │   └── issuedBooks.api.js
    │   └── hooks/
    │       └── useIssuedBooks.js
    │
    ├── reservations/
    │   ├── api/
    │   │   └── reservations.api.js
    │   └── hooks/
    │       └── useReservations.js
    │
    └── dashboard/
        ├── api/
        │   └── stats.api.js
        └── hooks/
            └── useStats.js

This structure is suitable for migrating a fake-data React application feature-by-feature to the real Express API.