import os
from dotenv import load_dotenv
os.environ["TESSDATA_PREFIX"] = "/usr/share/tesseract-ocr/4.00/tessdata"
load_dotenv()
import pathway as pw
from pathway.xpacks.llm import parsers, embedders

parser = parsers.OpenParse()
from pathway.udfs import DiskCache
from pathway.xpacks.llm.vector_store import VectorStoreServer

import pathway as pw
from pathway.xpacks.llm.vector_store import VectorStoreServer

# Define the data source
data_sources = []
data_sources.append(
    pw.io.gdrive.read(
        object_id=os.getenv("GDRIVE_LINK"), 
        service_user_credentials_file="creds.json",  # Replace with your creds.json path
        with_metadata=True,
    )
)

embedder = embedders.OpenAIEmbedder(cache_strategy=DiskCache())
pipeline = VectorStoreServer(
    *data_sources,
    embedder=embedder,
      splitter=None,  # OpenParse parser handles the chunking
        parser=parser,

)
# Run the server
pipeline.run_server(
    host=os.getenv("PATHWAY_HOST"), 
    port=int(os.getenv("PATHWAY_PORT")), 
    with_cache=False
)

# Add a delay to ensure the server is running
import time
time.sleep(30)

# If additional threaded server setup is needed, uncomment this:
# pipeline.run_server(
#     host="127.0.0.1", 
#     port=8754, 
#     with_cache=False, 
#     threaded=True
# )
