FROM python:3.10-slim

# System deps
RUN apt-get update && apt-get install -y -qq git gcc
# Download and install poetry
RUN pip install poetry

# Copy Poetry's files
WORKDIR /code
COPY api/poetry.lock api/pyproject.toml /code/api/

ADD client /code/client

# Install deps
RUN cd api && poetry config virtualenvs.create false
RUN poetry install --no-dev --no-interaction

# Copy sources
COPY ./api /code/api