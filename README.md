# AI Due Diligence Notes

A full-stack sample project demonstrating practical usage of Django REST Framework, Next.js, and LLM-based classification to build a simple AI-assisted due diligence tool.

---

## Overview

AI Due Diligence Notes is a minimal application for analyzing companies or investment cases.

Users can:

* Create cases (companies or investments)
* Add notes related to each case
* Classify notes as **Risk**, **Opportunity**, or **Neutral**

The classification is powered by an LLM (via OpenRouter free models), with a rule-based fallback to ensure reliability.

---

## Tech Stack

### Backend

* Python
* Django
* Django REST Framework
* SQLite (development)
* OpenRouter (LLM inference)

### Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS

---

## Architecture

This project follows a simple but realistic full-stack architecture:

* **Django REST Framework** provides a REST API using `ModelViewSet`
* A custom endpoint (`/notes/{id}/classify/`) handles classification logic
* Classification is performed via an LLM, with a fallback to rule-based logic
* **Next.js API routes** act as a backend-for-frontend (BFF), proxying requests to Django
* Environment variables are used to keep backend URLs server-side only

---

## Features

* Case management (create and list)
* Note creation per case
* LLM-based classification via backend endpoint
* Rule-based fallback for robustness
* Clean UI with case selection and note filtering
* Separation of concerns between frontend services and backend API

---

## Example

Input note:

> "The company is involved in a lawsuit"

Classification result:

> Risk

---

## Running Locally

### Backend

```bash
cd backend
uv venv --python 3.12
.venv\Scripts\Activate.ps1
uv pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs at:

http://127.0.0.1:8000

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

http://localhost:3000

---

## Environment Variables

### Backend

```env
DJANGO_SECRET_KEY=s...
OPENROUTER_API_KEY=your_api_key_here
```

### Frontend

```env
API_URL=http://127.0.0.1:8000/api
```

The frontend variable is server-side only and not exposed to the browser.

---

## Design Decisions

* Used `ModelViewSet` to keep the API concise and RESTful
* Implemented a custom DRF action (`classify`) to encapsulate classification logic
* Integrated LLM-based classification using OpenRouter free models
* Added a rule-based fallback to ensure stability and deterministic behavior
* Implemented a BFF layer in Next.js to decouple frontend from backend implementation details
* Kept UI minimal but structured to reflect real product thinking

---

## Limitations

* LLM responses may vary slightly depending on the model
* No authentication or authorization
* SQLite used instead of PostgreSQL
* No background jobs or async processing
* No caching layer for classification results

---

## Possible Improvements

* Add confidence scoring for classifications
* Introduce caching to avoid repeated LLM calls
* Replace or extend LLM with embeddings-based classification
* Add authentication (JWT or session-based)
* Move to PostgreSQL for production
* Add pagination and filtering
* Improve UX with loading states and feedback

---

## About this project

This project was built to demonstrate the ability to quickly learn and apply Django REST Framework in a realistic full-stack scenario.

My primary professional experience is with:

* React / React Native
* Node.js (TypeScript)
* API development
* AI workflows (OpenAI, RAG, automation with Python)

This project bridges that experience with Django/DRF, while also incorporating practical usage of LLM-based features in a product-oriented context.

---
