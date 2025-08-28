from datasets import load_dataset
from detection import detect_sensitive_spans  # Import your model-only detection function

# Load the dataset (you must have accepted the terms on HuggingFace)
ds = load_dataset("bigcode/bigcode-pii-dataset", use_auth_token=True)
test_set = ds["test"]

def extract_ground_truth(fragments):
    # Each fragment: {'category': ..., 'position': [start, end], 'value': ...}
    return set((frag['category'], frag['value']) for frag in fragments)

def extract_predictions(text):
    preds = detect_sensitive_spans(text)
    return set((pred['entity_group'], pred['word']) for pred in preds)

correct = 0
total = 0

for i, example in enumerate(test_set.select(range(100))):  # Test on first 100 samples for speed
    text = example["text"]
    ground_truth = extract_ground_truth(example["fragments"])
    predictions = extract_predictions(text)
    match = ground_truth & predictions
    correct += len(match)
    total += len(ground_truth)
    print(f"Sample {i+1}:")
    print("  Ground truth:", ground_truth)
    print("  Predictions:", predictions)
    print("  Matched:", match)
    print()

print(f"Accuracy: {correct}/{total} ({(correct/total)*100:.2f}%)")