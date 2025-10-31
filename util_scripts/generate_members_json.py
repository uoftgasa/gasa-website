import csv

def getPositions(first_name, last_name, input_file):
    positions = []
    with open(input_file, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if row['Current Holder'] == first_name and row['(Surname)'] == last_name:
                positions.append(row['position'])
    position_string = ', '.join(sorted(positions))
    return position_string

def __main__():
    args = parse_args()
    members = load_members(args.input)
    member_list = []
    for member in members:
        positions = getPositions(member.first_name, member.last_name)
        member.positions = positions
    generate_json(members, args.output) 