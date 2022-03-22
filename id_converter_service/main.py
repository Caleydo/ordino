from converter.range import parse_range
from converter.config import config, user_mapping
from converter.assigner import RedisIDAssigner
from pymongo import MongoClient
import os
from distutils.util import strtobool


dry_run = strtobool(os.environ.get('CONVERTER_DRY_RUN', "True"))


if dry_run:
    print('Running in DRY-RUN mode')
else:
    print('Running in STORE mode')


missing_users = set()


# Create mongo clients
mongoclient = MongoClient(config['mongo']['host'], config['mongo']['port'])
namedsets_db = mongoclient[config['mongo']['db_namedsets']]
graph_db = mongoclient[config['mongo']['db_graph']]
lineup_db = mongoclient['lineup']
# Create assigner
assigner = RedisIDAssigner()


def unmap_ids(ids, idtype):
    if not ids:
        return ids

    assert idtype

    unmapped_ids = assigner.unmap(ids, idtype)
    if None in unmapped_ids:
        none_index = unmapped_ids.index(None)
        print(
            f'      None is in the unmapped ids at index {none_index} with original id {ids[none_index]}')
        unmapped_ids = [id for id in unmapped_ids if id is not None]
        print(
            f'        Continuing with {len(unmapped_ids)} filtered ids instead.')
    elif len(ids) != len(unmapped_ids):
        print(
            f'      The length mismatches ({len(ids)} old vs. {len(unmapped_ids)} new)')
    else:
        print(
            f'        Successfully converted all ids to real ids: {unmapped_ids[:5]}...')

    return unmapped_ids


print('Processing namedsets:')
all_namedsets_idtypes = namedsets_db.namedsets.distinct('idType')
print(f'Distinct idtypes in namedsets: {all_namedsets_idtypes}\n')

print('Processing namedsets_db.namedsets:')
for namedset in namedsets_db.namedsets.find():
    _id = namedset['_id']
    name = namedset['name']
    creator = namedset['creator']
    idtype = namedset['idType']
    ids = namedset['ids']
    # TODO: No buddies in this dataset.

    print(
        f'    Namedset "{name}..." with idtype "{idtype}" has {len(ids)} to convert:')

    unmapped_ids = unmap_ids(ids, idtype)

    if creator in user_mapping:
        print(
            f'        Successfully converted creator from {creator} to {user_mapping.get(creator)}')
    else:
        missing_users.add(creator)
        print(
            f'        Creator {creator} missing in user mapping, keeping the same...')

    if not dry_run:
        namedsets_db.namedsets.update_one({"_id": _id}, {"$set": {
            "ids": unmapped_ids,
            "creator": user_mapping.get(creator, creator)
        }})

# TODO: Update all documents and rewrite ids_updated to ids, creator_updated to creator, and delete ids_updated, creator_updated


# Processing in namedsets_db.attachments TODO: Anything missing?
print('Processing namedsets_db.attachments:')
for attachment in namedsets_db.attachments.find():
    _id = attachment['_id']
    id = attachment['id']
    creator = attachment['creator']
    # TODO: No buddies in this dataset.

    print(f'    Attachment "{id}...":')
    if creator in user_mapping:
        print(
            f'        Successfully converted creator from {creator} to {user_mapping.get(creator)}')
    else:
        missing_users.add(creator)
        print(
            f'        Creator {creator} missing in user mapping, keeping the same...')

    if not dry_run:
        namedsets_db.attachments.update_one({"_id": _id}, {"$set": {
            "creator": user_mapping.get(creator, creator)
        }})

# TODO: Update all documents and rewrite creator_updated to creator, and delete creator_updated


print('\nProcessing lineup:')

# Processing in lineup_db.datasets
print('Processing lineup_db.datasets:')
for lineup_dataset in lineup_db.datasets.find():
    _id = lineup_dataset['_id']
    name = lineup_dataset['name']
    creator = lineup_dataset['creator']
    group = lineup_dataset.get('group')  # optional
    # TODO: No buddies in this dataset.

    print(f'    Lineup Dataset "{name}...":')
    if creator in user_mapping:
        print(
            f'        Successfully converted creator from {creator} to {user_mapping.get(creator)}')
    else:
        missing_users.add(creator)
        print(
            f'        Creator {creator} missing in user mapping, keeping the same...')

    if group:
        if group in user_mapping:
            print(
                f'        Successfully converted group from {group} to {user_mapping.get(group)}')
        else:
            missing_users.add(creator)
            print(
                f'        Group {group} missing in user mapping, keeping the same...')

    if not dry_run:
        lineup_db.datasets.update_one({"_id": _id}, {"$set": {
            "creator": user_mapping.get(creator, creator),
            "group": user_mapping.get(group, group)
        }})


