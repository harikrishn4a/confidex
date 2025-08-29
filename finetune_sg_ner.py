from datasets import load_from_disk
from transformers import AutoTokenizer, AutoModelForTokenClassification, TrainingArguments, Trainer, DataCollatorForTokenClassification

# Load your dataset
dataset = load_from_disk("sg_pdpa_ner_dataset")

# Use the same model as in detection.py
model_name = "Isotonic/distilbert_finetuned_ai4privacy_v2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name, num_labels=33)  # 33 = your label set size

# Align labels with tokens (handles subword tokenization)
def tokenize_and_align_labels(example):
    tokenized_inputs = tokenizer(example["tokens"], truncation=True, is_split_into_words=True)
    labels = []
    word_ids = tokenized_inputs.word_ids()
    previous_word_idx = None
    for word_idx in word_ids:
        if word_idx is None:
            labels.append(-100)
        elif word_idx != previous_word_idx:
            labels.append(example["ner_tags"][word_idx])
        else:
            # For subword tokens, use the same label as the word
            labels.append(example["ner_tags"][word_idx])
        previous_word_idx = word_idx
    tokenized_inputs["labels"] = labels
    return tokenized_inputs

# Map your dataset
tokenized_datasets = dataset.map(tokenize_and_align_labels, batched=True)

# Training arguments
args = TrainingArguments(
    "finetuned-sg-privacy-model",
    evaluation_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=5,
    weight_decay=0.01,
    save_total_limit=2,
    logging_steps=10,
    push_to_hub=False,
)

data_collator = DataCollatorForTokenClassification(tokenizer)

trainer = Trainer(
    model,
    args,
    train_dataset=tokenized_datasets["train"],
    eval_dataset=tokenized_datasets["validation"],
    tokenizer=tokenizer,
    data_collator=data_collator,
)

trainer.train()
trainer.save_model("finetuned-sg-privacy-model")
tokenizer.save_pretrained("finetuned-sg-privacy-model")
