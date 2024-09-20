
# Clinical Trial Search Application


https://github.com/user-attachments/assets/5d5e372c-4aab-46db-8d9f-d537abf9cfd9


## Overview
This application is designed to help clinical researchers, search through clinical trials related to a specific disease and or involving a specific drug/therapy/technique. The backend leverages OpenAI embeddings and FAISS for advanced search, providing relevant clinical trials from the `clinical_trials.json` dataset which includes 10000 trial records.

### Features:
- **Advanced Search**: Allows users to search for specific disease trials along with relevant drugs.
- **Embedding-based Search**: Uses OpenAI embeddings to capture variations of terms, such as NSCLC being referred to as "non-small cell lung cancer", "NSCLC", etc.
- **Efficient Retrieval**: FAISS is used for fast and efficient retrieval of similar clinical trials.

## Project Structure

### Frontend:
- **`src/components/SearchForm.tsx`**: This component provides the search interface, allowing users to input a **Disease** and **Drug** for searching clinical trials. It uses **Material UI** for styling the form inputs and button.
- **`src/components/TrialCard.tsx`**: Displays individual clinical trial details in a card format. Each card shows the title, status, conditions, and location of a clinical trial, and provides a link to detailed information.
- **`src/components/TrialList.tsx`**: A container that renders a list of `TrialCard` components to display search results.
- **`src/App.tsx`**: The main application component that ties everything together, including routing and rendering the search form and trial results.

### Backend:
- **`main.py`**: This is the entry point for the FastAPI server. It sets up the REST API endpoints and handles the search logic using FAISS for similarity search. The OpenAI API key is set here for embedding generation.
- **`embedding.py`**: This script generates embeddings for the clinical trial data using OpenAI embeddings and stores them in a FAISS index for fast retrieval.
- **`requirements.txt`**: Lists the Python dependencies needed for the backend, including FastAPI, FAISS, and OpenAI API.
- **`clinical_trials.json`**: The dataset containing all clinical trial data that is used for searching.
- **`clinical_trials.index`**: The FAISS index file that stores embeddings for quick retrievel for trials.
- **`tests`**: Contains unit test test_main.py to ensure main.py functionality work as expected.
- **`metadata.json`**: Stores additional metadata related to the clinical trials, such as index mappings or embedding details.

## Installation:

### Backend Setup:
1. Create a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

2. Install dependencies and download and add dataset from "" in JSON format and add file to `/backend`, rename file to `clinical_trial.json`:
    ```bash
    pip install -r requirements.txt
    ```

3. Generate embeddings and create the FAISS index in `clinical_trials.index`:
    ```bash
    python embedding.py
    ```

4. Start the FastAPI server:
    ```bash
    python uvicorn main:app --reload
    ```

### Frontend Setup:
1. Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the frontend:
    ```bash
    npm start
    ```

## Usage:
Once both the frontend and backend are running, you can access the application at `http://localhost:3000`. The application allows you to search through the dataset by entering queries related to clinical trials. 

## How It Works:
### In our context, we'll use RAG to:

**Retrieve**: Use a retriever to find relevant clinical trials based on user queries.
**Augment**: Enhance search capabilities using embeddings to handle synonyms and semantic similarity.
**Generate**: Display the titles of the relevant clinical trials to the user.

1. **Data Loading**: The backend loads the clinical trials dataset from `clinical_trials.json` and generates embeddings for each clinical trial's title and relevant data.
2. **Embedding Search**: The OpenAI embeddings are used to capture semantic similarities between different representations of the same disease or therapy.
3. **FAISS Indexing**: FAISS enables fast search through these embeddings, returning the most relevant trials for the user's query.
4. **Frontend-Backend Communication**: The frontend sends search queries to the backend via REST API, and the results are displayed in a user-friendly interface.

### Embedding the Dataset

**Embeddings**: We use OpenAI's embeddings to convert textual information into vector representations.
**Texts to Embed**: We combine the official title and brief summary of each trial for richer context.
**Semantic Search**: Embeddings capture semantic meaning, allowing us to find relevant trials even if they use different terms (e.g., synonyms).
**User Query Embedding**: The user's input is embedded and compared against the dataset embeddings to find the most semantically similar trials.

### Advanced Search Functionality
**Combined Queries**: By combining disease and therapy in the query, we ensure the search considers both aspects.
**Relevance Ranking**: FAISS returns the top k most similar trials based on the query embedding.


## Deployment:
For deployment AWS EC2, Heroku can be used for using computing nodes. AFter containerizing using docker.
### Dockerfile.backend
```bash
FROM python:3.8-slim

WORKDIR /app

COPY ./backend/requirements.txt /app/requirements.txt
RUN pip install requirements.txt

COPY ./backend /app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```
### Dockerfile.frontend
```bash
FROM node:16-alpine

WORKDIR /app

COPY ./frontend/package*.json ./
RUN npm install

COPY ./frontend /app

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Alternatives to Loading the Dataset in Memory:

Vector DB: Pinecone, Weaviate to handle vector embeddings.

Traditional Databases: Store the dataset in a RDBMS like PostgreSQL and use full-text search capabilities.

Reasons to Use Alternatives:

Scalability: For larger datasets that don't fit into computational memory, databases provide scalable storage.

Performance: Databases optimize indexing and querying, improving search performance.

Features: Filtering, sorting, access control, and concurrency support.

Maintenance: Easier to update and manage data without rebuilding in-memory structures.

## How do we evaluate completeness of results?

Recall and Precision: Measure how many relevant trials are retrieved (recall) and how many retrieved trials are relevant (precision).

User Feedback: Collect feedback from Sarah to identify missing or irrelevant results.

Benchmarking: Compare the application's results with established platforms like ClinicalTrials.gov for consistency.

Synonym Coverage: Regularly update the model and embeddings to include new terms and synonyms.

A/B Testing: Test different retrieval methods to see which provides more complete results.



## Testing:
Unit test for the main.py is located in the `tests` folder. Run the test using:
```bash
pytest
```
