import os
from dotenv import load_dotenv
load_dotenv()

import pathway as pw
from pathway.xpacks.llm.vector_store import VectorStoreServer
from llama_index.embeddings.openai import OpenAIEmbedding
# from llama_index.embeddings import *
from llama_index.core.node_parser import TokenTextSplitter

data_sources = []
data_sources.append(
    # pw.io.gdrive.read(object_id="1Sjs01BtNUoighEFwdBi7zIEZollpvHFc", service_user_credentials_file="./creds.json", with_metadata=True)
    pw.io.gdrive.read(object_id=os.getenv("GDRIVE_LINK"), service_user_credentials_file="./creds.json", with_metadata=True)
    )

embed_model = OpenAIEmbedding(embed_batch_size=10)
transformations_example = [
    TokenTextSplitter(
        chunk_size=150,
        chunk_overlap=10,
        separator=" ",
    ),
    embed_model,
]
pipeline=VectorStoreServer.from_llamaindex_components(
    *data_sources,
    transformations=transformations_example,
)

# PATHWAY_HOST = "127.0.0.1"
# PATHWAY_PORT = 8754

# pipeline.run_server(
#     host=PATHWAY_HOST, port=PATHWAY_PORT, with_cache=False, threaded=True
# )

pipeline.run_server(
    
    host=os.getenv("PATHWAY_HOST"), port=int(os.getenv("PATHWAY_PORT")), with_cache=False
)

import time
time.sleep(30)
