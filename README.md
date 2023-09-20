H.EAT FOOD DELIVERY APP

Technical Features:

Backend with FastAPI: Leverage the power of FastAPI for building efficient and scalable APIs. Benefit from automatic interactive API documentation, data validation, and asynchronous request handling.

Data Validation with Pydantic: Ensure that the data your application processes are accurate and in the correct format. Pydantic's data validation and settings management using Python type annotations guarantee data integrity.

Database Migrations with Alembic: Maintain and upgrade your database schema seamlessly. Alembic provides the ability to autogenerate migration scripts and manage version control.

OAuth2 & JWT Authentication: Implement a secure authentication system using OAuth2 with Password (and hashing), including JWT tokens. Protect your user's data and provide secure endpoints for your services.

PostgreSQL Integration: Use the power of PostgreSQL for robust, scalable, and relational data storage. Ensure data integrity and benefit from powerful query capabilities.

Responsive Frontend with React: Harness the React library's component-based architecture for building user interfaces. Ensure a dynamic, efficient, and smooth user experience.

Styling with SCSS: Utilize SCSS to write clean, maintainable, and efficient styles. Benefit from variables, nesting, mixins, and more.

Interactivity with JavaScript & JSX: Implement rich interactive UI components and enhance user interactions using the blend of JavaScript and JSX.

Comprehensive Testing: Assure the quality and reliability of your platform with a suite of tests. Maintain high standards and ensure consistent performance


Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Node.js and npm: Download & Installation guide
Python: Download & Installation guide

PostgreSQL: Download & Installation guide
Installation & Setup
Clone the repository:
bash
Copy code
git clone https://github.com/mishamcfeat/FOOD_DELIVERY_APP.git
cd FOOD_DELIVERY_APP

Set up the frontend:
Navigate to the frontend directory:

bash
Copy code
cd frontend
Install the required npm packages:

bash
Copy code
npm install
Set up the backend:
Navigate to the backend directory:

bash
Copy code
cd ../backend
Install the required Python packages:

bash
Copy code
pip install -r requirements.txt

Setting up the PostgreSQL database:
Ensure that PostgreSQL is running and create a database for your application

To import an SQL dump:

bash
Copy code
psql your_database_name < dump.sql
Note: Remember to add sensitive data, such as database passwords, to a .env file or use environment variables and ensure this data is not committed to your public repository!

Running the application
Start the frontend:
From the frontend directory:

bash
Copy code
npm start
This will start the frontend on http://localhost:3000 (or another port if 3000 is occupied).

Start the backend:
From the backend directory:

bash
Copy code
uvicorn main:app --reload
Your backend API should now be running on http://localhost:8000.
