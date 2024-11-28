from langchain.agents import initialize_agent, Tool
from langchain.chat_models import ChatOpenAI
from langchain.tools.python.tool import PythonREPLTool
from langchain.tools import BaseTool

class AgentFactory:
    """
    Factory class for creating LangGraph-style agents with predefined configurations.
    """

    _agent_configs = {
        "math": {
            "llms": ChatOpenAI(temperature=0, model="gpt-4"),
            "tools": [PythonREPLTool()],
            "description": "A Math Agent specialized in solving mathematical problems using Python.",
        },
        "finance": {
            "llms": ChatOpenAI(temperature=0.2, model="gpt-4"),
            "tools": [
                Tool(name="YFinanceTool", func=lambda query: f"Finance data for: {query}", description="Fetch financial data."),
                Tool(name="MarketAnalysis", func=lambda query: f"Market trends for: {query}", description="Analyze market trends."),
            ],
            "description": "A Finance Agent that analyzes stock markets and trends.",
        },
        "news": {
            "llms": ChatOpenAI(temperature=0.3, model="gpt-3.5-turbo"),
            "tools": [
                Tool(name="NewsAPI", func=lambda topic: f"Latest news about {topic}", description="Fetch the latest news."),
            ],
            "description": "A News Agent that retrieves and summarizes current events.",
        },
        "reasoning": {
            "llms": ChatOpenAI(temperature=0.4, model="gpt-4"),
            "tools": [PythonREPLTool()],
            "description": "A Reasoning Agent that excels in logical and deductive reasoning.",
        },
    }

    @classmethod
    def make_agent(cls, domain: str):
        """
        Creates an agent based on the given domain keyword.

        Args:
            domain (str): The domain keyword for the agent.

        Returns:
            LangChain agent instance.
        """
        if domain not in cls._agent_configs:
            raise ValueError(f"Unknown domain '{domain}'. Available domains: {list(cls._agent_configs.keys())}")
        
        config = cls._agent_configs[domain]
        tools = config["tools"]
        llm = config["llms"]
        description = config["description"]

        # Initialize the agent
        agent = initialize_agent(
            tools=tools,
            llm=llm,
            agent="zero-shot-react-description",
            verbose=True
        )

        print(f"Created {domain.capitalize()} Agent: {description}")
        return agent


# Example Usage
if __name__ == "__main__":
    # Create a Math Agent
    math_agent = AgentFactory.make_agent("math")
    response = math_agent.run("What is the square root of 16?")
    print(response)

    # Create a Finance Agent
    finance_agent = AgentFactory.make_agent("finance")
    response = finance_agent.run("Fetch stock data for AAPL.")
    print(response)

    # Create a News Agent
    news_agent = AgentFactory.make_agent("news")
    response = news_agent.run("Get the latest news on AI.")
    print(response)

    # Create a Reasoning Agent
    reasoning_agent = AgentFactory.make_agent("reasoning")
    response = reasoning_agent.run("Prove that the sum of two even numbers is even.")
    print(response)
