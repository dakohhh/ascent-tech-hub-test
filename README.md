# ASCENT HUB TEST API

## Installation

```bash
# install dependencies
yarn install
```

## Running the app

### Start Docker and run the following command

```bash
# start docker
docker-compose -f docker-compose-dev.yaml up
```

### Run the app in development mode

```bash
# run the app
yarn start:dev
```

### Run the app in production mode

```bash
# run the app
yarn start:prod
```

## Technical Challenges & Solutions

### 1. Rate Limiting Implementation

#### Challenge
I faced significant dependency conflicts when implementing rate limiting with @nestjs/throttler:
- NestJS v11 compatibility issues with newer throttler versions
- Redis storage integration problems
- Conflicts between different throttler decorator syntaxes

#### Solution
I resolved this by:
- Downgrading to @nestjs/throttler@2.0.1 for better stability
- Implementing a custom ThrottlerGuard for better control
- Using simpler throttler configuration:
```typescript
export const throttlerConfig: ThrottlerModuleOptions = {
  limit: 10,
  ttl: 60,
  ignoreUserAgents: [/health-check/i],
};
```

#### Current Rate Limits
- Strict: 10 requests per minute (auth endpoints)
- Moderate: 30 requests per minute
- Relaxed: 100 requests per minute
- Minimal: 300 requests per minute

### 2. Authentication System

#### Features
- JWT-based authentication with access and refresh tokens
- Role-based authorization (User, Super Admin)
- Secure token refresh mechanism
- Rate-limited auth endpoints

## Running Tests

```bash
# unit tests
yarn test

# test coverage
yarn test:cov
```

## API Documentation

```bash
# Swagger UI
http://localhost:{$PORT}/docs
```

## Key Features

- 🔐 Authentication & Authorization
- 🛡️ Rate Limiting
- 📊 MongoDB Integration
- 🚀 Redis Caching
- 📝 Swagger Documentation

## Authentication & Security

### Authentication Flow

1. **Registration** (`POST /api/auth/register`)
   - User provides email and password
   - Password is hashed using bcrypt
   - Rate limited to 10 requests per minute
   - Returns user data and authentication tokens

2. **Login** (`POST /api/auth/login`)
   - Validates credentials using Passport local strategy
   - Rate limited to 10 requests per minute
   - Returns:
     - Access token (1 hour expiry)
     - Refresh token (30 days expiry)
     - User data

3. **Token Refresh** (`POST /api/auth/refresh-tokens`)
   - Uses refresh token to generate new access token
   - Validates refresh token using JWT Refresh strategy
   - Rate limited to prevent abuse
   - Invalidates used refresh tokens

4. **Logout** (`POST /api/auth/logout`)
   - Invalidates refresh token
   - Adds token to blacklist in Redis
   - Rate limited to prevent DoS attacks

### Security Measures

1. **Rate Limiting**
   ```typescript
   @Throttle(CONFIGS.RATE_LIMIT.STRICT.LIMIT, CONFIGS.RATE_LIMIT.STRICT.TTL)
   @Post("login")
   async login() { ... }
   ```
   - IP-based and User-based tracking
   - Different tiers: Strict, Moderate, Relaxed, Minimal
   - Redis-backed for distributed systems

2. **JWT Security**
   - Signed using secure secret
   - Short-lived access tokens (1 hour)
   - Refresh token rotation
   - Token blacklisting

3. **Role-Based Access Control (RBAC)**
   ```typescript
   @UseGuards(JWTRoleGuard(CONFIGS.ROLES.SUPER_ADMIN))
   @Get("users")
   async getAllUsers() { ... }
   ```
   - User roles: USER, SUPER_ADMIN
   - Custom guards for role verification
   - Route-level access control
   NOTE: The role-based access control is not implemented in the current version of the API. It is only used for the purpose of the test.

4. **Data Security**
   - Password hashing with bcrypt
   - Input validation using class-validator
   - MongoDB injection protection
   - CORS configuration

## CI/CD Setup

### GitHub Actions Workflow

Our CI/CD pipeline is automated using GitHub Actions, triggered on:
- Push to `main` and `dev` branches
- Pull requests to `main` and `dev` branches

#### 1. Test Job
```yaml
test:
  runs-on: ubuntu-latest
  
  services:
    # Spin up MongoDB container
    mongodb:
      image: mongo:latest
      ports:
        - 27017:27017

    # Spin up Redis container
    redis:
      image: redis:6.2
      ports:
        - 6379:6379
```
- Sets up test environment with MongoDB and Redis
- Uses Node.js 20.x
- Installs dependencies with yarn
- Runs unit tests

#### 2. Build and Push Job
```yaml
build-and-push:
  needs: test
  runs-on: ubuntu-latest
  if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/dev')
```
- Only runs after successful test job
- Triggers on push to main/dev branches
- Uses Docker Buildx for multi-platform builds
- Authenticates with Docker Hub
- Builds and pushes Docker image with tags:
  - `latest`
  - Git SHA for version tracking

#### Required Secrets
- `DOCKERHUB_USERNAME`: Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token

### Development Workflow

1. **Local Development**
   ```bash
   # Start development environment
   docker-compose -f docker-compose-dev.yaml up
   yarn start:dev
   ```

2. **Testing**
   ```bash
   # Run tests with coverage
   yarn test
   yarn test:cov
   ```

### Deployment Pipeline

