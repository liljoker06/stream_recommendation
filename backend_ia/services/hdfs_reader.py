import requests
import csv
from io import StringIO

NAMENODE = "http://namenode:9870"

CSV_COLUMNS = [
    "user_id",
    "event_type",
    "timestamp",
    "device",
    "duration_seconds",
    "source",
    "content_id",
    "tags"
]


def list_hdfs_files(path: str):
    url = f"{NAMENODE}/webhdfs/v1{path}?op=LISTSTATUS"
    r = requests.get(url)
    r.raise_for_status()

    statuses = r.json()["FileStatuses"]["FileStatus"]
    return [
        f"{path}/{f['pathSuffix']}"
        for f in statuses
        if f["type"] == "FILE" and f["pathSuffix"].endswith(".csv")
    ]


def read_csv_from_hdfs(path: str):
    files = list_hdfs_files(path)
    rows = []

    for file_path in files:
        open_url = f"{NAMENODE}/webhdfs/v1{file_path}?op=OPEN"
        r = requests.get(open_url)
        r.raise_for_status()

        csv_file = StringIO(r.text)
        reader = csv.reader(csv_file)

        for values in reader:
            if len(values) != len(CSV_COLUMNS):
                continue  # ignore lignes corrompues

            row = dict(zip(CSV_COLUMNS, values))
            rows.append(row)

    return rows


def read_text_from_hdfs(path: str) -> str:
    url = f"{NAMENODE}/webhdfs/v1{path}?op=OPEN"
    r = requests.get(url)
    r.raise_for_status()
    return r.text
