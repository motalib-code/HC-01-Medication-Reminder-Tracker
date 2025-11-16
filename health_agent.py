import os
import streamlit as st
from agno.core import Agent, Message, agent, stream
import google.generativeai as genai

st.set_page_config(
    page_title="AI Health & Fitness Planner Agent",
    page_icon="🏋️‍♂️",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.title("AI Health & Fitness Planner Agent 🏋️‍♂️")

st.markdown(
    """
    Welcome to the AI Health & Fitness Planner!

    This app generates personalized dietary and fitness plans based on your inputs.
    Simply fill out the form below and let our AI agents do the rest!
    """
)

# Sidebar for API Key
st.sidebar.title("Configuration")
api_key = st.sidebar.text_input("Enter your Google API Key", type="password")

if api_key:
    os.environ["GOOGLE_API_KEY"] = api_key
    try:
        genai.configure(api_key=api_key)
    except Exception as e:
        st.error(f"Error configuring Google API: {e}")
        st.stop()
else:
    st.warning("Please enter your Google API Key in the sidebar to proceed.")
    st.stop()


# User Input Form
st.header("Enter Your Details")
with st.form("user_details"):
    age = st.number_input("Age", min_value=1, max_value=120)
    weight = st.number_input("Weight (kg)", min_value=1.0, step=0.1)
    height = st.number_input("Height (cm)", min_value=1.0, step=0.1)
    sex = st.selectbox("Sex", ["Male", "Female"])
    activity_level = st.selectbox(
        "Activity Level",
        ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"],
    )
    dietary_preference = st.selectbox(
        "Dietary Preference",
        ["None", "Keto", "Vegetarian", "Low Carb", "Vegan", "Paleo"],
    )
    fitness_goal = st.selectbox(
        "Fitness Goal",
        ["Weight Loss", "Muscle Gain", "General Fitness", "Endurance", "Flexibility"],
    )
    submitted = st.form_submit_button("Generate Plan")

# Agent Definitions
health_agent_prompt = """
You are a Health Agent specializing in personalized dietary planning.
Your goal is to provide a comprehensive meal plan based on the user's profile.

User Profile:
- Age: {age}
- Weight: {weight} kg
- Height: {height} cm
- Sex: {sex}
- Activity Level: {activity_level}
- Dietary Preference: {dietary_preference}
- Fitness Goal: {fitness_goal}

Your tasks are to:
1.  Generate a complete meal plan (breakfast, lunch, dinner, snacks).
2.  Provide guidance on hydration, electrolytes, and fiber intake.
3.  Explain the nutritional rationale behind your recommendations.
"""

fitness_agent_prompt = """
You are a Fitness Agent specializing in exercise programming and workout design.
Your goal is to create a goal-specific workout routine based on the user's profile.

User Profile:
- Age: {age}
- Weight: {weight} kg
- Height: {height} cm
- Sex: {sex}
- Activity Level: {activity_level}
- Dietary Preference: {dietary_preference}
- Fitness Goal: {fitness_goal}

Your tasks are to:
1.  Create a structured workout routine (warm-up, main workout, cool-down).
2.  Tailor exercise selection based on the user's fitness level and preferences.
3.  Provide form cues and explain the benefits of each exercise.
"""

def create_agent(prompt_template, **kwargs):
    return Agent(
        initial_prompt=prompt_template.format(**kwargs),
        model="gemini-1.5-flash",
    )

# Main App Logic
if submitted:
    st.header("Your Personalized Health & Fitness Plan")

    user_data = {
        "age": age,
        "weight": weight,
        "height": height,
        "sex": sex,
        "activity_level": activity_level,
        "dietary_preference": dietary_preference,
        "fitness_goal": fitness_goal,
    }

    # Create and run agents in parallel
    col1, col2 = st.columns(2)

    with col1:
        st.subheader("Dietary Plan")
        with st.spinner("Generating Dietary Plan..."):
            health_agent = create_agent(health_agent_prompt, **user_data)
            response = health_agent.get_response()
            st.markdown(response.content)

    with col2:
        st.subheader("Fitness Plan")
        with st.spinner("Generating Fitness Plan..."):
            fitness_agent = create_agent(fitness_agent_prompt, **user_data)
            response = fitness_agent.get_response()
            st.markdown(response.content)

    # Follow-up Q&A
    st.header("Ask a Follow-up Question")
    question = st.text_input("Enter your question:")

    if question:
        agent_choice = st.radio(
            "Which agent would you like to ask?", ("Health Agent", "Fitness Agent")
        )
        if agent_choice == "Health Agent":
            agent = create_agent(health_agent_prompt, **user_data)
        else:
            agent = create_agent(fitness_agent_prompt, **user_data)

        agent.add_message(Message(role="user", content=question))
        with st.spinner("Getting an answer..."):
            response = agent.get_response()
            st.markdown(response.content)
