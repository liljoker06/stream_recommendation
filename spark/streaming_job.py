from pyspark.sql import SparkSession
from pyspark.sql.functions import col, from_json, concat_ws

#  SPARK SESSION
spark = (
    SparkSession.builder
        .appName("KafkaToMinIO_CSV")
        # --- MinIO / S3A ---
        .config("spark.hadoop.fs.s3a.endpoint", "http://minio:9000")
        .config("spark.hadoop.fs.s3a.access.key", "minioadmin")
        .config("spark.hadoop.fs.s3a.secret.key", "minioadmin")
        .config("spark.hadoop.fs.s3a.path.style.access", "true")
        .config("spark.hadoop.fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
        .config("spark.hadoop.fs.s3a.aws.credentials.provider",
                "org.apache.hadoop.fs.s3a.SimpleAWSCredentialsProvider")
        .getOrCreate()
)

spark.sparkContext.setLogLevel("WARN")


#  SCHEMA DES MESSAGES KAFKA
schema = """
    user_id STRING,
    event_type STRING,
    timestamp STRING,
    device STRING,
    duration_seconds DOUBLE,
    source STRING,
    content STRUCT<
        content_id:STRING,
        tags:ARRAY<STRING>
    >
"""


#  LECTURE DU STREAM KAFKA
df = (
    spark.readStream
         .format("kafka")
         .option("kafka.bootstrap.servers", "kafka:9092")
         .option("subscribe", "user_events")
         .option("startingOffsets", "latest")
         .load()
)

parsed = (
    df.selectExpr("CAST(value AS STRING) AS raw")
      .select(from_json(col("raw"), schema).alias("data"))
      .select("data.*")
)


#  Flatting de la structure JSON
flattened = (
    parsed.withColumn("content_id", col("content.content_id"))
          .withColumn("tags", concat_ws(",", col("content.tags")))
          .drop("content")
)

# ================================================================
#  Écriture du stream dans MinIO (bucket silver) au format CSV

query = (
    flattened.writeStream
             .format("csv")
             .option("path", "s3a://silver/events")
             .option("checkpointLocation", "s3a://silver/checkpoints/events")
             .option("header", "false")
             .outputMode("append")
             .start()
)

query.awaitTermination()
