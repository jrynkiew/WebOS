#!/bin/sh
source ./env.sh

scripts=`find . -name "*.sh" -not -path "$0"`
unittests=`find ../objs -name "*_unittest" -type f`

for script in `ls *.sh` `echo ${unittests} | sed 's/  /\n/g'`
do
	if [ "./$script" = "$0" ]; then
		continue
	fi
	script=$(echo "$script" | tr -d '\r')
	echo "Test:[$script]"
	echo "============================================================="
	./$script
	echo ""
	echo "============================================================="
done
