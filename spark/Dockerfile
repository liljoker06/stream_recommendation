FROM bde2020/spark-submit:3.3.0-hadoop3.3

USER root

# ---------------------------------------------------------
# INSTALL DEPENDENCIES
# ---------------------------------------------------------
RUN python3 -m ensurepip --upgrade && \
    python3 -m pip install --upgrade pip setuptools wheel

# Only required Python libs
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy your Spark streaming job
COPY streaming_job.py /app/spark/streaming_job.py

WORKDIR /app/spark
