import json

with open('datadump.json', 'r', encoding='utf-16') as f:
    data = json.load(f)

# Filter out contenttypes and auth.permission records
filtered = [item for item in data if item.get('model') not in ['contenttypes.contenttype', 'auth.permission']]

with open('datadump_filtered.json', 'w', encoding='utf-8') as f:
    json.dump(filtered, f, indent=2)

print(f"Filtered {len(data) - len(filtered)} records. Kept {len(filtered)} records.")
