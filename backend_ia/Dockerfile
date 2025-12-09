FROM python:3.11

WORKDIR /app

# Install dev deps only
RUN pip install fastapi uvicorn

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--reload", "--port", "9000"]
