# TeamTime Project Guide

## Table of Contents

1. [URL for Deployed Web Application](#1-url-for-deployed-web-application)
2. [How to Run the Project on Your Local Machine](#2-how-to-run-the-project-on-your-local-machine)
   - [Prerequisites](#prerequisites)
   - [Cloning the Repository](#cloning-the-repository)
   - [Installing Dependencies](#installing-dependencies)
   - [Configuring the Environment](#configuring-the-environment)
   - [Running the Application](#running-the-application)
   - [Verifying the Installation](#verifying-the-installation)

## Introduction

**TeamTime** is a smart shift management system that optimizes workforce scheduling through an intuitive interface and advanced algorithms. This guide will help you deploy the application, configure it locally, and get it up and running quickly.

## 1. URL for Deployed Web Application

You can access the deployed web application at the following URL:  
[https://shifty-rho.vercel.app/](https://shifty-rho.vercel.app/)

### Admin Access

To access the admin side of the application:

1. Navigate to the deployed web application.
2. Log in with the following admin credentials:
   - **Username**: `itamar`
   - **Password**: `zand`
3. Once logged in, you will have access to the admin dashboard.

### Employee Login Example

To access the employee side of the application:

1. Navigate to the deployed web application.
2. Fill in the required details in the login form. Here is an example:
   - **Name**: `demo`
   - **Password**: `demo`
3. Once logged in, you will have access to the employee dashboard.

_Note_: The admin can add more employees from the admin dashboard.

## 2. How to Run the Project on Your Local Machine

### Prerequisites

Before starting, ensure you have installed the following tools:

- **Node.js**: [Download & install Node.js](https://nodejs.org/en/download/)
- **Git**: [Download & install Git](https://git-scm.com/downloads)

### Cloning the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/ItamarZand88/TeamTime.git
cd TeamTime
```

### Installing Dependencies

Install dependencies for the root, client, and server directories:

```bash
# Install root dependencies (for concurrently)
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

### Configuring the Environment

Set up the environment variables.

#### Client Environment

Create a `.env` file in the `client` directory:

```plaintext
VITE_API_URL=http://localhost:3001
```

#### Server Environment

Create a `.env` file in the `server` directory with your MongoDB URI:

```plaintext
MONGODB_URI=mongodb://username:password@host:port/database
```

### Running the Application

Start both the client and the server simultaneously using `concurrently`:

```bash
npm start
```

This will run the client at [http://localhost:5173](http://localhost:5173) and the server at [http://localhost:3001](http://localhost:3001).

### Verifying the Installation

Visit `http://localhost:5173` to verify that the client is running correctly. The server is accessible via API calls at `http://localhost:3001`.

---
