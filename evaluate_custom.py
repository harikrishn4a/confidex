import re

def normalize(val):
    return re.sub(r'[^a-z0-9]', '', val.lower())

def map_entity_group(group):
    mapping = {
        "PHONENUMBER": "PHONE",
        "PERSON": "NAME",
        "KEY": "API_KEY",
        # Add more mappings as needed
    }
    return mapping.get(group, group)

from detection import detect_sensitive_spans

def evaluate_model(test_cases):
    total = 0
    correct = 0
    for i, case in enumerate(test_cases, 1):
        print(f"\nTest {i}: {case['text']}")
        detected = detect_sensitive_spans(case["text"])
        detected_set = set((map_entity_group(d['entity_group']), normalize(d['word'])) for d in detected)
        expected_set = set((e['entity_group'], normalize(e['word'])) for e in case["expected"])
        print("Detected:", detected_set)
        print("Expected:", expected_set)
        match = detected_set & expected_set
        print(f"Matched: {match}")
        correct += len(match)
        total += len(expected_set)
    if total > 0:
        print(f"\nAccuracy: {correct}/{total} ({(correct/total)*100:.2f}%)")
    else:
        print("\nNo expected entities to evaluate.")

if __name__ == "__main__":
    my_test_cases = [
        # Standard PII
    {
        "text": "Contact me at john.doe@example.com",
        "expected": [{"entity_group": "EMAIL", "word": "john.doe@example.com"}]
    },
    {
        "text": "My phone number is 555-123-4567",
        "expected": [{"entity_group": "PHONE", "word": "555-123-4567"}]
    },
    # Obfuscated PII
    {
        "text": "My email is john [dot] doe [at] example [dot] com",
        "expected": [{"entity_group": "EMAIL", "word": "john [dot] doe [at] example [dot] com"}]
    },
    {
        "text": "Call me at five five five one two three four five six seven",
        "expected": [{"entity_group": "PHONE", "word": "five five five one two three four five six seven"}]
    },
    # Company-sensitive info
    {
        "text": "The project codename is Project Lynx. Do not share externally.",
        "expected": [{"entity_group": "PROJECT", "word": "Project Lynx"}]
    },
    {
        "text": "Our AWS access key is AKIAIOSFODNN7EXAMPLE.",
        "expected": [{"entity_group": "KEY", "word": "AKIAIOSFODNN7EXAMPLE"}]
    },
    # Financials
    {
        "text": "The Q2 revenue was $1,200,000.",
        "expected": [{"entity_group": "FINANCIAL", "word": "$1,200,000"}]
    },
    {
        "text": "The client account number is 1234567890.",
        "expected": [{"entity_group": "ACCOUNT_NUMBER", "word": "1234567890"}]
    },
    # Secrets/API keys
    {
        "text": "API key: sk-test-4eC39HqLyjWDarjtT1zdp7dc",
        "expected": [{"entity_group": "API_KEY", "word": "sk-test-4eC39HqLyjWDarjtT1zdp7dc"}]
    },
    # HR/Employee info
    {
        "text": "Employee SSN: 987-65-4321",
        "expected": [{"entity_group": "SSN", "word": "987-65-4321"}]
    },
    {
        "text": "Salary for Jane Doe is $120,000 per year.",
        "expected": [
            {"entity_group": "PERSON", "word": "Jane Doe"},
            {"entity_group": "FINANCIAL", "word": "$120,000"}
        ]
    },
    # Negative control
    {
        "text": "This is a public press release.",
        "expected": []
    },
    ]
    evaluate_model(my_test_cases)