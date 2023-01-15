FROM python:3.11-slim

# System deps
RUN apt-get update && apt-get install -y -qq git gcc curl
# Download and install poetry
RUN python -m pip install poetry

# Copy Poetry's files
WORKDIR /code
COPY ["./poetry.lock", "/code"]
COPY ["./pyproject.toml", "/code"]

# Install deps
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev --no-interaction

# Copy sources
COPY ./ /code