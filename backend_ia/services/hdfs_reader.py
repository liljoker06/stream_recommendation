import boto3
import csv
from io import StringIO

MINIO_ENDPOINT = "http://minio:9000"
MINIO_ACCESS_KEY = "minioadmin"
MINIO_SECRET_KEY = "minioadmin"

CSV_COLUMNS = [
    "user_id",
    "event_type",
    "timestamp",
    "device",
    "duration_seconds",
    "source",
    "content_id",
    "tags",
]


def _s3():
    return boto3.client(
        "s3",
        endpoint_url=MINIO_ENDPOINT,
        aws_access_key_id=MINIO_ACCESS_KEY,
        aws_secret_access_key=MINIO_SECRET_KEY,
    )


def read_csv_from_minio(bucket: str, prefix: str):
    s3 = _s3()
    paginator = s3.get_paginator("list_objects_v2")
    rows = []

    for page in paginator.paginate(Bucket=bucket, Prefix=prefix):
        for obj in page.get("Contents", []):
            if not obj["Key"].endswith(".csv"):
                continue

            body = s3.get_object(Bucket=bucket, Key=obj["Key"])["Body"].read().decode("utf-8")
            for values in csv.reader(StringIO(body)):
                if len(values) == len(CSV_COLUMNS):
                    rows.append(dict(zip(CSV_COLUMNS, values)))

    return rows


def read_text_from_minio(bucket: str, key: str) -> str:
    s3 = _s3()
    return s3.get_object(Bucket=bucket, Key=key)["Body"].read().decode("utf-8")
