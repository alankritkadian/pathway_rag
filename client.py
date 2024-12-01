from llama_index.retrievers.pathway import PathwayRetriever

retriever = PathwayRetriever(url="https://pathwayserver.onrender.com")
retriever.retrieve(str_or_query_bundle="data manipulation")


from llama_index.core.query_engine import RetrieverQueryEngine

query_engine = RetrieverQueryEngine.from_args(
    retriever,
)

response = query_engine.query("Which Python libraries are essential for data manipulation and analysis?")
print(str(response))