# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm start` - Runs the app in development mode at http://localhost:3000
- **Run tests**: `npm test` - Launches the interactive test runner  
- **Build for production**: `npm run build` - Creates optimized production build in `build/` folder
- **Eject configuration**: `npm run eject` - One-way operation to expose Create React App configuration

## Architecture Overview

This is a React application built with Create React App that serves as a real estate platform called "Velia". The application has a multi-tenant architecture supporting both realtor and customer interfaces.

### Key Technologies
- **React** with functional components and hooks
- **React Router DOM** for client-side routing
- **Tailwind CSS** for styling
- **Axios** for HTTP requests
- **Criipto** for authentication integration
- **JWT** for token-based authentication

### Application Structure

**Authentication Flow**:
- JWT-based authentication with access/refresh token pattern
- AuthContext provides centralized auth state management in `src/context/AuthContext.js`
- Automatic token refresh 30 seconds before expiry
- Axios interceptors handle auth headers and 401 retries in `src/lib/axiosClient.js`
- Alternative fetch-based API client in `src/utils/api.js`

**Routing Architecture**:
- Multi-role routing supporting realtors and customers
- Realtor dashboard at `/dashboard` with nested routes for groups management
- Customer-specific routes at `/:string/customer/` for multi-tenant customer access
- Authentication controllers handle OAuth callbacks and token exchange

**Component Organization**:
- `src/components/` - Reusable UI components (V_Input, V_Popup, V_SelectObject)
- `src/views/` - Page-level components organized by user role
- `src/controllers/` - Authentication flow handlers
- `src/utils/` - Utility functions for API calls and JWT handling
- `src/svg/` - SVG components for branding

**API Integration**:
- Base API URL: `https://api.velia.se/api/v1`
- Centralized in `src/lib/axiosClient.js` with request/response interceptors
- JWT tokens stored in sessionStorage with automatic refresh mechanism

### Multi-Tenant Customer Architecture

The application supports multiple customer tenants through:
- Dynamic routing: `/:string/customer/login` and `/:string/customer/dashboard`
- Customer-specific authentication controller
- Isolated customer dashboard with task management functionality

### State Management

- React Context for authentication state
- Local component state for UI interactions  
- No external state management library (Redux/Zustand) currently used

## Complete API Backend Integration

### API Architecture
**Base URL**: `https://api.velia.se/api/v1`
**Documentation**: `https://api.velia.se/api/v1/docs/`
**Schema**: `https://api.velia.se/api/v1/schema/`

### Authentication System
- **BankID Integration**: `/auth/bankid/login/` - Swedish national ID authentication via Criipto
- **JWT Tokens**: Access/refresh token pairs with automatic 30-second pre-expiry refresh
- **Multi-tenant Authentication**: Organization-specific customer login flows
- **Role-Based Access Control**: customer, realtor, coordinator roles
- **Token Refresh**: `/api/v1/token/refresh/` endpoint for seamless re-authentication
- **Logout**: `/api/v1/auth/logout` for session termination

### Core Data Models & Endpoints

**User Management (`/users/`)**:
- **Staff Endpoints**: `/users/staff/?role=coordinator` - Get coordinators for group assignment
- **Customer Creation**: `/users/customers/` - Create customers with BankID verification
- **User Roles**: customer, realtor, coordinator with organization associations
- **Profile Management**: User details, organization relationships

**Group Management (`/groups/`)**:
- **My Groups**: `/groups/mine/` - List realtor's property groups
- **CRUD Operations**: Create, read, update, delete property sale groups
- **Group Structure**: Links realtors, customers, coordinators to specific properties
- **Property Details**: Address, postal code, city information

**Task System (`/tasks/`, `/task-templates/`, `/task-responses/`)**:
- **Task Templates**: Reusable form structures with dynamic question types
- **Task Assignment**: Work items assigned to customers (forms, documents)
- **Task Responses**: Customer-completed forms with answers and status tracking
- **Response Management**: `/task-responses/{id}/` - Load, update, complete customer forms
- **PDF Generation**: `/task-responses/{id}/generate_pdf/` - Document export functionality

**Organization Management**:
- **Multi-tenant Structure**: Separate real estate agencies with data isolation
- **Branding Support**: Organization logos and themes for customer interfaces
- **URL-based Tenancy**: `/{org}/customer/` routing patterns

### Frontend-Backend Integration Patterns

**Authentication Flow**:
```
Login.js → Criipto BankID → Callback.js → AuthenticationController.js 
→ /auth/bankid/login/ → JWT tokens → AuthContext.js
```

**Realtor Dashboard Integration**:
- `DashboardGroups.js` ↔ `GET /groups/mine/` - List and manage property groups
- `DashboardGroupsCreate.js` ↔ `POST /users/customers/` + `POST /groups/` - Two-step group creation
- Coordinator selection ↔ `GET /users/staff/?role=coordinator` - Staff dropdown population

**Customer Task System Integration**:
- `ViewForm.js` ↔ `GET /task-responses/{id}/` - Dynamic form loading
- Auto-save ↔ `PUT /task-responses/{id}/` - Real-time form state persistence (every 10s)
- PDF export ↔ `POST /task-responses/{id}/generate_pdf/` - Document generation
- Form completion status tracking and progress indicators

**Template Engine Integration**:
- `TemplateController.js` renders forms from API-provided JSON schemas
- Supports conditional field visibility based on other field values
- Multiple question types: text, numeric, boolean, choice, date, display
- Multi-page form navigation with progress tracking

### Multi-Tenant Workflow

**Organization Isolation**:
- URL-based routing: `/{orgName}/customer/login?oid={orgId}`
- Backend enforces data isolation by organization ID
- Customer authentication includes organization context
- Organization-specific branding and interface customization

**User Hierarchy & Workflows**:
1. **Realtors**: Create property groups, assign coordinators, add customers, monitor task completion
2. **Coordinators**: Oversee transaction processes, assigned to specific property groups  
3. **Customers**: Access organization-branded interface, complete assigned tasks, generate documents

### Task Management Complete Workflow

**1. Group Creation (Realtor Dashboard)**:
- Realtor creates property group with address details
- Selects coordinator from organization staff
- Adds customers (creates customer accounts with BankID data)
- System assigns tasks based on property transaction requirements

**2. Task Assignment & Templates**:
- Tasks created from configurable templates stored in backend
- Dynamic form generation with conditional logic
- Progress tracking and status management (pending, in-progress, completed)
- Auto-save functionality prevents data loss

**3. Customer Task Completion**:
- Multi-tenant login to organization-specific branded interface  
- Form completion with real-time validation and auto-save
- PDF generation for completed forms and documents
- Status updates propagate back to realtor dashboard

### API Features & Capabilities

**Backend Capabilities**:
- **OpenAPI 3.0** documented REST API with comprehensive schema
- **Pagination & Filtering** on list endpoints for large datasets
- **Role-based Access Control** enforced at API level
- **Image Upload Support** for document attachments
- **PDF Generation Pipeline** for form completion
- **Multi-tenant Data Isolation** ensuring organization security
- **Search Functionality** across entities

**Error Handling & Reliability**:
- JWT token refresh with 401 retry logic in axios interceptors
- Comprehensive error responses with detailed messages
- Session persistence across browser tabs via sessionStorage
- Automatic logout on authentication failures