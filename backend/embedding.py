import json
from langchain_openai import OpenAIEmbeddings
import faiss
import numpy as np
import os

# Set OpenAI API key
os.environ['OPENAI_API_KEY'] = 'sk-eCzuP5RxQGt9XVVJN_qiazdZucmhAlpaeJbQ3NZP5tT3BlbkFJGHtEuYdnJNpUTpijm9OtZxVC6M8o7ft0F5rU2Jy6gA'

# Load the dataset
with open('clinical_trials.json', 'r') as f:
    dataset = json.load(f)

# Prepare the texts to embed
texts = []
metadata = []
for trial in dataset:
    title = trial['protocolSection']['identificationModule'].get('officialTitle', '')
    description = trial.get('protocolSection', {}).get('descriptionModule', {}).get('briefSummary', '')
    combined_text = f"{title}. {description}"
    texts.append(combined_text)
    metadata.append({'title': title})

# Create embeddings
embeddings = OpenAIEmbeddings()

# Generate embeddings
text_embeddings = embeddings.embed_documents(texts)

# Convert to numpy array
embeddings_array = np.array(text_embeddings).astype('float32')

# Create FAISS index
index = faiss.IndexFlatL2(embeddings_array.shape[1])
index.add(embeddings_array)

# Save the index and metadata
faiss.write_index(index, 'clinical_trials.index')
with open('metadata.json', 'w') as f:
    json.dump(metadata, f)
