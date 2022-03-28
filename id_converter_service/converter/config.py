
import codecs
import jsoncfg
import pathlib
import pandas as pd

config = None
with codecs.open(pathlib.Path(__file__).parent.resolve().joinpath('../config.json'), 'r', 'utf-8') as fi:
    config = jsoncfg.loads(fi.read())

print('Succcessfully loaded config')
print(config)
print('')

user_mapping_df = pd.read_csv(pathlib.Path(
    __file__).parent.resolve().joinpath('../user_mapping.csv'), sep=';')
user_mapping_df.reset_index()

user_mapping = {row['name']: row['email']
                for index, row in user_mapping_df.iterrows()}

print('Succcessfully loaded user information')
print(user_mapping)
print('')
