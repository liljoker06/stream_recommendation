import requests

NAMENODE_WEBHDFS = "http://namenode:9870"


def ensure_hdfs_dir(hdfs_path: str):
    """
    Crée le dossier parent dans HDFS via WebHDFS
    """
    directory = "/".join(hdfs_path.split("/")[:-1])
    if not directory:
        return

    url = f"{NAMENODE_WEBHDFS}/webhdfs/v1{directory}?op=MKDIRS"
    r = requests.put(url)
    r.raise_for_status()


def write_text_to_hdfs(hdfs_path: str, content: str):
    """
    Écrit un fichier texte dans HDFS via WebHDFS (2-step create)
    """
    ensure_hdfs_dir(hdfs_path)

    # 1️⃣ Create (NameNode → redirect)
    create_url = (
        f"{NAMENODE_WEBHDFS}/webhdfs/v1{hdfs_path}"
        "?op=CREATE&overwrite=true"
    )

    r = requests.put(create_url, allow_redirects=False)
    r.raise_for_status()

    # 2️⃣ Upload vers DataNode
    upload_url = r.headers["Location"]

    r2 = requests.put(upload_url, data=content.encode("utf-8"))
    r2.raise_for_status()
