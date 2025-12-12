from pyspark.sql import SparkSession
from pyspark.sql.functions import col, from_json, concat_ws

#  SPARK SESSION
spark = (
    SparkSession.builder
        .appName("KafkaToHDFS_CSV")
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


#  flatting de la structure JSON en gros on met les champs de la struct content au niveau supérieur exemple content.content_id devient content_id
flattened = (
    parsed.withColumn("content_id", col("content.content_id"))
          .withColumn("tags", concat_ws(",", col("content.tags")))
          .drop("content")  # retire la struct JSON
)

# ================================================================
#  éceiture du stream dans HDFS au format CSV

query = (
    flattened.writeStream
             .format("csv")
             .option("path", "hdfs://namenode:8020/user/events")
             .option("checkpointLocation", "hdfs://namenode:8020/checkpoints/events")
             .option("header", "false")   
             .outputMode("append")
             .start()
)

query.awaitTermination()