1. **Build Stage**
   - Lint check
   - Type check
   - Unit tests
   - Build Docker image

2. **Test Stage**
   - Unit tests


### Monitoring
- Sentry for error tracking
- Request/Response logging

## Stay in touch

- Author - [Wisdom Dakoh](https://github.com/dakohhh)
- Website - [ASCENT HUB TEST](https://arewaflix)

## API Routes Documentation

### Authentication Routes (`/api/auth`)

1. **Register** `POST /api/auth/register`
   ```typescript
   @Post("register")
   @Throttle(CONFIGS.RATE_LIMIT.STRICT.LIMIT, CONFIGS.RATE_LIMIT.STRICT.TTL)
   ```
   - Creates new user account
   - Rate limited: 10 requests/minute
   - Body: `RegisterDto` (email, password)
   - Returns: User data + auth tokens

2. **Login** `POST /api/auth/login`
   ```typescript
   @Post("login")
   @UseGuards(LocalAuthGuard)
   @Throttle(CONFIGS.RATE_LIMIT.STRICT.LIMIT, CONFIGS.RATE_LIMIT.STRICT.TTL)
   ```
   - Authenticates user credentials
   - Rate limited: 10 requests/minute
   - Body: `LoginDto` (email, password)
   - Returns: Access token + refresh token + user data

3. **Refresh Tokens** `POST /api/auth/refresh-tokens`
   ```typescript
   @Post("refresh-tokens")
   @UseGuards(JwtRefreshGuard)
   @Throttle(CONFIGS.RATE_LIMIT.STRICT.LIMIT, CONFIGS.RATE_LIMIT.STRICT.TTL)
   ```
   - Generates new access token using refresh token
   - Rate limited: 10 requests/minute
   - Body: `RefreshTokenDto`
   - Returns: New access + refresh tokens

4. **Logout** `POST /api/auth/logout`
   ```typescript
   @Post("logout")
   @UseGuards(JwtRefreshGuard)
   @Throttle(CONFIGS.RATE_LIMIT.MODERATE.LIMIT, CONFIGS.RATE_LIMIT.MODERATE.TTL)
   ```
   - Invalidates refresh token
   - Rate limited: 30 requests/minute
   - Requires: Valid refresh token
   - Returns: Success boolean

### User Routes (`/api/users`)

1. **Get User Session** `GET /api/users/session`
   ```typescript
   @Get("session")
   @UseGuards(JwtAuthGuard)
   @SkipThrottle(true)
   ```
   - Returns current user's session data
   - Requires: Valid access token
   - No rate limit

2. **Get All Users** `GET /api/users`
   ```typescript
   @Get("")
   @UseGuards(JWTRoleGuard(CONFIGS.ROLES.SUPER_ADMIN))
   @Throttle(CONFIGS.RATE_LIMIT.RELAXED.LIMIT, CONFIGS.RATE_LIMIT.RELAXED.TTL)
   ```
   - Lists all users (paginated)
   - Rate limited: 100 requests/minute
   - Requires: Super Admin role
   - Query params: PaginationDto

3. **Create User** `POST /api/users`
   ```typescript
   @Post()
   @UseGuards(JWTRoleGuard(CONFIGS.ROLES.SUPER_ADMIN))
   @Throttle(CONFIGS.RATE_LIMIT.STRICT.LIMIT, CONFIGS.RATE_LIMIT.STRICT.TTL)
   ```
   - Creates new user (admin only)
   - Rate limited: 10 requests/minute
   - Requires: Super Admin role
   - Body: CreateUserDto

4. **Get User** `GET /api/users/:userId`
   ```typescript
   @Get(":userId")
   @UseGuards(JWTRoleGuard(CONFIGS.ROLES.SUPER_ADMIN))
   @Throttle(CONFIGS.RATE_LIMIT.RELAXED.LIMIT, CONFIGS.RATE_LIMIT.RELAXED.TTL)
   ```
   - Retrieves specific user details
   - Rate limited: 100 requests/minute
   - Requires: Super Admin role

5. **Update User** `PUT /api/users/:userId`
   ```typescript
   @Put(":userId")
   @UseGuards(JWTRoleGuard(CONFIGS.ROLES.USER))
   @Throttle(CONFIGS.RATE_LIMIT.STRICT.LIMIT, CONFIGS.RATE_LIMIT.STRICT.TTL)
   ```
   - Updates user profile
   - Rate limited: 10 requests/minute
   - Requires: User role
   - Body: UpdateUserDto

6. **Delete User** `DELETE /api/users/:userId`
   ```typescript
   @Delete(":userId")
   @UseGuards(JWTRoleGuard(CONFIGS.ROLES.SUPER_ADMIN))
   @Throttle(CONFIGS.RATE_LIMIT.STRICT.LIMIT, CONFIGS.RATE_LIMIT.STRICT.TTL)
   ```
   - Deletes a user account
   - Rate limited: 10 requests/minute
   - Requires: Super Admin role
   - Safety check: Cannot delete own account
   - Returns: Deleted user data (without password)

### App Routes (`/`)

1. **Welcome** `GET /`
   ```typescript
   @Get()
   ```
   - Returns welcome message
   - No authentication required

2. **Health Check** `GET /health`
   ```typescript
   @Get("/health")
   ```
   - Returns API health status
   - No authentication required
   - Used by monitoring systems

### API Documentation
- Swagger UI available at `/docs`
- Protected with basic auth
- Credentials in environment config
