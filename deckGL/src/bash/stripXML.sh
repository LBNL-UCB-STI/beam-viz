
cat 0.events.xml | grep viz_data | sed "s/.*viz_data=\'//" | sed "s/' links.*/,/" | sed "s/\}\]'.*/\}\],/" > trips.json
