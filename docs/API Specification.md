**API Specification** for HCMUT_SSPS Printing and Management System, backend: Java + MVC

---

## **API Overview**

### Base URL: `/api\v1`

### **Authentication:**
- **API-TOKEN** is used for user authentication.
- The token must be included in the request header: `Authorization: Bearer <API-TOKEN>`

---

## **1. Authentication API (Xác thực người dùng)**

### **1.1. REGISTER**
- **Method**: `POST`
- **Endpoint**: `/auth/register`
- **Description**:  Registers a new user.
- **Request Body**:
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string"
    }
    ```
- **Response**:
    - **201 Created**:
      ```json
      {
        "message": "User registered successfully",
        "user_id": "string"
      }
      ```
    - **400 Bad Request**: Invalid information (Input validation failed).
    - **409 Conflict**: Email already exists.

---

### **1.2. LOGIN**
- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Description**: Authenticates a user by verifying their login credentials.
- **Request Body**:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
- **Response**:
    - **200 OK**:
      ```json
      {
        "message": "Login successful",
        "token": "JWT-token"
      }
      ```
    - **401 Unauthorized**: Incorrect login credentials

---

### **1.3. FORGOT PASSWORD**
- **Method**: `POST`
- **Endpoint**: `/auth/forgot-password`
- **Description**: Gửi liên kết đặt lại mật khẩu qua email.
- **Request Body**:
    ```json
    {
      "email": "string"
    }
    ```
- **Response**:
    - **200 OK**:
      ```json
      {
        "message": "Password reset link sent to your email"
      }
      ```
    - **404 Not Found**: Email does not exist.

---

### **1.4. CHANGE PASSWORD**
- **Method**: `POST`
- **Endpoint**: `/auth/reset-password`
- **Description**: Allows the user to reset their password using a token from the reset link.
- **Authorization**: Bearer Token (JWT)
- **Request Body**:
    ```json
    {
      "token": "reset_token_here",
      "new_password": "string"
    }
    ```
- **Response**:
    - **200 OK**:
      ```json
      {
        "message": "Password changed successfully"
      }
      ```
    - **401 Unauthorized**: Invalid or expired token.

---
### **1.5. LOG OUT**
- **Method**: `POST`
- **Description**: Logs out the user by invalidating their session or JWT token.

- **Response**:
    - **200 OK**:
      ```json
      {
        "message": "Logout successful"
      }
      ```
---

## **2. DISPLAY AVAILABLE PAPER AND PURCHASE PAPER**

### **2.1. Get The Available (default) Paper Number **
- **Method**: `GET`
- **Endpoint**: `/api/v1/paper/default-paper`
- **Description**: Retrieve the default paper number from the system.
- **Query Parameters**:
    - `NO`: No query parameters needed.
- **Response**:
    - **200 OK**:
    ```json
      {
        "default_paper_number": 12345,
        "eventTime": "2024-12-02 10:30:00"
      }
    ```
- **Access**:
    - **403 Forbidden**: If the user does not have access.

---

### **2.2. Get The Available Purchased Paper Number**
- **Method**: `GET`
- **Endpoint**: `/api/v1/paper/deafault-paper`
- **Description**: Retrieve the purchased paper number from the system.
- **Query Parameters**:
    - `NO`: No query parameters needed.
- **Response**:
    - **200 OK**:
    ```json
      {
        "purchased_paper_number": 12345,
        "eventTime": "2024-12-02 10:30:00"
      }
    ```
- **Access**:
    - **403 Forbidden**: If the user does not have access.

---

### **2.3. Get The Total Paper Number**
- **Method**: `GET`
- **Endpoint**: `/api/v1/funding-rate`
- **Description**: Sum of two paper types.
- **Query Parameters**:
    - `NO`: No query parameters needed.
- **Response**:
    - **200 OK**:
    ```json
      {
        "total_paper_number": 12345,
        "eventTime": "2024-12-02 10:30:00"
      }
    ```
- **Access**:
    - **403 Forbidden**: If the user does not have access.

---
### **2.4. Buy Paper**
- **Method**: `POST`
- **Endpoint**: `/api/v1/paper/buy`
- **Description**: Purchase a paper and receive the corresponding paper number.
- **Authorization**: Bearer Token (JWT)
- **Requrest Body**:
    - `Content-Type`: application/json
    ```json
    {   
        "quantity": 1,
        "payment_method": "BK_pay",
        "user_id": 12345
    }
    ```
- **Response**:
    - **200 OK**:
      ```json
      {
        "message": "The paper purchase was successful.",
        "purchased_paper_number": 67890,
        "eventTime": "2024-12-02 11:00:00"
      }
      ```
- **Access**:

    - **403 Forbidden**: If the user does not have access.
    - **400 Bad Request**: Invalid user ID or parameters.
    ```json
      {
        "error": "Payment failed. Please check."
      }
    ```
---

### **2.5. Get Purchase History**
- **Method**: `GET`
- **Endpoint**: `/api/v1/paper/purchase-history`
- **Description**: Retrieve the history of purchased papers for a specific user.
- **Authorization**: Bearer Token (JWT)
- **Requrest Body**:
    - `user_id`: The ID of the user for whom the purchase history is being retrieved.
    - `limit`: The maximum number of records to retrieve (default is 10).
    - **/api/v1/paper/purchase-history?user_id=12345&limit=5**
- **Response**:
    - **200 OK**:
      ```json
      {
        "user_id": 12345,
        "purchase_history": [
          {
            "purchased_paper_number": 67890,
            "paper_type": "default",
            "quantity": 1,
            "purchase_date": "2024-12-01 09:00:00",
            "payment_method": "BK_pay"
          },
          {
            "purchased_paper_number": 67891,
            "paper_type": "premium",
            "quantity": 2,
            "purchase_date": "2024-11-25 14:30:00",
            "payment_method": "BK_pay"
          }
        ],
      "total": 2,
      "limit": 5,
      }
      ````
