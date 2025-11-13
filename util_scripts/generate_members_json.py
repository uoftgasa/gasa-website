import csv
import json
import argparse

def get_names(mem_file):
    name_strs = []
    with open(mem_file, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            name_strs.append(row['Name'].rstrip())
    return sorted(name_strs)

def get_member_positions(name_strs, pos_file):
    all_members = []
    # For each name, find positions from positions file
    with open(pos_file, mode='r') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        for n in name_strs:
            member_positions = ''
            for row in rows:
                if row['(Surname)'] + ', ' + row['Current Holder'] == n:
                    if member_positions == '':
                        member_positions = row['Position']
                    else:
                        member_positions = member_positions + ', ' + row['Position']
            if member_positions == '':
                member_positions = None
            member_obj = {'Name': n, 'Position': member_positions}
            all_members.append(member_obj)
    return all_members

def main():

    parser = argparse.ArgumentParser()
    parser.add_argument("yy_yy", help="Academic year in format 'YY_YY', e.g. '24_25'")
    args = parser.parse_args()

    yy_yy = args.yy_yy
    pos_file = '../members/positions_' + yy_yy + '.csv'
    mem_file = '../members/all_members_' + yy_yy + '.csv'
    out_file = '../members/members' + yy_yy + '.json'

    name_strs = get_names(mem_file)
    m = get_member_positions(name_strs, pos_file)
    with open(out_file, 'w') as outfile:
        json.dump(m, outfile, indent=2)

if __name__ == "__main__":
    main()