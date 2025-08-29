import random, re
from typing import List, Dict
from datasets import Dataset, DatasetDict

random.seed(7)

# ----------------------------
# Label set (BIO)
# ----------------------------
BASE_LABELS = [
    "NRIC","FIN","PASSPORT",
    "API_KEY","ACCESS_TOKEN",
    "SALARY","COMMISSION_RATE","AMOUNT_MONEY","ACCOUNT_BALANCE",
    "BUDGET","INVOICE_ID","PO_NUMBER","FINANCIAL_REPORT","PRICING_TERM",
    "PROJECT_CODE","SOURCE_CODE",
]
LABELS = ["O"] + [f"{p}-{lab}" for lab in BASE_LABELS for p in ("B","I")]
label2id = {lab:i for i,lab in enumerate(LABELS)}
id2label = {i:lab for lab,i in label2id.items()}

# ----------------------------
# Utilities
# ----------------------------
def simple_tok(text:str)->List[str]:
    # keep sk-..., % amounts, money units, alphanum, symbols
    return re.findall(r"sk-[A-Za-z0-9]+|S\$|SGD|\$|\d+%|\d+(?:\.\d+)?[mMkK]?|[A-Za-z]+(?:[-_][A-Za-z0-9]+)*|\d+|[^\s\w]", text)

def find_span(tokens:List[str], span_tokens:List[str])->List[int]:
    for i in range(len(tokens)-len(span_tokens)+1):
        if tokens[i:i+len(span_tokens)]==span_tokens:
            return list(range(i, i+len(span_tokens)))
    return []

def tag(tokens:List[str], span_idxs:List[int], ent:str)->List[str]:
    tags = ["O"]*len(tokens)
    if not span_idxs: return tags
    for j,idx in enumerate(span_idxs):
        tags[idx] = ("B-" if j==0 else "I-")+ent
    return tags

def wordify_digits(s: str) -> str:
    map_ = {"0":"zero","1":"one","2":"two","3":"three","4":"four","5":"five","6":"six","7":"seven","8":"eight","9":"nine"}
    return " ".join(map_.get(c, c) for c in s)

def sprinkle_noise(txt: str) -> str:
    # light noise: extra spaces/hyphens or 0<->O swap occasionally
    txt = re.sub(r"(\d)", lambda m: m.group(1)+" " if random.random()<0.08 else m.group(1), txt)
    if random.random()<0.1: txt = txt.replace("0","O")
    if random.random()<0.08: txt = txt.replace("-", " - ")
    return txt

def add_example(examples:List[Dict], text:str, span_text:str, ent:str):
    toks = simple_tok(text)
    span_toks = simple_tok(span_text)
    idxs = find_span(toks, span_toks)
    examples.append({"tokens": toks, "ner_tags": tag(toks, idxs, ent)})

# ----------------------------
# Generators per entity
# ----------------------------
def gen_nric()->str:
    prefix = random.choice(list("STFG"))
    digits = "".join(str(random.randint(0,9)) for _ in range(7))
    suffix = random.choice(list("ABCDEFGHIZJKLMPQRTUWXVY"))
    return f"{prefix}{digits}{suffix}"

def gen_fin()->str:
    digits = "".join(str(random.randint(0,9)) for _ in range(7))
    return f"F{digits}{random.choice(list('ABCDEFGHIZ'))}"

def gen_api_key()->str:
    body = "".join(random.choice("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") for _ in range(random.randint(16,28)))
    return f"sk-{body}"

def gen_access_token()->str:
    # fake JWT-like
    return "eyJ" + "".join(random.choice("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-") for _ in range(20))

def gen_money()->str:
    head = random.choice(["S$","SGD","$"])
    val = f"{random.randint(1,5)},{random.randint(100,999)},{random.randint(100,999)}" if random.random()<0.2 else f"{random.randint(100,20000)}"
    if random.random()<0.4: val = f"{val}.{random.randint(0,99):02d}"
    return f"{head}{val}"

def gen_percent()->str:
    return random.choice(["18%","12 %","20%","ten percent","eighteen percent"])

def gen_project()->str:
    return random.choice(["Project LionX","Codename TigerRay","ProjX","PhoenixAlpha"])

def gen_source_snip()->str:
    return random.choice([
        "def login(user, pwd): return True",
        "api_secret = 'xyz789'",
        "token = get_token()"
    ])

def gen_invoice()->str:
    return f"INV-{random.randint(2023,2026)}-{random.randint(0,999999):06d}"

def gen_po()->str:
    return f"PO-{random.randint(10000,999999)}"

def gen_finreport()->str:
    q = random.choice(["Q1","Q2","Q3","Q4"])
    y = random.randint(2023,2026)
    return f"{q} {y} financial report"