# TODO: Nothing to process in lineup_db.datasets_data?
# TODO: Nothing to process in lineup_db.datasets_rows?


print('\nProcessing graph:')

# Processing of graph_db.graph
print('Processing graph_db.graph:')
for graph in graph_db.graph.find():
    _id = graph['_id']
    name = graph['name']
    creator = graph['creator']
    buddies = graph.get('buddies')  # optional
    # group = graph.get('group') TODO: Apparently no usernames in there...

    print(f'    Graph "{name}...":')
    if creator in user_mapping:
        print(
            f'        Successfully converted creator from {creator} to {user_mapping.get(creator)}')
    else:
        missing_users.add(creator)
        print(
            f'        Creator {creator} missing in user mapping, keeping the same...')

    new_buddies = [user_mapping.get(b, b)
                   for b in buddies] if buddies else None
    if buddies:
        print(f'        Updated buddies from {buddies} to {new_buddies}')

    if not dry_run:
        graph_db.graph.update_one({"_id": _id}, {"$set": {
            "creator": user_mapping.get(creator, creator)
        }})

        # Optionally set the buddies, as None is not allowed as value (from phovea_server.security)
        if new_buddies:
            graph_db.graph.update_one({"_id": _id}, {"$set": {
                "buddies": new_buddies
            }})


# Processing of graph_db.graph_data
print('Processing graph_db.graph_data:')
for graph_data in graph_db.graph_data.find():
    _id = graph_data['_id']

    nodes = graph_data['nodes']

    print(f'    Graph_Data "{str(_id)}...":')
    for node in nodes:
        # Possible "paths" to update

        # nodes.attrs.parameter.idtype: null,
        # nodes.attrs.parameter.selection: "(),()"
        # nodes.attrs.parameter.itemSelection: null

        # nodes.attrs.parameter.itemSelection: null or { "idtype" : "Ensembl", "selection" : "52009" }

        # nodes.attrs.parameter.idtype: null,
        # nodes.attrs.parameter.range: "(),()"

        # nodes.attrs.parameter.idtype: "Ensembl",
        # nodes.attrs.parameter.selection: "(),()" or "(29278,57111,65887)"
        # nodes.attrs.parameter.itemSelection: null,

        # nodes.attrs.parameter.idtype: "Ensembl",
        # nodes.attrs.parameter.range: "(29278,57111)"

        # Patch the user name
        if node.get('attrs', {}).get('meta', {}).get('user'):
            creator = node['attrs']['meta']['user']

            if creator in user_mapping:
                print(
                    f'        Successfully converted creator from {creator} to {user_mapping.get(creator)}')
            else:
                missing_users.add(creator)
                print(
                    f'        Creator {creator} missing in user mapping, keeping the same...')

            node['attrs']['meta']['user'] = user_mapping.get(creator, creator)

        parameter = node.get('attrs', {}).get('parameter', {})
        # in ordino cmds.ts, asSelection changed from returning { range: '(...)', idtype: 'Ensembl' } to { ids: [...], idtype: 'Ensembl' }
        if 'range' in parameter and parameter['range']:
            print(f'        Updating range')
            # TODO: Assume we only have 1D ranges
            ids = parse_range(parameter['range']).dims[0].tolist()
            # Unmap the ids
            unmapped_ids = unmap_ids(ids, parameter.get('idtype'))

            # range was renamed to ids
            node['attrs']['parameter']['ids'] = unmapped_ids
            del node['attrs']['parameter']['range']

        # in ordino cmds.ts, serializeSelection changed from returning { idtype: 'Ensembl', selection: '(...)' } to { idtype: 'Ensembl', selection: [...] }
        if 'selection' in parameter and parameter['selection']:
            print(f'        Updating selection')
            # TODO: Assume we only have 1D ranges
            ids = parse_range(parameter['selection']).dims[0].tolist()
            # Unmap the ids
            unmapped_ids = unmap_ids(ids, parameter.get('idtype'))

            # selection was not renamed, it is now an array of unmapped ids
            node['attrs']['parameter']['selection'] = unmapped_ids

        if 'itemSelection' in parameter and parameter['itemSelection']:
            print(f'        Updating itemSelection')
            # TODO: Assume we only have 1D ranges
            ids = parse_range(
                parameter['itemSelection']['selection']).dims[0].tolist()
            # Unmap the ids
            unmapped_ids = unmap_ids(
                ids, parameter['itemSelection'].get('idtype'))

            # selection was not renamed, it is now an array of unmapped ids
            node['attrs']['parameter']['itemSelection']['selection'] = unmapped_ids

    if not dry_run:
        graph_db.graph_data.update_one({"_id": _id}, {"$set": {
            "nodes": nodes
        }})


print(f'\nMigration successful! Dry-Run: {dry_run}')
print('Summary: \n')
print(f'missing users: {list(missing_users)}')
