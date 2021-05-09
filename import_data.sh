#!/bin/bash

set -e

docker_hash=$1
csv_data_type=$2

if [[ ${#docker_hash} != 3 || ${#csv_data_type} -le 2 ]]
	then
    echo "Script use: provide the 3 first letter of the hash of the container of omnisci, e.g. 6af, and the location of csv data [handcrafted|generated] (this will be the db name as well)"
    exit 1
fi
sudo docker exec -i $docker_hash mkdir -p database-storage
sudo docker cp $csv_data_type $docker_hash:/database-storage/$csv_data_type/
echo "CSV data moved to docker container!"



for csv in $csv_data_type/*.csv; do
	table=$(echo $csv | cut -d'/' -f 2 | cut -d'.' -f 1)
	echo "COPY $table FROM '/database-storage/$csv_data_type/$table.csv' delimiter ',' csv header;" | sudo docker exec -i $docker_hash psql -d $csv_data_type -U postgres 
	echo -e "\tTable $table filled!"
done
echo "All tables filled!"

echo "Done!"
