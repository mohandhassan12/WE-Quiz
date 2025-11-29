import json

# Load the questions.json file
with open('questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Function to determine category based on question content
def get_category(question):
    if 'WE Gold' in question:
        return 'WE Gold'
    elif 'Super Kix' in question:
        return 'Super Kix'
    elif 'Nitro' in question:
        return 'Nitro'
    elif 'Tazbeet' in question:
        return 'Tazbeet'
    elif 'WE Life' in question:
        return 'WE Life'
    elif 'WE SONIC' in question:
        return 'WE SONIC'
    elif 'WE Space Super' in question:
        return 'WE Space Super'
    elif 'WE Ardy' in question:
        return 'WE Ardy'
    else:
        return 'General'

# Add category to each question
for q in questions:
    q['category'] = get_category(q['question'])

# Save the updated JSON
with open('questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=4)
