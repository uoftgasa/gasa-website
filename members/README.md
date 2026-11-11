# Member lists

The "GASA Members" modal on the home page loads `membersYY_YY.json` (e.g. `members25_26.json` for 2025–26). Each file is a list of `{"Name": "Surname, Given", "Position": "Role A, Role B"}` entries, with `Position` set to `null` for members with no role. [`util_scripts/generate_members_json.py`](../util_scripts/generate_members_json.py) builds the file from two CSVs.

## 1. Add the CSVs

Save both in this folder as UTF-8 CSV, using the `*_25_26.csv` files as templates:

- **`all_members_YY_YY.csv`**: one row per member. Column `Name`, written as `Surname, Given` (e.g. `Atkinson, Alyssa`).
- **`positions_YY_YY.csv`**: one row per position holder. Columns `Position`, `Current Holder` (given name) and `(Surname)` (the header includes the parentheses).

The script ignores all other columns. The repo is public and these CSVs are also served on the live site, so leave out private details such as international-student status or supervisors.

> ⚠️ **Names must match exactly.** A position is attached to the member whose `Name` equals `<(Surname)>, <Current Holder>` character for character. Only trailing spaces on `Name` are ignored. A position with no match is **silently dropped**, so run the check in step 3.
>
> Trim stray spaces in `Position` too. They are copied into the output.

## 2. Generate the JSON

Run the script from `util_scripts/`, because its file paths are relative to that folder:

```bash
cd util_scripts
python3 generate_members_json.py 26_27
```

This writes `members/members26_27.json`, overwriting any existing file. Members are sorted by name, and multiple positions are comma-joined.

## 3. Check for unmatched names

Run this from the repo root. It prints nothing if every position matched:

```bash
YEAR=26_27 python3 - <<'EOF'
import csv, os
y = os.environ["YEAR"]
names = {r["Name"].rstrip() for r in csv.DictReader(open(f"members/all_members_{y}.csv"))}
for r in csv.DictReader(open(f"members/positions_{y}.csv")):
    holder = f'{r["(Surname)"]}, {r["Current Holder"]}'
    if holder not in names:
        print(f'NOT MATCHED: {r["Position"]!r} -> {holder!r}')
EOF
```

Fix any names it prints in the CSVs, then repeat step 2.

## 4. Show it on the site

In `index.html`, find the members modal (`<!-- members list -->`):

1. Add the new year at the top of the dropdown, above the divider, and move last year below it:

   ```html
   <li><a class="dropdown-item" href="javascript:;" onclick="$table.bootstrapTable('refresh', {url: './members/members26_27.json'});">2026-2027</a></li>
   ```

2. Update the dropdown button's label and the table's `data-url` to the new year.

Preview locally (see [Run locally](../README.md#run-locally)), then commit the CSVs, the JSON and `index.html`.