def gen_budget_phrase()->str:
    return f"Budget FY{random.randint(24,26)} is"

def gen_balance_phrase()->str:
    return random.choice(["balance is","current balance:","acct balance:"])

def make_sentences(n_per_label: int = 20):
    ex = []
    # NRIC/FIN/PASSPORT
    for _ in range(n_per_label):
        nric = gen_nric()
        sent = f"Client NRIC is {nric}."
        if random.random()<0.3: sent = f"NRIC: {nric} should not be shared."
        add_example(ex, sent, nric, "NRIC")
        # obfuscation
        if random.random()<0.5:
            obf = f"{nric[0]} {wordify_digits(nric[1:-1])} {nric[-1]}"
            sent2 = f"Client NRIC is {obf}."
            add_example(ex, sent2, obf, "NRIC")

        fin = gen_fin()
        add_example(ex, f"The client's FIN is {fin}.", fin, "FIN")

        passport = random.choice(["E12345678","K98765432","T34567891"])
        add_example(ex, f"Passport number {passport} must be protected.", passport, "PASSPORT")

    # API/ACCESS TOKENS
    for _ in range(n_per_label):
        k = gen_api_key()
        add_example(ex, f"Here is an API key: {k}.", k, "API_KEY")
        add_example(ex, f"Do not share API key {k} with vendors.", k, "API_KEY")
        t = gen_access_token()
        add_example(ex, f"Access token {t} must not leave secure channels.", t, "ACCESS_TOKEN")

    # SALARY / COMMISSION / MONEY / BALANCE / BUDGET / PRICING
    for _ in range(n_per_label):
        money = gen_money()
        add_example(ex, f"Salary is {money}.", money, "SALARY")
        rate = gen_percent()
        add_example(ex, f"Our commission rate is {rate}.", rate, "COMMISSION_RATE")
        # money standalone
        add_example(ex, f"The amount is {money}.", money, "AMOUNT_MONEY")
        # balance phrase
        bal = gen_balance_phrase()
        text = f"{bal} {money}"
        add_example(ex, text, money, "ACCOUNT_BALANCE")
        # budget
        bud = gen_budget_phrase()
        add_example(ex, f"{bud} {money}.", money, "BUDGET")
        # pricing term
        add_example(ex, f"Quote price: {money}/user.", f"{money}/user", "PRICING_TERM")

    # PROJECT / SOURCE CODE
    for _ in range(n_per_label):
        pr = gen_project()
        add_example(ex, f"{pr} launch timeline is confidential.", pr, "PROJECT_CODE")
        sc = gen_source_snip()
        add_example(ex, f"Do not paste source code like: {sc}", sc, "SOURCE_CODE")

    # INVOICE/PO/FINANCIAL_REPORT
    for _ in range(n_per_label):
        inv = gen_invoice()
        add_example(ex, f"Invoice {inv} should not leave the company.", inv, "INVOICE_ID")
        po = gen_po()
        add_example(ex, f"{po} is confidential.", po, "PO_NUMBER")
        fr = gen_finreport()
        add_example(ex, f"Please don't share the {fr}.", fr, "FINANCIAL_REPORT")

    # Negatives
    negatives = [
        "Let's schedule a meeting tomorrow at 3pm.",
        "The weather in Singapore is sunny.",
        "Please review the public documentation.",
        "Can we discuss the UI colors?",
        "Reminder: submit your timesheet.",
        "Our product is great.",
        "This is a general statement."
    ]
    for _ in range(n_per_label):
        s = random.choice(negatives)
        ex.append({"tokens": simple_tok(s), "ner_tags": ["O"]*len(simple_tok(s))})

    # light noise pass
    for i,e in enumerate(ex):
        if random.random()<0.25:
            txt = " ".join(e["tokens"])
            txt = sprinkle_noise(txt)
            ex[i] = {"tokens": simple_tok(txt), "ner_tags": e["ner_tags"][:len(simple_tok(txt))]}

    random.shuffle(ex)
    return ex

def make_pdpa_dataset(n_per_label=20) -> DatasetDict:
    examples = make_sentences(n_per_label=n_per_label)  # ~ n_per_label * (entities + negatives)
    n = len(examples)
    train = examples[: int(0.7*n)]
    val   = examples[int(0.7*n): int(0.85*n)]
    test  = examples[int(0.85*n):]
    return DatasetDict({
        "train": Dataset.from_list(train),
        "validation": Dataset.from_list(val),
        "test": Dataset.from_list(test),
    })

if __name__ == "__main__":
    dataset = make_pdpa_dataset(n_per_label=20)
    dataset.save_to_disk("sg_pdpa_ner_dataset")
    print("Dataset saved to sg_pdpa_ner_dataset")