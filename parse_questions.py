import json
import re
import os

def parse_questions(file_path):
    """
    Parses the question file content into a structured list of dictionaries.
    Each question object will have: 'question', 'options', 'answer'.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split the content by the separator line, handling variations in the separator
    # The separator is typically '________________________________________' or a question number line.
    # We will use a regex to find blocks of text that look like a question.
    
    # Regex to find a block starting with a question line, followed by options, and then the answer.
    # This is a complex regex, so let's simplify the approach by splitting by the known separator
    # and then processing each block.

    # First, clean up the file content to ensure consistent separators and remove extra lines.
    # Replace multiple newlines with a single one, and remove the 'team-warek.netlify.app' or 'Telecom Egypt+1' tags.
    content = re.sub(r'\n+', '\n', content).strip()
    content = re.sub(r'team-warek\.netlify\.app|Telecom Egypt\+1', '', content)
    
    # Split by the main separator, which is usually '________________________________________' or a question number.
    # Since the file has numbered questions (e.g., 'سؤال 2' or '1.	باقة Super Kix 25'), 
    # we can try to split based on the correct answer line, which seems to be the most consistent marker.
    
    # Let's try to find all question blocks. A block starts with a question, has options, and ends with an answer line.
    
    # Pattern to find a question block:
    # 1. Question line (can be numbered or not)
    # 2. Options line(s)
    # 3. Answer line starting with 'الإجابة الصحيحة:'
    
    # The file structure is inconsistent with numbering (sometimes 'سؤال X', sometimes 'X.').
    # Let's rely on the 'الإجابة الصحيحة:' line as the end of a question block.
    
    question_blocks = re.split(r'\nالإجابة الصحيحة:', content)
    
    questions = []
    
    for i, block in enumerate(question_blocks):
        if not block.strip():
            continue
        
        # The first block might be incomplete or a header, let's skip it if it doesn't look like a question.
        if i == 0 and 'الإجابة الصحيحة:' not in question_blocks[0]:
            # This is the text before the first 'الإجابة الصحيحة:', which contains the first question.
            # The first question is in the first block, but the split was on the answer line.
            # Let's re-read the file and use a different split strategy.
            pass
        
        # New strategy: Process the entire content line by line and group them.
        # This is more robust against formatting inconsistencies.
        
    # Re-read the file and process line by line
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    current_question = {}
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Remove the source tags
        line = re.sub(r'team-warek\.netlify\.app|Telecom Egypt\+1|\(ملاحظة:.*\)', '', line).strip()
        
        if not line:
            continue
            
        # Check for the separator line
        if line.startswith('____'):
            continue
            
        # Check for the question number line (e.g., 'سؤال 2' or '1.')
        if re.match(r'^(سؤال\s+\d+|\d+\.\s+)', line):
            # If we have a complete question, save it
            if current_question and 'answer' in current_question:
                questions.append(current_question)
            
            # Start a new question
            current_question = {'question': line, 'options': []}
            
        # Check for the correct answer line
        elif line.startswith('الإجابة الصحيحة:'):
            # Extract the answer text
            answer_text = line.replace('الإجابة الصحيحة:', '').strip()
            # The answer is usually the option letter and the text, e.g., 'C. 30 جيجابايت'
            match = re.match(r'([A-D])\.\s*(.*)', answer_text)
            if match:
                current_question['answer'] = match.group(1)
            else:
                # Fallback for answers that are just text or a single word
                current_question['answer'] = answer_text
            
            # The question is complete, add it to the list
            if current_question and 'question' in current_question:
                questions.append(current_question)
            current_question = {} # Reset for the next question
            
        # Check for options line (A. ... B. ... C. ... D.)
        elif re.search(r'[A-D]\.\s+.*', line):
            # Options are usually on one line, separated by a tab or multiple spaces.
            # Split by the option markers (A., B., C., D.)
            options_raw = re.split(r'\s*([A-D])\.\s*', line)
            
            # The split will result in an empty string at the start, then the option letter, then the option text, and so on.
            # Example: ['', 'A', 'Option A text', 'B', 'Option B text', ...]
            
            options_dict = {}
            for j in range(1, len(options_raw), 2):
                option_letter = options_raw[j]
                option_text = options_raw[j+1].strip()
                options_dict[option_letter] = option_text
            
            if current_question:
                current_question['options'] = options_dict
            
        # If it's not a known marker, it's likely a continuation of the question text
        elif current_question and 'question' in current_question:
            current_question['question'] += ' ' + line
            
    # Final check for any remaining question
    if current_question and 'answer' in current_question:
        questions.append(current_question)

    return questions

# Define paths
input_file_path = '/home/ubuntu/upload/pasted_content.txt'
output_file_path = '/home/ubuntu/quiz_game/questions.json'

# Create the directory if it doesn't exist
os.makedirs(os.path.dirname(output_file_path), exist_ok=True)

# Parse and save
try:
    parsed_questions = parse_questions(input_file_path)
    
    # Filter out any incomplete questions that might have been partially captured
    final_questions = [q for q in parsed_questions if q.get('question') and q.get('options') and q.get('answer')]
    
    with open(output_file_path, 'w', encoding='utf-8') as f:
        json.dump(final_questions, f, ensure_ascii=False, indent=4)
        
    print(f"Successfully parsed {len(final_questions)} questions and saved to {output_file_path}")

except Exception as e:
    print(f"An error occurred: {e}")