- **Access**:

    - **403 Forbidden**: If the user does not have access.
    - **404 Not Found**: 
      ```json
      {
        "error": "No purchase history found for the given user."
      }
    ```

### **2.6. Get Purchase History Depend On Time**
- **Method**: `GET`
- **Endpoint**: `/api/v1/paper/history-purchase`
- **Description**: Retrieve the history of purchased papers for a specific user.
- **Authorization**: Bearer Token (JWT)
- **Request Body**:
    - `user_id`: The ID of the user for whom the purchase history is being retrieved.
    - `start_date`: The start date of the time range in YYYY-MM-DD format (e.g., 2024-11-01).
    - `end_date`: The end date of the time range in YYYY-MM-DD format (e.g., 2024-12-01).
    - `limit`: (optional) The maximum number of records to retrieve (default is 10).
    - **/api/v1/paper/purchase-history/time-range?user_id=12345&start_date=2024-11-01&end_date=2024-12-01&limit=5**
- **Response**:
    - **200 OK**:
      ```json
      {
        "user_id": 12345,
        "purchase_history": [
          {
            "purchased_paper_number": 67890,
            "paper_type": "default",
            "quantity": 1,
            "purchase_date": "2024-12-01 09:00:00",
            "payment_method": "BK_pay"
          },
          {
            "purchased_paper_number": 67891,
            "paper_type": "premium",
            "quantity": 2,
            "purchase_date": "2024-11-25 14:30:00",
            "payment_method": "BK_pay"
          }
        ],
      "total": 2,
      "limit": 5,
      }
      ````
- **Access**:

    - **403 Forbidden**: If the user does not have access.
    - **404 Not Found**: 
      ```json
      {
        "error": "No purchase history found for the given user."
      }
    ```




## **3. EVERYTHING ABOUT PRINTER**

### **3.1. Get Available Printers**
- **Method**: `GET`
- **Endpoint**: `/api/v1/printer/status`
- **Description**: Get available printers.
- **Authorization**: Bearer Token (JWT)
- **Request Body**:
    - `location`: The location or department where the printers are placed. (e.g: "LTK","DA")
    - **/api/v1/printer/status?location=LTK**
- **Response**:
    - **200 OK**:
      ```json
      {
        "location": "LTK",

        "printer": [
          {
            "printer_id": 101,
            "building" : "A3",
            "status": "available",
            "last_update": "2024-12-01 10:30:00"
          },
          {
            "printer_id": 102,
            "building" : "A3",
            "status": "maintance",
            "last_update": "2024-12-01 10:30:00"
          },
          {
            "printer_id": 110,
            "building" : "A4",
            "status": "available",
            "last_update": "2024-12-01 10:30:00"
          },
        ]
      }
      ```
- **Access**:
    - **400 Bad Request**: .
---

### **3.2. Print file**
- **Method**: `POST`
- **Endpoint**: `/api/v1/printer/print`
- **Description**: Print files.
- **Authorization**: Bearer Token (JWT)
- **Request Body**:
  - `Content-Type`: application/json
    ```json
    {   
        "user_id": 12345,
        "printer_id": 110,
        "file": "test.txt (pending processing)", 
        "copies": 2,
        "one-sided": 2,
        "sized": "A4",
        "page_range": "[int],[int]",
        "zoom": "100"
    }
    ```
- **Response**:
    - **200 OK**:
      ```json
      {
        "message":"Success for printing",
        "print_order_id": 123456789,
        "expected_wait_time": 360,
        "date_created": "2024-12-01 09:00:00"
      }
      ```
- **Access**:
    - **400 Bad Request**: Decription of the error.

---

### **3.3. Get Printer Order Status**
- **Method**: `GET`
- **Endpoint**: `/api/v1/vip2/printer/order`
- **Description**: Get print status of the file..
- **Authorization**: Bearer Token (JWT)
- **Request Body**:
    - `print_order_id`: ID of printing. 
    - **/api/v1/printer/order?order_id=123456789**
- **Response**:
    - **200 OK**:
      ```json
      { 
        "status": "Success",
        "printer_id": 110,
        "file": "test.txt (pending processing)", 
        "copies": 2,
        "one-sided": 2,
        "sized": "A4",
        "page_range": "[int],[int]",
        "zoom": "100",
        "created_time": "2024-12-01 09:00:00",
        "expected_wait_time": 360,
      }
      ```
    - **404 Not Found**: 

---
### **3.4. Get History Of Printing**
- **Method**: `GET`
- **Endpoint**: `/api/v1/printer/history-printing`
- **Description**: Get history of printing.
- **Authorization**: Bearer Token (JWT)
- **Request Body**:
  - `user_id` : ID of user.
  - `limit` : The maximum number of records to retrieve (default is 10).
    - **/api/v1/printer/history-printing?user_id=12345&limit=5**
- **Response**:
    ```json
      {
        "user_id": 12345,
        "printing_history": [
          { 
            "print_order_id": 123456789,
            "printer_id" : 110,
            "file": "test.txt (pending processing)", 
            "copies": 2,
            "one-sided": 2,
            "sized": "A4",
            "page_range": "[int],[int]",
            "zoom": "100",
            "created_time": "2024-12-01 09:00:00",
            "expected_wait_time": 360,
          },
          {
            "print_order_id": 123456783,
            "printer_id" : 101,
            "file": "test.txt (pending processing)", 
            "copies": 2,
            "one-sided": 2,
            "sized": "A4",
            "page_range": "[int],[int]",
            "zoom": "100",
            "created_time": "2024-12-01 09:00:00",
            "expected_wait_time": 360,
          }
        ],
      "total": 2,
      "limit": 5,
      }
    ```

- **404 Not Found**: 
- 
---
### **3.5. Get History Of Printing Depend On Time**
- **Method**: `GET`
- **Endpoint**: `/api/v1/printer/history-printing`
- **Description**: Get history of printing.
- **Authorization**: Bearer Token (JWT)
- **Request Body**:
  - `user_id` : ID of user.
  - `start_date`: The start date of the time range in YYYY-MM-DD format (e.g., 2024-11-01).
  - `end_date`: The end date of the time range in YYYY-MM-DD format (e.g., 2024-12-01).
  - `limit`: (optional) The maximum number of records to retrieve (default is 10).
  - **/api/v1/printer/history-printing/time-range?user_id=12345&start_date=2024-11-01&end_date=2024-12-01&limit=5**
- **Response**:
    ```json
      {
        "user_id": 12345,
        "printing_history": [
          { 
            "print_order_id": 123456789,
            "printer_id" : 110,
            "file": "test.txt (pending processing)", 
            "copies": 2,
            "one-sided": 2,
            "sized": "A4",
            "page_range": "[int],[int]",
            "zoom": "100",
            "created_time": "2024-12-01 09:00:00",
            "expected_wait_time": 360,
          },
          {
            "print_order_id": 123456783,
            "printer_id" : 101,
            "file": "test.txt (pending processing)", 
            "copies": 2,
            "one-sided": 2,
            "sized": "A4",
            "page_range": "[int],[int]",
            "zoom": "100",
            "created_time": "2024-12-01 09:00:00",
            "expected_wait_time": 360,
          }
        ],
      "total": 2,
      "limit": 5,
      }
    ```
- **404 Not Found**: 
---

## **4. User**


## **5. User Management API (Quản lý tài khoản)**

### **6 . Xem thông tin tài khoản**
- **Method**: `GET`
- **Endpoint**: `/api/v1/user/me`
- **Description**: Lấy thông tin tài khoản người dùng hiện tại.
- **Authorization**: Bearer Token (JWT)


- **Response**:
    - **200 OK**:
      ```json
      {

      }
      ```

---

### **6.2. Chỉnh sửa thông tin tài khoản**
- **Method**: `PUT`
- **Endpoint**: `/api/v1/user/me`
- **Description**: Chỉnh sửa thông tin tài khoản người dùng.
- **Authorization**: Bearer Token (JWT)
- **Request Body**:
    ```json
    {
      "name": "string",
      "email": "string"
    }
    ```
- **Response**:
    - **200 OK**:
      ```json
      {
        "message": "User information updated successfully"
      }
      ```
    - **400 Bad Request**: Nếu thông tin không hợp lệ.

---

### **6.3. Xóa tài khoản**
- **Method**: `DELETE`
- **Endpoint**: `/api/v1/user/me`
- **Description**: Xóa tài khoản người dùng hiện tại.
- **Authorization**: Bearer Token (JWT)
- **Response**:
    - **200 OK**:
      ```json
      {
        "message": "User account deleted successfully"
      }
      ```

---

## **7. Admin API (Quản trị hệ thống)**


**Documentation and Error Handling**
---
**Common Responses**

`200 OK`: Thao tác thành công.

`201 Created`: Tài nguyên được tạo thành công.

`204 No Content`: Thao tác thành công, không có nội dung trả về.

`400 Bad Request`: Dữ liệu không hợp lệ hoặc thiếu thông tin.

`401 Unauthorized`: Người dùng không được phép truy cập tài nguyên.

`404 Not Found`: Tài nguyên không tìm thấy.

`500 Internal Server Error`: Lỗi không xác định trên server.

**Security Considerations**

