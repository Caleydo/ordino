# ID Converter Service

This package, more specifically the `main.py`, is used to migrate the data in MongoDBs by: 
 * removing the internal ids stored as "range" and replacing them with lists of real "names", i.e. "(12:15)" -> ["ENSG...", "ENSG...", ...]
 * replacing usernames with the ones provided in the `user_mapping.csv`. Make sure the column names are `name;email` separated by `;`

## Prerequisites

A running MongoDB storing the namedsets, attachments, graphs, ... + Redis with the ID mappings.

## How to use?

Add the following entry to your `docker-compose.yml`:


```yml
  converter_service:
    build:
      context: ./ordino/id_converter_service
      dockerfile: ./Dockerfile
    volumes:
      - ./ordino/id_converter_service:/phovea
      # - ./my_config.json:/phovea/config.json  <- config.json volume
      # - ./my_user_mapping.csv:/phovea/user_mapping.csvn  <- user_mapping.csv volume
    environment:
      - CONVERTER_DRY_RUN=True  # <- change this to False if you want to **really** persist the data
    depends_on:
      - db_mongo
      - db_redis
```

Ideally, a prebuilt-image is run within the environment doing the conversion. This task is left as an exercise for the reader. 

### Configuration

Two files need to be configured (probably via volumes) before running it:

 * `config.json`: contains the url of the MongoDB and Redis. See the default `config.json` for details. 
 * `user_mapping.csv`: contains the user mappings (empty by default).

## Running it

Now, you can run the service via `docker-compose up converter_service`, which will call the `main.py` and start the converter in **DRY-RUN**-mode. **No changes will be persisted yet!**. 

If you are 100% sure that the script will run through without any issues, or you have inspected the dry-run logs, you can set the ENV-variable `CONVERTER_DRY_RUN` to `False` (s. `docker-compose.yml`). **DANGER: This will now persist all changes!**



## Notes

* Some files have been copied 1:1 from phovea_server or tdp_core, like `req.txt`, `converter/range.py` and `converter/assigner.py`. They have been slightly modified to work outside of the server context.