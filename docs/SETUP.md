# Local Development Setup

To work on this project without Docker, follow these instructions:

## 1. Backend Setup

Prerequisites: Python 3.9+

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server using uvicorn:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

## 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Serve the static files using a simple HTTP server (any will do, for example, Python's built-in server):
   ```bash
   python -m http.server 3000
   ```

3. Open your browser to `http://localhost:3000`.

## Git Workflow (Team Rule)

Remember to follow the team workflow rules:
* Always create branches: `feat/*`, `fix/*`, `chore/*`
* Use standard commit messages (e.g. `feat: added impact calculator format`)
* Create pull requests for review before merging.
