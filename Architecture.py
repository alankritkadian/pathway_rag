import warnings 
warnings.filterwarnings('ignore', module="langsmith.client")
from modular_agent import create_agent
from langchain.tools import StructuredTool
from langchain_openai import ChatOpenAI
from finance.corporate_finance import *
from finance.financial_markets import *
from finance.personal_finance import *
from finance.finance_group import finance_group_tool
from maths.code_executor import *
from report_gen.report_gen import reportgen_tool
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage
from langchain import hub
from new_adaptive_rag import data_node_tool
from Bad_queries import QueryValidator
from response_transformation import ResponseTransformer
from typing_extensions import TypedDict
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables.config import RunnableConfig
config = RunnableConfig(recursion_limit=60)

joiner_prompt = hub.pull("yankee/llm-compiler-joiner").partial(examples='')
finance_prompt = hub.pull('yankee/llm-compiler-finance')
joiner_prompt_finance = hub.pull('yankee/llm-compiler-joiner').partial(examples='')
supervisor_prompt = hub.pull('llm-compiler/planner')
maths_prompt = hub.pull('llm-compiler/planner-maths-testing')


llm = ChatOpenAI(model='gpt-4o')
llm_mini = ChatOpenAI(model='gpt-4o-mini')
finance_tools = [
    finance_group_tool
]
maths_tools = [code_tool]



finance_chain = create_agent(llm_mini, finance_tools,finance_prompt,joiner_prompt_finance,'finance')
maths_chain = create_agent(llm, maths_tools,supervisor_prompt,joiner_prompt,'maths')

def maths_tool_node(query, context):
    response = maths_chain.invoke({"messages": [HumanMessage(content=f"For the following query, {query} and the following {context}, perform the actions")]})
    return response

def finance_tool_node(query, context):
    response = finance_chain.invoke({"messages": [HumanMessage(content=f"For the following query, {query} and the following {context}, perform the actions")]})
    return response

class MathsToolNode(BaseModel):
    query: str = Field(description="The mathematical query/operation to be executed")
    context: str = Field(description="The context to be considered while executing the query")

class FinanceToolNode(BaseModel):
    query: str = Field(description="The financial query/operation to be executed")
    context: str = Field(description="The context to be considered while executing the query")

maths_tool_agent = StructuredTool.from_function(
    maths_tool_node,
    name='maths_tool_agent',
    description='''maths_tool_agent(query: str, context[Optional]: str) -> str:
    An LLM agent with access to mathematical tools and a code executor to perform basic arithmetic operations and more.
    Use it whenever you need to perform mathematical operations or need to generate and run some custom code or need to analyze some data. The node can generate its own code, so you need to only provide the query and context.
    Context Specific Rules:
    The context is optional and can be used to provide additional information or constraints for the query.
    If the context is provided, the agent will use it to perform the actions specified in the query.
    If you do not provide a context, the agent will perform the actions based on the query alone.
    Example usage:
    maths_tool_agent("Compare the GDP of India, America and Russia over five years", "GDP of India for 2015-2020 = [21,22,24,25,30] GDP of America for 2015-2020 = [30,32,34,35,40] GDP of Russia for 2015-2020 = [15,16,18,20,22]"),
    returns: "The GDP of India has increased by 9.52 over the last five years.
              The GDP of America has increased by 10.00 over the last five years.
              The GDP of Russia has increased by 46.67 over the last five years."
    
    maths_tool_agent("Calculate the average of the following numbers: [1,2,3,4,5]","")
    returns: "The average of the numbers [1, 2, 3, 4, 5] is 3.0.",
    ''',
    args_schema=MathsToolNode,
)

finance_tool_agent = StructuredTool.from_function(
    finance_tool_node,
    name='finance_tool_agent',
    description='''finance_tool_agent(query: str, context[Optional]: str) -> str:
    npv_tool,financial_analysis_tool,payback_period_tool,irr_tool,break_even_tool,
    depreciation_tool,working_capital_tool,stock_price_change_tool,moving_average_tool,
    bollinger_bands_tool,
    volatility_tool,
    exponential_moving_average_tool,
    rsi_tool,
    monthly_savings_tool,
    loan_emi_tool,
    retirement_savings_tool,
    emergency_fund_tool,
    debt_to_income_ratio_tool,
    investment_growth_tool
    Example usage:
    finance_tool_agent("Calculate the NPV of a project with the following cash flows: [100,200,300,400,500]","Initial investment = 1000, Discount rate = 10%"),
    returns: "The Net Present Value (NPV) of the project is 139.75."
    
    finance_tool_agent("Calculate the moving average of the stock prices: [100,110,200,500,600] over a period of 5 days.",""),
    returns: "The moving average of the stock prices over a period of 5 days is 302.0."
    ''',
    args_schema = FinanceToolNode
)

tools = [maths_tool_agent,finance_group_tool,data_node_tool,reportgen_tool]

supervisor = create_agent(llm, tools, supervisor_prompt, joiner_prompt,'supervisor')

class StateCompression(TypedDict):
    summary: str = Field(description="A summary of the state, including all the function calls and their results, and any conclusions if drawn")

system_compressor = """You are an expert at compressing the state of the system. 
You have been given the task to compress the state of the system into a summary. 
You must include all the function calls and their results, and any conclusions if drawn.
You must provide this summary in a structured format as per the Act model. """
route_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_compressor),
        ("human", "{messages}"),
    ]
)

def restart(messages,response):
    # query = state['user_question']
    # response = input(f'Enter the response for the query-> {query}:\nAnswer: ')
    messages.append(HumanMessage(content=response))
    structured_llm_compressor = llm_mini.with_structured_output(StateCompression)
    state_compressor = route_prompt | structured_llm_compressor
    summary = state_compressor.invoke({"messages": messages})
    print('Summary:',summary)
    # state["messages"].append(HumanMessage(content=summary["summary"]))
    return summary["summary"]


if __name__ == '__main__':
    # query = "What is the GDP of India and USA. What is the difference between two. What is the precentage increase in their GDPs"
    # query = "What is GDP of Ireland, also generate a report about Google's finances and their progress in field of quantum computing"
    query = "Which segment of 3M performed the worst in 2018?"
    final_answer = ""
    for step in supervisor.stream({'messages': [HumanMessage(content=query)],'hitl_flag':False},config=config,stream_mode='values'):
        print('============================================STEP START========================================================')
        last_state = step
        print('Last State:',last_state.__dict__)
        print('Last State:',type(last_state))
        print(step)
        print('=============================================STEP END=======================================================')


    hitl_flag = last_state["hitl_flag"]
    print(hitl_flag)
    if hitl_flag:
        messages = last_state['messages']
        user_question = last_state["user_question"]
        print('User Question:',user_question)
        response = input('Enter the response: ')
        # print('To Replay:',to_replay)
        last_message = last_state["messages"][-1]
        print('Last Message:',last_message)
        # last_message['content'] = response
        summary = restart(messages,response)
        new_state = {'messages':[HumanMessage(content=summary)]}
        # branch_config = supervisor.update_state(to_replay.config, {'messages':[HumanMessage(content=summary)],'user_response': response})
        # for step in supervisor.stream(new_state,stream_mode='values'):
        #     print("NEW BRANCH ACTIVATED")
        #     print(step)
        response = supervisor.invoke(new_state,config=config)["messages"][-1].content
    else:
        response = last_state["messages"][-1].content

    print(response)