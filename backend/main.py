from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import json
import numpy as np
import faiss
from langchain_openai import OpenAIEmbeddings
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Set OpenAI API key
os.environ['OPENAI_API_KEY'] = 'sk-eCzuP5RxQGt9XVVJN_qiazdZucmhAlpaeJbQ3NZP5tT3BlbkFJGHtEuYdnJNpUTpijm9OtZxVC6M8o7ft0F5rU2Jy6gA'

# Load the FAISS index and metadata
index = faiss.read_index('clinical_trials.index')
with open('metadata.json', 'r') as f:
    metadata = json.load(f)

# Load the full dataset
with open('clinical_trials.json', 'r') as f:
    dataset = json.load(f)

embeddings = OpenAIEmbeddings()

# Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    disease: str
    therapy: str

class TrialSummary(BaseModel):
    idx: int
    nct_number: str
    title: str
    status: str
    conditions: str
    location: str

@app.post("/api/search", response_model=List[TrialSummary])
async def search_trials(request: SearchRequest):
    disease = request.disease
    therapy = request.therapy
    if not disease and not therapy:
        raise HTTPException(status_code=400, detail="Please provide a disease or therapy/drug to search.")
    query = f"Disease: {disease}; Therapy/Drug: {therapy}"
    query_embedding = embeddings.embed_query(query)
    D, I = index.search(np.array([query_embedding], dtype='float32'), k=10)
    results = []
    for idx in I[0]:
        if idx == -1:
            continue
        trial = dataset[idx]
        nct_number = trial['protocolSection']['identificationModule'].get('nctId', 'N/A')
        title = trial['protocolSection']['identificationModule'].get('officialTitle', 'N/A')
        status = trial['protocolSection']['statusModule'].get('overallStatus', 'N/A')
        conditions = trial['protocolSection']['conditionsModule'].get('conditions', [])
        condition_list = ', '.join(conditions)
        # Get location information
        locations = trial['protocolSection'].get('contactsLocationsModule', {}).get('locations', [])
        if locations:
            location = locations[0].get('facility', 'N/A')
        else:
            location = 'N/A'
        results.append({
            'idx': idx,
            'nct_number': nct_number,
            'title': title,
            'status': status,
            'conditions': condition_list,
            'location': location,
        })
    return results

@app.get("/api/trial/{idx}")
async def get_trial(idx: int):
    if idx < 0 or idx >= len(dataset):
        raise HTTPException(status_code=404, detail="Trial not found.")
    trial = dataset[idx]
    return trial
